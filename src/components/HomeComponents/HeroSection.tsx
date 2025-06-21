import type React from "react"
import { Search } from "lucide-react"
import { useState } from "react"
import type { RootState } from "@/store/store"
import { useSelector } from "react-redux"
import toast from "react-hot-toast"

const HeroSection: React.FC = () => {
  const [isFocused, setIsFocused] = useState(false)
  const user = useSelector((state:RootState)=>state.client.client) 

  const handleSearch = () => {
    if(!user){
      toast("Please login to search for coworking spaces", {
        icon: "🔍",
      })
    }
  }
  return (
    <section className="relative h-[750px] flex items-center bg-black">
      <div className="absolute inset-0 z-0">
        <img src="https://res.cloudinary.com/dnivctodr/image/upload/v1748162039/desk4_rjya8d.jpg" alt="Coworking Space" className="w-full h-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 md:px-12 flex flex-col justify-center items-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-2xl leading-tight">
          Find a coworking space you'll love
        </h1>

      <div className="p-8 flex justify-center">
      <div className={`
        w-[500px] bg-white rounded-full overflow-hidden 
        flex items-center p-2 transition-all duration-300
        ${isFocused ? "ring-2 ring-yellow-400" : ""}
      `}>
        <input
          type="text"
          placeholder="Search by location or space name"
          className="flex-1 px-4 py-2 focus:outline-none"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <button className="bg-yellow-400 hover:bg-yellow-500 text-black rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 ease-in-out group w-10 hover:w-24">
          <div 
          className="flex items-center justify-center px-3 py-2"
           onClick={handleSearch}
           >
            <Search size={18} className="flex-shrink-0" />
            <span className="w-0 overflow-hidden whitespace-nowrap opacity-0 group-hover:w-auto group-hover:opacity-100 group-hover:ml-2 transition-all duration-300">
              Search
            </span>
          </div>
        </button>
      </div>
    </div>
      </div>
    </section>
  );

}

export default HeroSection