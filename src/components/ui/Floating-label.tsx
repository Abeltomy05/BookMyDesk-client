import type React from "react"
import { useState } from "react"

interface FloatingLabelInputProps {
  id: string
  name: string
  type: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  error?: string
  showPasswordToggle?: boolean
  isPasswordVisible?: boolean
  onTogglePassword?: () => void
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({ 
  id, 
  name,
  type, 
  placeholder, 
  value, 
  onChange, 
  onBlur,
  error,
  showPasswordToggle = false,
  isPasswordVisible,
  onTogglePassword
}) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = () => setIsFocused(true)
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(value.length > 0)
    if (onBlur) onBlur(e)
  }

  const inputType = showPasswordToggle && isPasswordVisible !== undefined 
    ? (isPasswordVisible ? "text" : "password") 
    : type

  return (
    <div className="relative">
      <div className="relative">
        <input
          id={id}
          name={name}
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