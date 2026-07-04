import { AdminHeader } from "@/components/admin/admin-header";
import { EntityListPage } from "@/components/admin/entity-list-page";

export default function CountriesPage() {
  return (
    <>
      <AdminHeader title="Countries" />
      <div className="flex flex-1 flex-col p-4 md:p-6">
        <EntityListPage
          title="Countries"
          description="Manage countries for temple locations"
          endpoint="/countries"
          entityName="Country"
        />
      </div>
    </>
  );
}
