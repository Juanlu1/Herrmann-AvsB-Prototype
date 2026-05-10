"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface OptionCardProps {
  text: string
  imageSrc: string
  isSelected: boolean
  isOtherSelected: boolean
  onClick: () => void
  label: string
}

export function OptionCard({
  text,
  imageSrc,
  isSelected,
  isOtherSelected,
  onClick,
  label
}: OptionCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: isOtherSelected ? 1 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative flex flex-col items-center p-4 md:p-6 rounded-3xl transition-all duration-300 cursor-pointer w-full",
        "bg-card/80 backdrop-blur-md border-2 shadow-lg",
        isSelected && "border-primary shadow-primary/30 shadow-xl ring-2 ring-primary/20",
        !isSelected && !isOtherSelected && "border-border/50 hover:border-primary/50 hover:shadow-xl",
        isOtherSelected && !isSelected && "opacity-40 border-border/30"
      )}
    >
      <span className={cn(
        "absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
        isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
      )}>
        {label}
      </span>

      <div className="relative w-full aspect-square max-w-[200px] mb-4 rounded-2xl overflow-hidden bg-secondary/50">
        <Image
          src={imageSrc}
          alt={text}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 200px"
        />
      </div>

      <p className={cn(
        "text-sm md:text-base text-center leading-relaxed",
        isSelected ? "text-foreground font-medium" : "text-muted-foreground"
      )}>
        {text}
      </p>
    </motion.button>
  )
}
