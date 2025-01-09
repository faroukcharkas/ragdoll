"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import { useState } from "react";

interface CustomButtonProps extends ButtonProps {
  icon?: React.ReactNode;
  label?: string;
}

export default function CustomButton({
  className,
  variant = "default",
  icon,
  label,
  ...props
}: CustomButtonProps) {
  const variantStyles = {
    default: "bg-primary text-white hover:bg-primary-light",
    destructive: "bg-red-500 text-white hover:bg-red-500/95",
    outline: "bg-transparent text-primary hover:bg-primary/10",
    secondary:
      "text-gray-600 bg-gradient-to-b from-gray-50 to-gray-200 hover:from-gray-100 hover:to-gray-200",
    ghost: "bg-transparent border-transparent hover:bg-primaryLight/10",
    link: "bg-transparent border-transparent underline-offset-4 hover:underline text-primary",
  };
  const [isLoading, setIsLoading] = useState(props.disabled);

  console.log("isLoading", isLoading);
  console.log("props.disabled", props.disabled);
  return (
    <Button
      className={cn(
        "font-medium",
        variantStyles[variant as keyof typeof variantStyles],
        className
      )}
      onClick={async (event: React.MouseEvent<HTMLButtonElement>) => {
        setIsLoading(true);
        if (props.onClick) {
          props.onClick(event);
        }
        setIsLoading(false);
      }}
      variant={variant}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {icon}
          {label}
        </>
      )}
    </Button>
  );
}
