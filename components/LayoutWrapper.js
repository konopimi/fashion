// components/LayoutWrapper.js (updated)
"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Top from "./Top";
import Bottom from "./Bottom";
import CartOverlay from "./Cart";
import { initAssets } from "@/vStore/CORE/assets"; // new import

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname?.includes("/dashboard");

  useEffect(() => {
    initAssets();
  }, []);

  return (
    <>
      {!isDashboard && <CartOverlay />}
      {!isDashboard && <Top />}
      {children}
      {!isDashboard && <Bottom />}
    </>
  );
}
