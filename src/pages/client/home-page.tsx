import FindNearestSection from "@/components/HomeComponents/FindNearestSection"
import Footer from "@/components/HomeComponents/Footer"
import HeroSection from "@/components/HomeComponents/HeroSection"
import Navbar from "@/components/ClientNavbar/Navbar"
import PicksSection from "@/components/HomeComponents/PicksSection"
import WhyBookSection from "@/components/HomeComponents/WhyBookSection"
import Loading from "@/components/Loading"
import { useState } from "react"



const Home = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <>
     <div className="font-sans overflow-x-hidden">
      {isLoading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="w-75 h-75">
            <Loading/>
          </div>
        </div>
      )}
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