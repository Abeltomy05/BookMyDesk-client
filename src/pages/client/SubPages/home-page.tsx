import FindNearestSection from "@/components/HomeComponents/FindNearestSection"
import HeroSection from "@/components/HomeComponents/HeroSection"
import PicksSection from "@/components/HomeComponents/PicksSection"
import WhyBookSection from "@/components/HomeComponents/WhyBookSection"
import Loading from "@/components/Loadings/Loading"
import { useState, useEffect } from "react"

const Home = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);




  return (
     <div className={`font-sans overflow-x-hidden transition-all duration-1000 ease-out ${
       isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
     }`}>
      {isLoading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="w-75 h-75">
            <Loading/>
          </div>
        </div>
      )}
      
      <HeroSection />
      <PicksSection />
      <WhyBookSection />
      <FindNearestSection />
    </div>

  )
}

export default Home