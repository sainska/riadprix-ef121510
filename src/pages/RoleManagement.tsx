import React from "react";
import { Header } from "@/components/layout/Header";

export default function RoleManagement() {
  // To be restricted for admins only
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-8">User Role Management</h1>
        <p className="mb-6 text-lg text-muted-foreground">Assign, change, or revoke application roles for users.</p>
        <div className="rounded-xl border p-6 bg-card mt-8">
          <span className="block text-muted-foreground">Role assignment UI coming soon.</span>
        </div>
      </main>
    </>
  );
}

