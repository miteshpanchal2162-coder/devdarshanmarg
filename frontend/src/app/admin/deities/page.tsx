import { AdminHeader } from "@/components/admin/admin-header";
import { EntityListPage } from "@/components/admin/entity-list-page";

export default function DeitiesPage() {
  return (
    <>
      <AdminHeader title="Deities" />
      <div className="flex flex-1 flex-col p-4 md:p-6">
        <EntityListPage
          title="Deity Types"
          description="Manage deity classifications (Shiva, Vishnu, Shakti, etc.)"
          endpoint="/deities"
          entityName="Deity"
        />
      </div>
    </>
  );
}
