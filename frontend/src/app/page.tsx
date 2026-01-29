"use client";

import About from "@/components/sections/AboutUs";
import Bestsellers from "@/components/sections/Bestsellers";
import Books from "@/components/sections/Books";
import Collections from "@/components/sections/Collections";
import VideoBackground from "@/components/sections/VideoBackground";

export default function Home() {
  return (
    <>
      <VideoBackground />
      <Books />
      <Collections />
      <Bestsellers />
      <About />
    </>
  );
}
