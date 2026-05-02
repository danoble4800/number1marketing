import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: React.ElementType;
}

export default function Section({
  children,
  className = '',
  id,
  as: Tag = 'section',
}: SectionProps) {
  return (
    <Tag id={id} className={`py-20 lg:py-28 ${className}`}>
      {children}
    </Tag>
  );
}
