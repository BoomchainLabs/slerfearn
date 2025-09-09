import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileOptimizedProps {
  children: React.ReactNode;
  mobileClassName?: string;
  desktopClassName?: string;
  className?: string;
}

export const MobileOptimized: React.FC<MobileOptimizedProps> = ({
  children,
  mobileClassName = '',
  desktopClassName = '',
  className = ''
}) => {
  const isMobile = useIsMobile();
  
  const appliedClassName = `${className} ${isMobile ? mobileClassName : desktopClassName}`;
  
  return (
    <div className={appliedClassName}>
      {children}
    </div>
  );
};

interface TouchFeedbackProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const TouchFeedback: React.FC<TouchFeedbackProps> = ({
  children,
  onClick,
  className = '',
  disabled = false
}) => {
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`touch-feedback ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick && !disabled) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {children}
    </div>
  );
};

interface MobileCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'compact' | 'elevated';
}

export const MobileCard: React.FC<MobileCardProps> = ({
  children,
  onClick,
  className = '',
  variant = 'default'
}) => {
  const baseClasses = 'mobile-card touch-feedback';
  const variantClasses = {
    default: 'p-4',
    compact: 'p-3',
    elevated: 'p-4 shadow-xl'
  };
  
  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};

interface SafeAreaProps {
  children: React.ReactNode;
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
  className?: string;
}

export const SafeArea: React.FC<SafeAreaProps> = ({
  children,
  top = false,
  bottom = false,
  left = false,
  right = false,
  className = ''
}) => {
  const safeAreaClasses = [
    top && 'mobile-top-spacing',
    bottom && 'mobile-bottom-spacing',
    (left || right) && 'mobile-safe-area'
  ].filter(Boolean).join(' ');
  
  return (
    <div className={`${safeAreaClasses} ${className}`}>
      {children}
    </div>
  );
};

interface MobileScrollAreaProps {
  children: React.ReactNode;
  className?: string;
  height?: string;
}

export const MobileScrollArea: React.FC<MobileScrollAreaProps> = ({
  children,
  className = '',
  height = 'auto'
}) => {
  return (
    <div 
      className={`mobile-scroll ${className}`}
      style={{ height, maxHeight: height !== 'auto' ? height : '100vh' }}
    >
      {children}
    </div>
  );
};

export default MobileOptimized;