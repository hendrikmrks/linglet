import React from 'react';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  title?: string;
  description?: string;
}

export function Form({ title, description, className, children, ...props }: FormProps) {
  return (
    <div className="w-full">
      {title && <h1 className="text-2xl font-bold mb-2">{title}</h1>}
      {description && <p className="text-gray-600 mb-6">{description}</p>}
      <form className="flex flex-col gap-4" {...props}>
        {children}
      </form>
    </div>
  );
}
