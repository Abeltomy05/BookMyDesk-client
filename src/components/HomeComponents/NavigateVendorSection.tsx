import { Button } from "@/components/ui/button"
import { ArrowRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom"

export default function NavigateVendorSection() {
  const navigate = useNavigate();

  const handleLernMoreClick = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth"
    });
  }
  return (
<section className="bg-white">
       <div className="relative">
          <div className="bg-white p-8 md:p-16 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-46 h-46 bg-gradient-to-br from-[#f69938] to-[#e8872e] opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-30 h-30 bg-gradient-to-br from-[#f69938] to-[#e8872e] opacity-10 rounded-full translate-y-12 -translate-x-12"></div>

            {/* Content */}
            <div className="relative z-10 text-center max-w-4xl mx-auto">

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-6 leading-tight">
                Ready to{" "}
                <span className="relative">
                  <span className="relative z-10 text-[#f69938]">Transform</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#f69938] to-[#e8872e] opacity-20 rounded-lg transform rotate-1 scale-110"></div>
                </span>{" "}
                Your Space Business?
              </h2>

              <p className="text-gray-700 text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
                Join thousands of successful vendors on our platform. Connect with customers, manage bookings
                effortlessly, and grow your revenue with our powerful tools.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  onClick={() => navigate("/vendor/signup")}
                  className="bg-gradient-to-r from-[#f69938] to-[#e8872e] text-white hover:from-[#e8872e] hover:to-[#d97706] font-bold  text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl group p-6 "
                >
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>

                <button 
                className="text-[#f69938] hover:text-[#e8872e] font-medium underline underline-offset-4 transition-colors duration-300"
                onClick={handleLernMoreClick}
                >
                  Learn more about our platform
                </button>
              </div>

              <p className="text-gray-600 text-sm mt-6">Join today and register your buildings ! No setup costs.</p>
            </div>
          </div>
        </div>
    </section>
  )
}