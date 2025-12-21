import React from 'react';
import AddProperty from '@/components/properties/AddProperty';
import { Header } from '@/components/layout/Header';

// Standalone add property page
export default function AddPropertyPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <AddProperty />
      </main>
    </>
  );
}

