"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { ColumnDef } from "@tanstack/react-table";
import { Archive, Bell, Clock, Eye, History, Mail, MessageSquare, RefreshCw, Send, Smartphone, Trash2, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { DataTable } from "@/components/ui/data-table";
import { Form, FormActions, FormSection } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { AdminOnly, PermissionGate, RoleBadge } from "@/components/ui/permission";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type NotificationType = "In App" | "Email" | "Push" | "SMS";
type NotificationStatus = "DRAFT" | "SCHEDULED" | "SENT" | "ARCHIVED";
type NotificationRecord = {
  id: string;
  title: string;
  type: NotificationType;
  audience: string;
  status: NotificationStatus;
  scheduledAt: string;
  sentAt: string;
};

const notifications: NotificationRecord[] = [
  { id: "not-001", title: "Maha Shivaratri Reminder", type: "Push", audience: "All Users", status: "SENT", scheduledAt: "01 Jul 2026, 08:00 AM", sentAt: "01 Jul 2026, 08:00 AM" },
  { id: "not-002", title: "Temple Content Review", type: "In App", audience: "Admins", status: "SCHEDULED", scheduledAt: "04 Jul 2026, 06:00 PM", sentAt: "Pending" },
  { id: "not-003", title: "Weekly Devotional Digest", type: "Email", audience: "Subscribers", status: "DRAFT", scheduledAt: "Not scheduled", sentAt: "Pending" },
  { id: "not-004", title: "OTP Delivery Notice", type: "SMS", audience: "Verified Users", status: "ARCHIVED", scheduledAt: "20 Jun 2026, 09:00 AM", sentAt: "20 Jun 2026, 09:00 AM" },
];

const typeOptions = [
  { label: "All types", value: "all" },
  { label: "In App", value: "in-app" },
  { label: "Email", value: "email" },
  { label: "Push", value: "push" },
  { label: "SMS", value: "sms" },
];

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Draft", value: "DRAFT" },
  { label: "Scheduled", value: "SCHEDULED" },
  { label: "Sent", value: "SENT" },
  { label: "Archived", value: "ARCHIVED" },
];

const audienceOptions = [
  { label: "All audiences", value: "all" },
  { label: "All Users", value: "all-users" },
  { label: "Admins", value: "admins" },
  { label: "Subscribers", value: "subscribers" },
  { label: "Verified Users", value: "verified-users" },
];

const priorityOptions = [
  { label: "Low", value: "low" },
  { label: "Normal", value: "normal" },
  { label: "High", value: "high" },
  { label: "Urgent", value: "urgent" },
];

function NotificationTypeBadge({ type }: { type: NotificationType }) {
  const variant = type === "Email" ? "info" : type === "Push" ? "primary" : type === "SMS" ? "warning" : "secondary";
  return <Badge variant={variant}>{type}</Badge>;
}

function NotificationStatusBadge({ status }: { status: NotificationStatus }) {
  const variant = status === "SENT" ? "success" : status === "SCHEDULED" ? "info" : status === "DRAFT" ? "warning" : "secondary";
  return <Badge variant={variant}>{status}</Badge>;
}

function NotificationFilters() {
  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
      <Select options={typeOptions} placeholder="Type" />
      <Select options={statusOptions} placeholder="Status" />
      <Select options={audienceOptions} placeholder="Audience" />
      <Input aria-label="Date range filter" placeholder="Date range" type="date" />
    </div>
  );
}

function NotificationActions({ notification }: { notification: NotificationRecord }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [resendOpen, setResendOpen] = useState(false);

  return (
    <div className="flex flex-wrap gap-1">
      <Button aria-label={`View ${notification.title}`} render={<Link href={`/notifications/${notification.id}`} />} size="icon-sm" variant="ghost"><Eye /></Button>
      <AdminOnly>
        <Button aria-label="Resend placeholder" onClick={() => setResendOpen(true)} size="icon-sm" type="button" variant="ghost"><RefreshCw /></Button>
        <Button aria-label="Delete placeholder" onClick={() => setDeleteOpen(true)} size="icon-sm" type="button" variant="ghost"><Trash2 /></Button>
        <ConfirmationDialog
          action="delete"
          message="Delete notification placeholder only. No data will be changed."
          onConfirm={() => setDeleteOpen(false)}
          onOpenChange={setDeleteOpen}
          open={deleteOpen}
          title="Delete notification"
        />
        <ConfirmationDialog
          action="restore"
          confirmLabel="Resend"
          message="Resend notification placeholder only. No message will be sent."
          onConfirm={() => setResendOpen(false)}
          onOpenChange={setResendOpen}
          open={resendOpen}
          title="Resend notification"
        />
      </AdminOnly>
    </div>
  );
}

const columns: ColumnDef<NotificationRecord>[] = [
  { accessorKey: "title", header: "Title", cell: ({ row }) => <span className="font-medium">{row.original.title}</span> },
  { accessorKey: "type", header: "Type", cell: ({ row }) => <NotificationTypeBadge type={row.original.type} /> },
  { accessorKey: "audience", header: "Audience" },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <NotificationStatusBadge status={row.original.status} /> },
  { accessorKey: "scheduledAt", header: "Scheduled At" },
  { accessorKey: "sentAt", header: "Sent At" },
  { id: "actions", header: "Actions", cell: ({ row }) => <NotificationActions notification={row.original} /> },
];

