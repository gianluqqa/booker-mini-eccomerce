import About from "@/sections/AboutUs";
import Bestsellers from "@/sections/Bestsellers";
import Books from "@/sections/Books";
import Collections from "@/sections/Collections";

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
