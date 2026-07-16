import React from 'react';
import './Card.css';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'standard' | 'dark' | 'transparent';
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ 
  variant = 'standard', 
  children, 
  className = '',
  ...props
}) => {
  return (
    <div className={`card card-${variant} ${className}`} {...props}>
      {children}
    </div>
  );
};
