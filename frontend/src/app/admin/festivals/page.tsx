import { AdminHeader } from "@/components/admin/admin-header";
import { EntityListPage } from "@/components/admin/entity-list-page";

export default function FestivalsPage() {
  return (
    <>
      <AdminHeader title="Festivals" />
      <div className="flex flex-1 flex-col p-4 md:p-6">
        <EntityListPage
          title="Festivals"
          description="Manage festivals celebrated at temples"
          endpoint="/festivals"
          entityName="Festival"
        />
      </div>
    </>
  );
}
