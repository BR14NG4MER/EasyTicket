"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const withAuth = (WrappedComponent: React.ComponentType) => {
  const ProtectedComponent = (props: any) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      if (typeof window !== "undefined") {
        const session = localStorage.getItem("session");

        if (!session) {
          router.push("/");
        } else {
          setIsAuthenticated(true); 
        }
      }
    }, [router]);

    if (!isAuthenticated) {
      return null; 
    }

    return <WrappedComponent {...props} />;
  };

  return ProtectedComponent;
};

export default withAuth;
