import React from 'react';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        <label className="block text-xs font-semibold text-slate-700">
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
        <textarea
          ref={ref}
          rows={3}
          className={`w-full px-3.5 py-2.5 text-xs text-slate-900 bg-white border rounded-xl shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-agri-primary/20 transition ${
            error
              ? 'border-red-300 focus:border-red-500'
              : 'border-slate-200 focus:border-agri-primary'
          } ${className}`}
          {...props}
        />
        {error && <p className="text-[11px] font-medium text-red-600">{error}</p>}
        {helperText && !error && <p className="text-[11px] text-slate-400">{helperText}</p>}
      </div>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';
