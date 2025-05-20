"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

interface FloatingLabelInputProps {
  id: string
  type: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({ id, type, placeholder, value, onChange, error }) => {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(value.length > 0)

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  const inputType = type === "password" ? (showPassword ? "text" : "password") : type

  return (
    <div className="relative mb-6">
      <div className="relative">
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`
            block w-full px-4 py-3 text-gray-700 bg-white border rounded-lg
            transition-all duration-300 ease-in-out
            focus:outline-none
            ${error ? "border-red-500" : isFocused || value ? "border-[#f69938]" : "border-gray-300"}
            ${isFocused || value ? "pt-6 pb-2" : "py-4"}
          `}
          placeholder={isFocused || value ? "" : placeholder}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
        {(isFocused || value) && (
          <span
            className={`
              absolute text-xs font-medium px-1 left-3 -top-[0.5px] bg-white
              transform -translate-y-1/2 pointer-events-none
              ${error ? "text-red-500" : "text-[#f69938]"}
            `}
          >
            {placeholder}
          </span>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}

export default FloatingLabelInput
