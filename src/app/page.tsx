import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative selection:bg-gray-200 selection:text-black dark:selection:bg-gray-700 dark:selection:text-white">
      <Navbar />
      <Hero />
      <Projects />
      <Contact />
    </main>
  );
}
