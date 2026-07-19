import * as React from "react"
import { cn } from "@/lib/utils"

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className={cn("w-8 h-8", className)}
      {...props}
    >
      {/* Minimal Dark Mode Background */}
      <rect width="32" height="32" rx="8" fill="#0B0F19" />
      
      {/* Bracket / Container (Structure) */}
      <path
        d="M13 9H9V23H13"
        stroke="#94A3B8"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Prompt Indicator (Input) */}
      <path
        d="M14 13L17 16L14 19"
        stroke="#38BDF8"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* The Flash/Result (Output) */}
      <circle cx="22" cy="16" r="2.5" fill="#34D399" />
    </svg>
  )
}
