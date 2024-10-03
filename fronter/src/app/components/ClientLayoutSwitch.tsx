"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import LoginPage from "@/app/login/page";
import DashboardWrapper from "@/app/DashboardWrapper";

function ClientLayoutSwitch({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  useEffect(() => {
  }, [status, session]);

  // If session is still loading, we show a loader
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // If session is not authenticated, we redirect to login
  if (status === "unauthenticated") {
    return <LoginPage />;
  }

  // Once session is authenticated and valid, render the dashboard
  if (status === "authenticated" && session) {
    return <DashboardWrapper>{children}</DashboardWrapper>;
  }

  return <div>Error: Unexpected state occurred.</div>;
}

export default ClientLayoutSwitch;
