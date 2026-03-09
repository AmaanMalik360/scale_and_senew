"use client";

import React, { useEffect } from "react";
import StoreProvider, { useAppSelector } from "./redux";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </StoreProvider>
  );
};

export default DashboardWrapper;