export function NotificationsPageContent() {
  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Notifications Center</p>
            <h1 className="text-3xl font-semibold tracking-tight">Notifications</h1>
            <p className="mt-2 text-sm text-muted-foreground">Manage notification drafts, schedules, and delivery placeholders.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <RoleBadge />
            <AdminOnly>
              <Button render={<Link href="/notifications/send" />} leftIcon={<Send />}>Send Notification</Button>
            </AdminOnly>
          </div>
        </header>
        <DataTable
          bulkActions={
            <AdminOnly>
              <Button size="sm" type="button" variant="destructive">Delete</Button>
              <Button size="sm" type="button" variant="outline">Archive</Button>
              <Button size="sm" type="button" variant="outline">Mark Read</Button>
              <Button size="sm" type="button" variant="outline">Resend</Button>
            </AdminOnly>
          }
          columns={columns}
          data={notifications}
          exportPlaceholder={() => undefined}
          filters={<NotificationFilters />}
          onRefresh={() => undefined}
          searchPlaceholder="Search notifications..."
        />
      </div>
    </PermissionGate>
  );
}

type NotificationFormValues = {
  title: string;
  message: string;
};

export function SendNotificationPageContent() {
  const form = useForm<NotificationFormValues>({ defaultValues: { title: "", message: "" } });

  return (
    <AdminOnly>
      <div className="space-y-6">
        <header>
          <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Notifications Center</p>
          <h1 className="text-3xl font-semibold tracking-tight">Send Notification</h1>
          <p className="mt-2 text-sm text-muted-foreground">Compose notification placeholders only. No messages are sent.</p>
        </header>
        <Form {...form} onSubmit={(event) => event.preventDefault()}>
          <FormSection columns={2} title="Notification Details" description="Message, target audience, and delivery placeholders.">
            <Input label="Title" required {...form.register("title")} />
            <Select options={typeOptions.slice(1)} placeholder="Type" />
            <Textarea label="Message" required wrapperClassName="md:col-span-2" {...form.register("message")} />
            <Select options={audienceOptions.slice(1)} placeholder="Audience" />
            <Select options={priorityOptions} placeholder="Priority" />
            <Input label="Schedule Date" type="date" />
            <Input label="Schedule Time" type="time" />
            <Select options={statusOptions.slice(1)} placeholder="Status" />
          </FormSection>
          <FormActions canReset dirty={form.formState.isDirty} onCancel={() => undefined} onReset={() => form.reset()} sticky submitLabel="Send placeholder" />
        </Form>
      </div>
    </AdminOnly>
  );
}

function DetailCard({ children, icon, title }: { children: React.ReactNode; icon: React.ReactNode; title: string }) {
  return (
    <Card className="glass-panel shadow-soft">
      <CardHeader className="flex flex-row items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary [&_svg]:size-4">{icon}</span>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function TypeIcon({ type }: { type: NotificationType }) {
  const icon = {
    "In App": <Bell />,
    Email: <Mail />,
    Push: <Smartphone />,
    SMS: <MessageSquare />,
  }[type];

  return <span className="text-primary [&_svg]:size-6">{icon}</span>;
}

export function NotificationDetailsPageContent() {
  const notification = notifications[0];

  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <header>
          <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Notification Details</p>
          <h1 className="text-3xl font-semibold tracking-tight">{notification.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{notification.audience} · {notification.scheduledAt}</p>
        </header>
        <section className="grid gap-4 lg:grid-cols-[1fr_1.2fr]" aria-label="Notification overview">
          <Card className="glass-panel shadow-soft">
            <CardContent className="space-y-4">
              <TypeIcon type={notification.type} />
              <div>
                <h2 className="text-xl font-semibold">{notification.title}</h2>
                <p className="text-sm text-muted-foreground">Message preview placeholder for notification details.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <NotificationTypeBadge type={notification.type} />
                <NotificationStatusBadge status={notification.status} />
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailCard icon={<Users />} title="Recipients Placeholder"><p className="text-sm text-muted-foreground">Audience and recipient segmentation placeholder.</p></DetailCard>
            <DetailCard icon={<Clock />} title="Delivery Placeholder"><p className="text-sm text-muted-foreground">Delivery status and timeline placeholder.</p></DetailCard>
          </div>
        </section>
        <section className="grid gap-4 md:grid-cols-2" aria-label="Notification history placeholder">
          <DetailCard icon={<History />} title="History Placeholder"><p className="text-sm text-muted-foreground">Notification activity history placeholder.</p></DetailCard>
          <DetailCard icon={<Archive />} title="Archive Placeholder"><p className="text-sm text-muted-foreground">Archive and retention placeholder.</p></DetailCard>
        </section>
      </div>
    </PermissionGate>
  );
}
