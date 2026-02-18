"use client"

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useFormManager, useVisibility } from "@/hooks";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Check, X, List, Save } from "lucide-react";
import { toast } from "sonner";
import { updateCategory, deleteCategory, bulkCreateCategories } from "@/services/menu";
import { categorySchema } from "@/validations/menu";
import { CategoryItem } from "@/types/menu";
import { CategoryInput } from "@/validations/menu";
import DeleteDialog from "@/components/shared/delete-dialog";

interface CategoryDialogProps {
    categories: CategoryItem[];
}

const CategoryDialog = ({ categories }: CategoryDialogProps) => {
    const { visible, handleStateChange } = useVisibility();
    const router = useRouter();
    const tMenu = useTranslations("Menu");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    // Form for editing existing items
    const {
        formData: editFormData,
        handleChange: handleEditChange,
        resetForm: resetEditForm,
        setFormData: setEditFormData,
        validate: validateEdit
    } = useFormManager({
        initialData: {
            name: { en: "", ar: "" },
        },
        schema: categorySchema,
    });

    // Form for adding NEW items (Batch)
    const {
        formData: batchFormData,
        handleChange: handleBatchChange,
        setFormData: setBatchData,
        resetForm: resetBatchForm
    } = useFormManager({
        initialData: {
            items: [] as CategoryInput[]
        }
    });

    const handleEditClick = (category: CategoryItem) => {
        setEditingId(category._id);
        setEditFormData({
            _id: category._id,
            name: { ...category.name },
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        resetEditForm();
    };

    const handleSaveEdit = async () => {
        if (!validateEdit()) return;

        startTransition(async () => {
            const result = await updateCategory(editFormData);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Category updated");
                router.refresh();
                handleCancelEdit();
            }
        });
    };

    const handleAddClick = () => {
        setBatchData(prev => ({
            items: [
                { name: { en: "", ar: "" } },
                ...prev.items
            ]
        }));
    };

    const handleRemoveBatchItem = (index: number) => {
        setBatchData(prev => ({
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const handleSaveBatch = async () => {
        if (batchFormData.items.length === 0) return;

        // Simple validation
        const invalid = batchFormData.items.some(item => !item.name.en || !item.name.ar || item.name.en.length < 3 || item.name.ar.length < 3);
        if (invalid) {
            toast.error("Please fill all fields (min 3 chars)");
            return;
        }

        startTransition(async () => {
            const result = await bulkCreateCategories(batchFormData.items);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(`${batchFormData.items.length} categories created`);
                router.refresh();
                resetBatchForm();
            }
        });
    };

    return (
        <Dialog open={visible} onOpenChange={handleStateChange}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <List className="w-4 h-4" /> {tMenu("category")}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Manage Categories</DialogTitle>
                </DialogHeader>

                <div className="flex justify-end gap-2 mb-2">
                    <Button onClick={handleAddClick} size="sm" variant="outline">
                        <Plus className="w-4 h-4 mr-2" /> Add Row
                    </Button>
                    {batchFormData.items.length > 0 && (
                        <Button onClick={handleSaveBatch} size="sm" isLoading={isPending}>
                            <Save className="w-4 h-4 mr-2" /> Save New ({batchFormData.items.length})
                        </Button>
                    )}
                </div>

                <div className="border rounded-md max-h-[60vh] overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{tMenu("nameEn")}</TableHead>
                                <TableHead>{tMenu("nameAr")}</TableHead>
                                <TableHead className="w-[100px] text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* New Batch Rows */}
                            {batchFormData.items.map((item, index) => (
                                <TableRow key={`new-${index}`} className="bg-muted/30">
                                    <TableCell>
                                        <Input
                                            value={item.name.en}
                                            onChange={handleBatchChange}
                                            name={`items.${index}.name.en`}
                                            placeholder="English Name"
                                            autoFocus={index === 0}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            value={item.name.ar}
                                            onChange={handleBatchChange}
                                            name={`items.${index}.name.ar`}
                                            placeholder="Arabic Name"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end">
                                            <Button size="icon" variant="ghost" onClick={() => handleRemoveBatchItem(index)}>
                                                <X className="w-4 h-4 text-muted-foreground hover:text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {/* Existing Categories */}
                            {categories.map((cat) => (
                                <TableRow key={cat._id}>
                                    {editingId === cat._id ? (
                                        <>
                                            <TableCell>
                                                <Input
                                                    value={editFormData.name.en}
                                                    onChange={handleEditChange}
                                                    name="name.en"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    value={editFormData.name.ar}
                                                    onChange={handleEditChange}
                                                    name="name.ar"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button size="icon" variant="ghost" onClick={handleSaveEdit} disabled={isPending}>
                                                        <Check className="w-4 h-4 text-green-500" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" onClick={handleCancelEdit}>
                                                        <X className="w-4 h-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </>
                                    ) : (
                                        <>
                                            <TableCell>{cat.name.en}</TableCell>
                                            <TableCell>{cat.name.ar}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button size="icon" variant="ghost" onClick={() => handleEditClick(cat)}>
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <DeleteDialog id={cat._id} deleteAction={deleteCategory} />
                                                </div>
                                            </TableCell>
                                        </>
                                    )}
                                </TableRow>
                            ))}

                            {/* If empty */}
                            {categories.length === 0 && batchFormData.items.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                                        No categories found. Start by adding one!
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CategoryDialog;