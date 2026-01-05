"use client";

import About from "@/components/sections/AboutUs";
import Bestsellers from "@/components/sections/Bestsellers";
import Books from "@/components/sections/Books";
import Collections from "@/components/sections/Collections";

export default function Home() {
  return (
    <>
      <Books />
      <Collections />
      <Bestsellers />
      <About />
    </>
  );
}
