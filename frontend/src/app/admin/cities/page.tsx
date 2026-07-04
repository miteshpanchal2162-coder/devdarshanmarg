import { AdminHeader } from "@/components/admin/admin-header";
import { EntityListPage } from "@/components/admin/entity-list-page";

export default function CitiesPage() {
  return (
    <>
      <AdminHeader title="Cities" />
      <div className="flex flex-1 flex-col p-4 md:p-6">
        <EntityListPage
          title="Cities"
          description="Manage cities for temple locations"
          endpoint="/cities"
          entityName="City"
        />
      </div>
    </>
  );
}
