"use client";

import React from "react";

type ArcadeButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: "post" | "log" | "image";
};

export default function ArcadeButton({
  variant,
  className = "",
  children,
  ...props
}: ArcadeButtonProps) {
  const baseClasses = `
   pixel-font
  inline-block
  px-2 py-1 text-xs          
  sm:px-1 sm:py-1 sm:text-sm 
  md:px-4 md:py-3 md:text-base 
  font-bold text-white
  shadow-[0_0_0_2px_black,4px_4px_0_0_black]
  bg-repeat
  transition-transform transform
  hover:translate-y-[-2px] active:translate-y-[2px]
  disabled:opacity-50 disabled:cursor-not-allowed
  border-none
  rounded-none
  rounded-none
  `;

  const variantClasses: Record<ArcadeButtonProps["variant"], string> = {
    log: `
      bg-[var(--primary)] hover:bg-[var(--primary-light)]
      focus:outline focus:outline-2 focus:outline-[var(--primary-light)]
    `,
    post: `
      bg-[var(--secondary)] hover:bg-[var(--secondary-light)]
      focus:outline focus:outline-2 focus:outline-[var(--secondary-light)]
    `,
    image: `
      bg-[#00B4D8] hover:bg-[#48CAE4]
      focus:outline focus:outline-2 focus:outline-[#90E0EF]
    `,
  };

  return (
    <button
      {...props}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
