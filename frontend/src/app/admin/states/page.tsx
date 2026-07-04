import { AdminHeader } from "@/components/admin/admin-header";
import { EntityListPage } from "@/components/admin/entity-list-page";

export default function StatesPage() {
  return (
    <>
      <AdminHeader title="States" />
      <div className="flex flex-1 flex-col p-4 md:p-6">
        <EntityListPage
          title="States"
          description="Manage states and provinces"
          endpoint="/states"
          entityName="State"
        />
      </div>
    </>
  );
}
