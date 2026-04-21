"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useState, useEffect, useRef } from "react";
import Scroll from "../components/Scroll";
import { carouselItems } from "../vStore/inventory";
export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className="image-container">
          <img src="https://co.silviatcherassi.com/cdn/shop/files/1402-3_1.jpg?v=1775769358&width=1500" />
          <img src="https://co.silviatcherassi.com/cdn/shop/files/2_f3b3831b-f41c-4f32-8a48-d5b3c045bac4.jpg?v=1775754993&width=1500" />
          <img src="https://co.silviatcherassi.com/cdn/shop/files/SPRING_2026_-_HERO_IMAGES_13_b2600db3-62f4-4632-b8e2-b433de7b77ee.jpg?v=1775489708&width=1500" />
          <img src="https://co.silviatcherassi.com/cdn/shop/files/SPRING_2026_-_HERO_IMAGES_19_e3e6e248-ee80-432f-a4be-114ceebf414b.jpg?v=1775489710&width=832" />
        </div>
        {/* <Image */}
        {/*   className={styles.logo} */}
        {/*   src="/next.svg" */}
        {/*   alt="Next.js logo" */}
        {/*   width={100} */}
        {/*   height={20} */}
        {/*   priority */}
        {/* /> */}
        <Scroll carouselItems={carouselItems} />
      </main>
    </div>
  );
}
