import { getUsers } from "@/services/user";
import { AddOrEditUser, TableView } from "@/components/users"

export default async function UsersPage() {
    const users = await getUsers();
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground">Manage system users and their access permissions.</p>
                </div>
                <AddOrEditUser />
            </div>
            <TableView users={users} />
        </div>
    );
}