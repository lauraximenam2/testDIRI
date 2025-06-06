// src/components/Button.tsx
import React from 'react';
import { Link } from 'react-router-dom'; 

type ButtonProps = {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void; 
  variant?: 'primary' | 'secondary' | 'accent' | 'error' | 'outline' | 'ghost' | 'link';
  type?: 'button' | 'submit' | 'reset'; 
  disabled?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string; 
  to?: string; 
  href?: string; 
  as?: 'button' | 'link' | 'a'; 
  [x: string]: any; 
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  type = 'button', // Default para <button>
  disabled = false,
  fullWidth = false,
  size = 'medium',
  className = '',
  to,         
  href,       
  as,         
  ...props    
}) => {
  // Determinar el componente a renderizar
  let Component: React.ElementType = 'button';
  if (as === 'link' && to) {
    Component = Link;
  } else if (as === 'a' || href) {
    Component = 'a';
  } else if (as === 'button') {
    Component = 'button';
  }


  const baseClasses: string[] = [
    "inline-flex items-center justify-center",
    "font-medium focus:outline-none rounded-md", 
    "transition-all duration-150 ease-in-out",
    disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
    "focus-visible:ring-2 focus-visible:ring-offset-2", 
  ];

  // Clases específicas de la variante
  let variantClasses: string[] = [];
  switch (variant) {
    case 'primary':
      variantClasses = ["bg-primary text-primary", !disabled ? "hover:bg-primary-dark" : "", "focus-visible:ring-primary border"];
      break;
    case 'secondary':
      variantClasses = ["bg-secondary text-gray-800", !disabled ? "hover:bg-secondary-dark" : "", "focus-visible:ring-secondary border border-transparent"];
      break;
    case 'accent':
      variantClasses = ["bg-accent text-white", !disabled ? "hover:bg-accent-dark" : "", "focus-visible:ring-accent border border-transparent"];
      break;
    case 'error':
      variantClasses = ["bg-red-700 text-white", !disabled ? "hover:bg-red-700" : ""];
      break;
    case 'outline':
      variantClasses = ["border border-primary text-primary", !disabled ? "hover:bg-primary hover:text-white" : "", "focus-visible:ring-primary"];
      break;
    case 'ghost':
      variantClasses = ["text-gray-700 border border-transparent", !disabled ? "hover:bg-gray-100 hover:text-gray-900" : "", "focus-visible:ring-gray-400"];
      break;
    case 'link':

      baseClasses.splice(0, baseClasses.length); 
      baseClasses.push(
        "inline-flex items-center font-medium text-accent underline-offset-4 focus:outline-none",
        !disabled ? "hover:underline hover:text-accent-dark" : "opacity-60 cursor-not-allowed",
        "focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-accent"
      );
      break;
  }

  let sizeClasses: string[] = [];
  if (variant !== 'link') {
    switch (size) {
      case 'small':
        sizeClasses = ["px-3 py-1.5 text-sm"]; 
        break;
      case 'medium':
        sizeClasses = ["px-4 py-2 text-base"]; 
        break;
      case 'large':
        sizeClasses = ["px-6 py-3 text-lg"]; 
    }
  } else {

    if (size === 'small') sizeClasses.push("text-sm");
    else if (size === 'large') sizeClasses.push("text-lg");

  }


  const fullWidthClasses = fullWidth ? ["w-full"] : [];

  const combinedClasses = [
    ...baseClasses,
    ...variantClasses,
    ...sizeClasses,
    ...fullWidthClasses,
    className,
  ].filter(Boolean).join(' ');


  const componentProps: any = {
    ...props,
    className: combinedClasses,
    onClick: disabled ? (e: React.MouseEvent) => e.preventDefault() : onClick,
  };

  if (Component === 'button') {
    componentProps.type = type;
    componentProps.disabled = disabled;
  } else if (Component === Link) {
    componentProps.to = disabled ? '#' : to; 
    if (disabled) componentProps['aria-disabled'] = true;
  } else if (Component === 'a') {
    componentProps.href = disabled ? undefined : href;
    if (disabled) componentProps['aria-disabled'] = true;
  }


  return <Component {...componentProps}>{children}</Component>;
};

export default Button;