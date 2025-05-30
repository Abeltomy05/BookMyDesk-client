import type { RootState } from "@/store/store"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"

interface PickCardProps {
  title: string
  image: string
  size?: "large" | "small"
  color?: string
  delay?: number
}

const PickCard: React.FC<PickCardProps> = ({ title, image, size = "small", color, delay=0 }) => {
   const [isVisible, setIsVisible] = useState(false)
   const cardRef = useRef<HTMLDivElement>(null)


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

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current)
      }
    }
  }, [])


return (
    <div 
      ref={cardRef}
      className={`
        relative rounded-lg overflow-hidden 
        ${size === "large" ? "col-span-2 row-span-2" : ""}
        transition-all duration-700 ease-out
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}
        group cursor-pointer
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="w-full h-full overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-125" 
        />
      </div>
      <div className={`absolute inset-0 bg-gradient-to-b from-transparent ${color ? "" : "to-black/60"} transition-opacity duration-500 group-hover:opacity-90`}></div>
      {color && <div className={`absolute inset-0 ${color} bg-opacity-70 transition-opacity duration-500 group-hover:bg-opacity-80`}></div>}
      <div className="absolute bottom-0 left-0 p-4 text-white font-bold uppercase tracking-wider transition-all duration-500 group-hover:scale-105 group-hover:translate-y-[-2px]">{title}</div>
    </div>
  )
}

const PicksSection: React.FC = () => {
    const user = useSelector((state:RootState)=>state.client.client) 
    const sectionRef = useRef<HTMLElement>(null)
    const [isSectionVisible, setIsSectionVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsSectionVisible(true)
          observer.unobserve(entry.target)
        }
      },
      {
        threshold: 0.1, 
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
  }, []);

  const handleCardClick = () => {
    if(!user){
    toast("Please login to find best spaces", {
      icon: "🔍",})
   }
  };


return (
 <section 
      ref={sectionRef}
      className={`
        py-12 bg-white
        transition-all duration-1000 ease-out
        ${isSectionVisible ? "opacity-100" : "opacity-0"}
      `}
    >
      <div className="container mx-auto px-6 md:px-12">
        <h2 className={`
          text-3xl font-black text-center mb-8 uppercase tracking-wider
          transition-all duration-700 ease-out
          ${isSectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        `}>
          Our Picks For You
        </h2>

        <div 
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        onClick={handleCardClick}
        >
          <PickCard title="Coliving" image="https://res.cloudinary.com/dnivctodr/image/upload/v1748162545/coliving_boaois.avif" size="large" delay={0} />
          <PickCard title="Top 10" image="https://res.cloudinary.com/dnivctodr/image/upload/v1748162557/top10_hstwag.avif"  delay={150} />
          <PickCard title="Near the Beach" image="https://res.cloudinary.com/dnivctodr/image/upload/v1748162531/beach_mitv35.avif" delay={300} />
          <PickCard title="Trending" image="https://res.cloudinary.com/dnivctodr/image/upload/v1748162567/trending_hn5lem.avif" delay={450} />
          <PickCard title="Top 10 Bizarre Spaces" image="https://res.cloudinary.com/dnivctodr/image/upload/v1748162538/bizzare_qarkrc.avif"  delay={600} />
        </div>
      </div>
    </section>
  )
}

export default PicksSection
