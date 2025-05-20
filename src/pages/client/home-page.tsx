import FindNearestSection from "@/components/HomeComponents/FindNearestSection"
import Footer from "@/components/HomeComponents/Footer"
import HeroSection from "@/components/HomeComponents/HeroSection"
import Navbar from "@/components/ClientNavbar/Navbar"
import PicksSection from "@/components/HomeComponents/PicksSection"
import WhyBookSection from "@/components/HomeComponents/WhyBookSection"



const Home = () => {
  return (
    <>
     <div className="font-sans overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <PicksSection />
      <WhyBookSection />
      <FindNearestSection />
      <Footer />
    </div>
    </>
  )
}

export default Home