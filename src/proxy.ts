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

  // 2. Get auth session
  const auth = (await getAuthSession()) as UserData | null;

  // 3. Logic Application
  const isManagementRoute = normalizedPath.startsWith("/management");
  const isLoginPage = normalizedPath === "/login";

  // Case A: User is trying to access a Management route
  if (isManagementRoute) {
    // 1. Must be authenticated
    if (!auth) {
      const locale = isLocale ? firstSegment : routing.defaultLocale;
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }

    // 2. Must have permission
    const allowedPages = (auth.allowedPages || []) as string[];
    const isAllowed = allowedPages.some(
      (page) =>
        normalizedPath === page ||
        (page !== "/management" && normalizedPath.startsWith(page + "/")),
    );

    if (!isAllowed) {
      const locale = isLocale ? firstSegment : routing.defaultLocale;
      return NextResponse.rewrite(new URL(`/${locale}/forbidden`, request.url));
    }
  }

  // Case B: Authenticated user tries to access login page
  if (auth && isLoginPage) {
    const locale = isLocale ? firstSegment : routing.defaultLocale;
    // Redirect to the first allowed page or dashboard
    const allowedPages = (auth.allowedPages || []) as string[];
    const target = allowedPages.length > 0 ? allowedPages[0] : "/management";
    return NextResponse.redirect(new URL(`/${locale}${target}`, request.url));
  }

  // Case C: Everything else (Public routes, etc.)
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except for static files and api routes
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
