import type React from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate()

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  // 404 number animation
  const numberVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        duration: 0.8,
      },
    },
  }

  // Button animation
  const buttonVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    hover: {
      scale: 1.05,
      transition: { type: "spring", stiffness: 400 },
    },
    tap: { scale: 0.95 },
  }

  // Circle background animations
  const circleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (custom: number) => ({
      scale: 1,
      opacity: 0.2,
      transition: {
        delay: custom * 0.2,
        type: "spring",
        stiffness: 50,
        damping: 10,
      },
    }),
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gray-50">
      {/* Animated background circles */}
      <motion.div
        className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#f69938]"
        variants={circleVariants}
        initial="hidden"
        animate="visible"
        custom={0}
      />
      <motion.div
        className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-[#f69938]"
        variants={circleVariants}
        initial="hidden"
        animate="visible"
        custom={1}
      />
      <motion.div
        className="absolute left-1/4 top-1/2 h-36 w-36 rounded-full bg-[#f69938]"
        variants={circleVariants}
        initial="hidden"
        animate="visible"
        custom={2}
      />

      <motion.div
        className="z-10 flex flex-col items-center justify-center p-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="text-[10rem] font-extrabold leading-none text-[#f69938] drop-shadow-[4px_4px_0px_#d97b1c] md:text-[12rem]"
          variants={numberVariants}
        >
          404
        </motion.div>

        <motion.h1 className="mb-4 text-4xl font-bold text-gray-800" variants={itemVariants}>
          Page Not Found
        </motion.h1>

        <motion.p className="mb-8 max-w-md text-lg text-gray-600" variants={itemVariants}>
          Oops! The page you are looking for doesn't exist or has been moved.
        </motion.p>

        <motion.div variants={itemVariants}>
          <motion.button
            onClick={() => navigate("/login")}
            className="rounded-full bg-[#f69938] px-8 py-3 text-lg font-semibold text-white shadow-lg shadow-[#f69938]/30 transition-colors hover:bg-[#d97b1c] focus:outline-none focus:ring-2 focus:ring-[#f69938] focus:ring-offset-2"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Go to Login
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFoundPage
