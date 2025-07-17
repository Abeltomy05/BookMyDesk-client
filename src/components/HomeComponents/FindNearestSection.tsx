import type { RootState } from "@/store/store"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

const FindNearestSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const user = useSelector((state:RootState)=>state.client.client) 

  const navigate = useNavigate();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -100px 0px" 
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

const handleFIndNearestClick = () => {
   if(!user){
    toast("Please login to find nearest coworking space.", {
      icon: "🔍",})
      return;
   }
   navigate('/nearby')
}
  
  return (
    <section 
      ref={sectionRef}
      className={`
        py-16 bg-white
        transition-all duration-1000 ease-out
        ${isVisible ? "opacity-100" : "opacity-0"}
      `}
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div 
            className={`
              md:w-1/2 mb-8 md:mb-0
              transition-all duration-700 ease-out
              ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"}
            `}
          >
            <img 
              src="https://res.cloudinary.com/dnivctodr/image/upload/v1748162270/find-space_g6rpkb.jpg" 
              alt="Find nearest coworking space" 
              className="max-w-full h-auto border rounded-2xl" 
            />
          </div>

          <div 
            className={`
              md:w-1/2 md:pl-12
              transition-all duration-700 ease-out delay-300
              ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"}
            `}
            style={{ transitionDelay: "300ms" }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Find your nearest coworking space.</h2>
            <p className="text-gray-600 mb-6">
              Discover flexible workspace solutions in your area, perfect for freelancers, startups, and remote workers
              looking for a productive environment.
            </p>
            <button 
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105"
            onClick={handleFIndNearestClick}
            >
              Find Now
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FindNearestSection