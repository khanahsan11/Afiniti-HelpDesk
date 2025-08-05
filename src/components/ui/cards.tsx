import { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
};

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`border-b border-gray-200 px-6 py-4 ${className}`}>
      {children}
    </div>
  );
};

export const CardBody = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};