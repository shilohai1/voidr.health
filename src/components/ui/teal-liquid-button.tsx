
"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const tealLiquidButtonVariants = cva(
  "inline-flex items-center transition-colors justify-center cursor-pointer gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:scale-105 duration-300 transition text-white font-semibold",
      },
      size: {
        default: "h-9 px-4 py-2",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-md px-8",
        xxl: "h-14 rounded-md px-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "xl",
    },
  }
)

function TealLiquidButton({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof tealLiquidButtonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <>
      <Comp
        data-slot="button"
        className={cn(
          "relative",
          tealLiquidButtonVariants({ variant, size, className })
        )}
        {...props}
      >
        <div className="absolute top-0 left-0 z-0 h-full w-full rounded-md 
            shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(20,184,166,0.4),inset_-3px_-3px_0.5px_-3px_rgba(13,148,136,0.6),inset_1px_1px_1px_-0.5px_rgba(20,184,166,0.3),inset_-1px_-1px_1px_-0.5px_rgba(13,148,136,0.4),inset_0_0_6px_6px_rgba(20,184,166,0.15),inset_0_0_2px_2px_rgba(13,148,136,0.1),0_0_12px_rgba(20,184,166,0.2)] 
        transition-all 
        bg-gradient-to-r from-teal-400/20 to-teal-600/30" />
        <div
          className="absolute top-0 left-0 isolate -z-10 h-full w-full overflow-hidden rounded-md"
          style={{ backdropFilter: 'url("#teal-container-glass")' }}
        />

        <div className="pointer-events-none z-10 text-white font-semibold">
          {children}
        </div>
        <TealGlassFilter />
      </Comp>
    </>
  )
}

function TealGlassFilter() {
  return (
    <svg className="hidden">
      <defs>
        <filter
          id="teal-container-glass"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05 0.05"
            numOctaves="1"
            seed="1"
            result="turbulence"
          />
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="70"
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

export { TealLiquidButton, tealLiquidButtonVariants }
