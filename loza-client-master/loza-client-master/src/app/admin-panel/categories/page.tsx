"use client";

import { useEffect, useState } from "react";
import { TagIcon, PlusIcon, PencilIcon, TrashIcon } from "lucide-react";
import {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/redux/features/categories/categoryApi";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Buttonn";

export default function CategoriesPage() {
  const { data, isLoading, refetch } = useGetCategoriesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const [addCategory, { isSuccess: isAddSuccess, error: addError }] =
    useAddCategoryMutation();
  const [updateCategory, { isSuccess: isUpdateSuccess, error: updateError }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isSuccess: isDeleteSuccess, error: deleteError }] =
    useDeleteCategoryMutation();

  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // modal states
  const [openAdd, setOpenAdd] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const [openEdit, setOpenEdit] = useState(false);
  const [editCategory, setEditCategory] = useState<any>(null);

  const [openDelete, setOpenDelete] = useState(false);
  const [deleteCategoryData, setDeleteCategoryData] = useState<any>(null);

  useEffect(() => {
    if (data) {
      setCategories(data.categories);
    }
  }, [data]);

  // success handlers
  useEffect(() => {
    if (isAddSuccess) {
      toast.success("Category Added!");
      setOpenAdd(false);
      setNewCategory("");
      refetch();
    }
  }, [isAddSuccess, refetch]);

  useEffect(() => {
    if (isUpdateSuccess) {
      toast.success("Category Updated!");
      setOpenEdit(false);
      setEditCategory(null);
      refetch();
    }
  }, [isUpdateSuccess, refetch]);

  useEffect(() => {
    if (isDeleteSuccess) {
      toast.success("Category Deleted!");
      setOpenDelete(false);
      setDeleteCategoryData(null);
      refetch();
    }
  }, [isDeleteSuccess, refetch]);

  // error handlers
  useEffect(() => {
    const handleError = (err: any) => {
      if (err && "data" in err) {
        toast.error(err.data.message);
      } else if (err) {
        toast.error("Something went wrong");
      }
    };
    handleError(addError);
    handleError(updateError);
    handleError(deleteError);
  }, [addError, updateError, deleteError]);

  // handlers
  const handleAdd = () => {
    if (!newCategory.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
    addCategory({ category: newCategory });
  };

  const handleUpdate = () => {
    if (!editCategory?.name.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
    updateCategory({
      id: editCategory._id,
      data: { name: editCategory.name },
    });
  };

  const handleDelete = () => {
    if (!deleteCategoryData?._id) return;
    deleteCategory(deleteCategoryData._id);
  };

  const filteredCategories = categories?.filter((category) =>
    category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Categories Management
          </h1>
          <button
            onClick={() => setOpenAdd(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-200 flex items-center"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Category
          </button>
        </div>

        {/* 🔍 Search Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories?.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <TagIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No categories found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or add a new category.
              </p>
            </div>
          ) : (
            filteredCategories?.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <TagIcon className="w-8 h-8 text-purple-600 mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {category?.name}
                      </h3>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-900"
                      onClick={() => {
                        setEditCategory(category);
                        setOpenEdit(true);
                      }}
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => {
                        setDeleteCategoryData(category);
                        setOpenDelete(true);
                      }}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>{category?.products} product</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Category Modal */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Enter category name"
            value={newCategory}
            onChange={(e: any) => setNewCategory(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAdd(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Modal */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Enter category name"
            value={editCategory?.name || ""}
            onChange={(e: any) =>
              setEditCategory({ ...editCategory, name: e.target.value })
            }
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEdit(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Modal */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{deleteCategoryData?.name}</span>?
            <br />
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDelete(false)}>
              Cancel
            </Button>
            <Button onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
