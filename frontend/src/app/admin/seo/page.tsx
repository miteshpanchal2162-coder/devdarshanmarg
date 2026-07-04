"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface Redirect {
  id: string;
  fromPath: string;
  toPath: string;
  statusCode: number;
  isActive: boolean;
}

interface LandingPage {
  id: string;
  slug: string;
  language: string;
  title: string;
  isActive: boolean;
}

/** SEO management — redirects and landing pages */
export default function SeoPage() {
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch<{ items: Redirect[] }>("/seo/redirects").catch(() => ({ items: [] })),
      apiFetch<{ items: LandingPage[] }>("/seo/landing-pages").catch(() => ({ items: [] })),
    ]).then(([r, l]) => {
      setRedirects(r.items);
      setLandingPages(l.items);
    }).finally(() => setLoading(false));
  }, []);

  const redirectColumns: Column<Redirect>[] = [
    { key: "from", header: "From", cell: (row) => <code className="text-xs">{row.fromPath}</code> },
    { key: "to", header: "To", cell: (row) => <code className="text-xs">{row.toPath}</code> },
    { key: "code", header: "Code", cell: (row) => row.statusCode },
    { key: "active", header: "Active", cell: (row) => (row.isActive ? "Yes" : "No") },
  ];

  const landingColumns: Column<LandingPage>[] = [
    { key: "slug", header: "Slug", cell: (row) => row.slug },
    { key: "title", header: "Title", cell: (row) => row.title },
    { key: "lang", header: "Language", cell: (row) => row.language.toUpperCase() },
    { key: "active", header: "Active", cell: (row) => (row.isActive ? "Yes" : "No") },
  ];

  return (
    <>
      <AdminHeader title="SEO" />
      <div className="flex flex-1 flex-col p-4 md:p-6">
        <PageHeader title="SEO Management" description="Manage URL redirects and landing pages" />

        <Tabs defaultValue="redirects">
          <TabsList>
            <TabsTrigger value="redirects">Redirects</TabsTrigger>
            <TabsTrigger value="landing">Landing Pages</TabsTrigger>
          </TabsList>

          <TabsContent value="redirects" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">URL Redirects</CardTitle>
                <Button size="sm"><Plus className="mr-1 h-4 w-4" />Add Redirect</Button>
              </CardHeader>
              <CardContent>
                <DataTable columns={redirectColumns} data={redirects} loading={loading} emptyMessage="No redirects configured." />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="landing" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Landing Pages</CardTitle>
                <Button size="sm"><Plus className="mr-1 h-4 w-4" />Add Landing Page</Button>
              </CardHeader>
              <CardContent>
                <DataTable columns={landingColumns} data={landingPages} loading={loading} emptyMessage="No landing pages yet." />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
