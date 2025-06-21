import type React from "react"
import { Globe, Users, Award, MessageSquare } from "lucide-react"

interface FeatureProps {
  icon: React.ReactNode
  title: string
  description: string
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 text-gray-800">{icon}</div>
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  )
}

const WhyBookSection: React.FC = () => {
  const handleLernMoreClick = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth"
    });
  }
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12">
        <h2 className="text-3xl font-black text-center mb-12 tracking-wider">Why Book With Us?</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <Feature
            icon={<Globe size={48} />}
            title="100% satisfaction guarantee"
            description="We refund if you're not satisfied"
          />
          <Feature icon={<Users size={48} />} title="Trusted coworking spaces" description="Verified and trusted" />
          <Feature icon={<Award size={48} />} title="Peace of mind" description="Free cancellation up to 24 hours" />
          <Feature
            icon={<MessageSquare size={48} />}
            title="Stay in touch via our newsletter"
            description="Get the latest updates and offers"
          />
        </div>
        <div className="flex justify-center mt-8">
          <button 
          className="border border-yellow-400 text-gray-800 px-6 py-2 rounded-full hover:bg-yellow-400 hover:text-black transition-colors"
          onClick={handleLernMoreClick}
          >
            Learn More
          </button>
        </div>
      </div>
    </section>
  )
}

export default WhyBookSection
