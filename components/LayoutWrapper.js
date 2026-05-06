"use client";

import { usePathname } from "next/navigation";
import Top from "./Top";
import Bottom from "./Bottom";
import CartOverlay from "./Cart";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  // Hide global elements on any route that contains "/dashboard"
  const isDashboard = pathname?.includes("/dashboard");

  return (
    <>
      {!isDashboard && <CartOverlay />}
      {!isDashboard && <Top />}
      {children}
      {!isDashboard && <Bottom />}
    </>
  );
}
