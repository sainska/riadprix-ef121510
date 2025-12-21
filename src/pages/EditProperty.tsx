import React from 'react';
import EditProperty from '@/components/properties/EditProperty';
import { Header } from '@/components/layout/Header';

// Standalone edit property page
export default function EditPropertyPage() {
  // Would get propertyId from route/query, for now a placeholder
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <EditProperty propertyId="demo-id" />
      </main>
    </>
  );
}

