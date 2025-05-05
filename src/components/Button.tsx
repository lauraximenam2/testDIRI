import React from 'react';
import styles from './Button.module.css';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void; // Tipar evento
  variant?: 'primary' | 'secondary' | 'accent' | 'error' | 'outline' | 'ghost' | 'link';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string; // Para añadir clases personalizadas
  href?: string; // Si se usa como enlace
  target?: string; // Para enlaces
  rel?: string; // Para enlaces
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled = false,
  fullWidth = false,
  size = 'medium',
  className = '',
  href,
  ...props // Resto de props como target, rel
}) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    className, // Permite añadir clases externas
  ].filter(Boolean).join(' '); // Filtra undefined/null y une

  if (href) {
    // Renderiza como un enlace si href está presente
    return (
      <a
        href={disabled ? undefined : href}
        className={`${buttonClasses} ${disabled ? styles.disabledLink : ''}`}
        aria-disabled={disabled}
        {...props}
      >
        {children}
      </a>
    );
  }

  // Renderiza como botón
  return (
    <button
      type={type}
      onClick={onClick}
      className={buttonClasses}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;