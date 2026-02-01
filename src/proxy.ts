import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { getAuthSession } from "./lib/auth-utils";
import { UserData } from "@/types/users";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Identify locale and clean pathname (strip locale prefix)
  const segments = pathname.split("/");
  const firstSegment = segments[1];
  const isLocale = routing.locales.includes(
    firstSegment as (typeof routing.locales)[number],
  );

  // cleanPathname will be something like "/management/users" or "/"
  const cleanPathname = isLocale ? `/${segments.slice(2).join("/")}` : pathname;

  // Normalized path for comparison (ensuring it starts with / and remove trailing slash)
  const normalizedPath = cleanPathname.replace(/\/$/, "") || "/";

  // 2. Get auth session (Initial verification from cookie)
  let auth = (await getAuthSession()) as UserData | null;

  // 3. Logic Application
  const isManagementRoute = normalizedPath.startsWith("/management");
  const isLoginPage = normalizedPath === "/login";

  let updateCookie: string | null = null;

  // 4. Revalidate from Database for Management routes
  if (isManagementRoute && auth) {
    try {
      // Fetch latest user data from DB via Node.js API bridge
      const revalidateResponse = await fetch(
        new URL("/api/auth/revalidate", request.url),
        {
          headers: {
            cookie: request.headers.get("cookie") || "",
          },
        },
      );

      if (revalidateResponse.ok) {
        const data = await revalidateResponse.json();
        if (data.success && data.user) {
          auth = data.user;
          // Propagate new cookie if data was updated
          updateCookie = revalidateResponse.headers.get("set-cookie");
        }
      } else if (
        revalidateResponse.status === 401 ||
        revalidateResponse.status === 404
      ) {
        auth = null;
      }
    } catch (error) {
      console.error("Middleware revalidation fetch failed:", error);
    }
  }

  // Helper to attach updated cookies to response
  const withCookie = (res: NextResponse) => {
    if (updateCookie) {
      res.headers.set("set-cookie", updateCookie);
    }
    return res;
  };

  // Case A: User is trying to access a Management route
  if (isManagementRoute) {
    if (!auth) {
      const locale = isLocale ? firstSegment : routing.defaultLocale;
      return withCookie(
        NextResponse.redirect(new URL(`/${locale}/login`, request.url)),
      );
    }

    // Permission check
    const allowedPages = (auth.allowedPages || []) as string[];
    const isAllowed = allowedPages.some(
      (page) =>
        normalizedPath === page ||
        (page !== "/management" && normalizedPath.startsWith(page + "/")),
    );

    if (!isAllowed) {
      const locale = isLocale ? firstSegment : routing.defaultLocale;
      return withCookie(
        NextResponse.rewrite(new URL(`/${locale}/forbidden`, request.url)),
      );
    }
  }

  // Case B: Authenticated user tries to access login page
  if (auth && isLoginPage) {
    const locale = isLocale ? firstSegment : routing.defaultLocale;
    const allowedPages = (auth.allowedPages || []) as string[];
    const target = allowedPages.length > 0 ? allowedPages[0] : "/management";
    return withCookie(
      NextResponse.redirect(new URL(`/${locale}${target}`, request.url)),
    );
  }

  // Case C: All other routes
  return withCookie(intlMiddleware(request) as NextResponse);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
