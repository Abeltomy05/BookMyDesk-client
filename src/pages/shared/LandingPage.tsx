import Footer from "@/components/HomeComponents/Footer"
import HeroSection from "@/components/HomeComponents/HeroSection"
import WhyBookSection from "@/components/HomeComponents/WhyBookSection"
import { useState, useEffect } from "react"
import LandingNavbar from "@/components/LandingPageComponents/LandingNavbar"
import FindNearestSection from "@/components/HomeComponents/FindNearestSection"
import NavigateVendorSection from "@/components/HomeComponents/NavigateVendorSection"

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
     <div className={`font-sans overflow-x-hidden transition-all duration-1000 ease-out ${
       isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
     }`}>
      <LandingNavbar />
      <HeroSection />
      <NavigateVendorSection/>
      <WhyBookSection />
      <FindNearestSection />
      <Footer />
    </div>
    </>
  )
}

export default LandingPage