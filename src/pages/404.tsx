import React from "react";
import { Header } from "@/components/layout/Header";

export default function NotFound404() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12 text-center">
        <h1 className="text-6xl font-extrabold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you are looking for does not exist. Check the address or return home.
        </p>
        <a className="btn btn-primary" href="/">Go to Home</a>
      </main>
    </>
  );
}

