interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  stepTitles: string[]
}

export function StepIndicator({ currentStep, totalSteps, stepTitles }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isCompleted = stepNumber < currentStep

          return (
            <div key={stepNumber} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    isCompleted
                      ? "bg-green-500 text-white"
                      : isActive
                        ? "bg-[#f69938] text-white"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {isCompleted ? "✓" : stepNumber}
                </div>
                <span className={`mt-2 text-xs font-medium ${isActive ? "text-[#f69938]" : "text-gray-500"}`}>
                  {stepTitles[index]}
                </span>
              </div>
              {index < totalSteps - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${stepNumber < currentStep ? "bg-green-500" : "bg-gray-200"}`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
