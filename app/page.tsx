import Hero from "@/components/hero"
import OurStory from "@/components/our-story"
import WeddingDetails from "@/components/wedding-details"
import Timeline from "@/components/timeline"
import Team from "@/components/team"
import Locations from "@/components/locations"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <OurStory />
      <WeddingDetails />
      <Timeline />
      <Locations />
      <Team />
      <Footer />
    </main>
  )
}
