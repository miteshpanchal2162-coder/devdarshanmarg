import { AdminHeader } from "@/components/admin/admin-header";
import { EntityListPage } from "@/components/admin/entity-list-page";

export default function CategoriesPage() {
  return (
    <>
      <AdminHeader title="Categories" />
      <div className="flex flex-1 flex-col p-4 md:p-6">
        <EntityListPage
          title="Temple Categories"
          description="Manage temple categories (Jyotirlinga, Shakti Peeth, etc.)"
          endpoint="/categories"
          entityName="Category"
        />
      </div>
    </>
  );
}
