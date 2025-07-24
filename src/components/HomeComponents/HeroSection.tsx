import type React from "react"
import { ArrowRight, MapPin } from "lucide-react";
import type { RootState } from "@/store/store"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const HeroSection: React.FC = () => {
  const user = useSelector((state:RootState)=>state.client.client) 
  const navigate = useNavigate()

  const handleBrowse = ()=>{
    if(!user){
      toast("Please login to find spaces",{icon:'📢'})
      return;
    }
    navigate("/buildings")
  }

    return (
    <section className="relative h-[750px] flex items-center bg-black">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://res.cloudinary.com/dnivctodr/image/upload/v1748162039/desk4_rjya8d.jpg" 
          alt="Coworking Space" 
          className="w-full h-full object-cover opacity-70" 
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 md:px-12 flex flex-col justify-center items-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-2xl leading-tight mb-8">
          Find a coworking space you'll love
        </h1>

        <div className="p-8 flex justify-center">
          <button 
          className="group text-white font-semibold px-8 py-4 rounded-full flex items-center gap-3 transition-all duration-300 transform hover:scale-105 hover:shadow-xl" 
          style={{ backgroundColor: '#f69938' }} 
          onClick={handleBrowse}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = '#e58829';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = '#f69938';
          }}
          >
            <MapPin size={20} className="flex-shrink-0" />
            <span className="text-lg">Explore Spaces</span>
            <ArrowRight size={20} className="flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection