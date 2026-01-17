import * as React from "react"
import { cn } from "@/lib/utils"

interface AlertProps {
  message: string
  type: "error" | "success"
  duration?: number
  onClose?: () => void
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ message, type, duration = 2500, onClose }, ref) => {
    const [progress, setProgress] = React.useState(100)
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null)

    React.useEffect(() => {
      if (!message) {
        setProgress(100)
        if (intervalRef.current) clearInterval(intervalRef.current)
        return
      }

      setProgress(100)
      const startTime = Date.now()
      
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime
        let remaining = 100 - (elapsed / duration) * 100
        
        remaining = Math.max(0, remaining)
        setProgress(remaining)

        if (remaining === 0) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          onClose?.()
        }
      }, 5)

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
    }, [message, duration, onClose])

    return (
      <>
        {message && (
          <div
            ref={ref}
            className={cn(
              "rounded-md p-4",
              type === "error" ? "bg-red-50" : "bg-green-50"
            )}
          >
            <p className={cn("text-sm", type === "error" ? "text-red-800" : "text-green-800")}>
              {message}
            </p>
            <div
              className={cn(
                "h-1 mt-2 rounded-full",
                type === "error" ? "bg-red-300" : "bg-green-300"
              )}
              style={{ width: `${progress}%`, transition: "width 0.05s linear" }}
            />
          </div>
        )}
      </>
    )
  }
)
Alert.displayName = "Alert"

export { Alert }
