"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { availablePages } from "@/global/links";
import { UserData } from "@/types/users";
import isArrayHasData from "@/lib/isArrayHasData";
import AddOrEditUser from "./AddOrEditUser";
import DeleteDialog from "@/components/shared/delete-dialog";
import { deleteUser } from "@/services/user";

interface TableViewProps {
    users: UserData[];
}

const TableView = ({ users }: TableViewProps) => {
    return (
        <div className="rounded-xl border p-3 bg-card shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {!isArrayHasData(users) ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">No users found.</TableCell>
                        </TableRow>
                    ) : (
                        users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell className="font-medium">
                                    {user.fullName}
                                </TableCell>
                                <TableCell className="font-medium">{user.username}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="capitalize">
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {user.allowedPages?.length > 0 ? (
                                            user.allowedPages.map((page: string) => (
                                                <Badge key={page} variant="secondary" className="text-[10px]">
                                                    {availablePages.find(p => p.href === page)?.label || page}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-xs text-muted-foreground">No access</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <AddOrEditUser currentUser={user} />
                                        <DeleteDialog id={user?._id || ""} deleteAction={deleteUser} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default TableView;