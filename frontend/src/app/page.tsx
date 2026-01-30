"use client";

import About from "@/components/sections/AboutUs";
import Bestsellers from "@/components/sections/Bestsellers";
import Books from "@/components/sections/Books";
import Collections from "@/components/sections/Collections";
import VideoBackground from "@/components/sections/VideoBackground";
import WeeklyRecommendation from "@/components/sections/WeeklyRecommendation";
import Testimonials from "@/components/sections/Testimonials";

export default function Home() {
  return (
    <>
      <VideoBackground />
      <WeeklyRecommendation />
      <Books />
      <About />
      <Collections />
      <Bestsellers />
      <Testimonials />
    </>
  );
}
