"use client"

import { useTransition } from "react";
import { useFormManager, useVisibility } from "@/hooks";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Lock, User, Edit, Text } from "lucide-react";
import { userSchema, createUserSchema } from "@/validations/user";
import { availablePages } from "@/global/links";
import { SelectField } from "@/components/ui/select";
import { toast } from "sonner";
import { createUser, updateUser } from "@/services/user";
import { LabeledCheckBox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { UserData } from "@/types/users";

interface AddOrEditUserProps {
    currentUser?: UserData;
}

const AddOrEditUser = ({ currentUser }: AddOrEditUserProps) => {
    const { visible, handleStateChange, handleClose } = useVisibility();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const editingUser = !!currentUser;

    const { formData, handleChange, handleFieldChange, resetForm, validate, errors } = useFormManager<UserData>({
        initialData: {
            username: "",
            password: "",
            allowedPages: [] as string[],
            role: "staff",
            fullName: "",
            ...currentUser
        },
        schema: !!editingUser ? userSchema : createUserSchema
    })

    const handleSubmit = () => {
        if (!validate()) return
        startTransition(async () => {
            const _fn = editingUser ? updateUser : createUser;
            const result = await _fn(formData);

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(editingUser ? "User updated successfully" : "User created successfully");
                router.refresh();
                handleClose();
                resetForm();
            }
        });
    };

    const handleChangeAllowedPages = (href: string) => (checked: boolean | 'indeterminate') => {
        const currentPages = formData.allowedPages as string[];
        const newPages = checked
            ? [...currentPages, href]
            : currentPages.filter((p) => p !== href);
        handleFieldChange({ name: "allowedPages", value: newPages });
    };

    return (
        <Dialog open={visible} onOpenChange={handleStateChange}>
            <DialogTrigger asChild>
                {editingUser ? (
                    <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                    </Button>
                ) : (
                    <Button className="gap-2 m-2">
                        <Plus className="w-4 h-4" /> Add User
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-125">
                <DialogHeader>
                    <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <div className="relative">
                        <Text className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            className="pl-9"
                            placeholder="Enter full name"
                            value={formData.fullName}
                            onChange={handleChange}
                            name="fullName"
                            required
                            error={errors?.fullName}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Username</label>
                    <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            className="pl-9"
                            placeholder="Enter username"
                            value={formData.username}
                            onChange={handleChange}
                            name="username"
                            required
                            error={errors?.username}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        {editingUser ? "New Password (leave blank to keep current)" : "Password"}
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            className="pl-9"
                            type="password"
                            placeholder="Enter password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required={!editingUser}
                            error={errors?.password}
                        />
                    </div>
                </div>

                <SelectField
                    label="Role"
                    name="role"
                    value={formData.role as string}
                    onValueChange={(value) => handleFieldChange({ name: "role", value })}
                    options={[
                        { key: "staff", label: "Staff" },
                        { key: "cashier", label: "Cashier" },
                        { key: "admin", label: "Admin" },
                    ]}
                    error={errors?.role}
                />

                <div className="space-y-2">
                    <label className="text-sm font-medium">Allowed Pages</label>
                    <div className="grid grid-cols-2 gap-2 border rounded-md p-3">
                        {availablePages.filter(page => {
                            if (page.href === "/management/pos" && !["staff", "cashier"].includes(formData.role)) return false;
                            return true;
                        }).map((page, index) => (
                            <LabeledCheckBox
                                hidePlaceHolder
                                key={index}
                                label={page.label}
                                name={page.label}
                                checked={formData.allowedPages.includes(page.href)}
                                onCheckedChange={handleChangeAllowedPages(page.href)}
                            />
                        ))}
                    </div>
                </div>

                <DialogFooter className="pt-4">
                    <Button onClick={handleSubmit} className="w-full" disabled={isPending}>
                        {editingUser ? "Update User" : "Create User"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddOrEditUser;