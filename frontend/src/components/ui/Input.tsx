import type { InputHTMLAttributes } from "react";
import { AlertCircle } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  helperText,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={[
            "w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2",
            error
              ? "border-red-300 focus:border-red-400 focus:ring-red-500/20 bg-red-50/50"
              : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white",
            props.disabled
              ? "bg-slate-50 cursor-not-allowed text-slate-400"
              : "",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
        {error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <AlertCircle className="h-4 w-4 text-red-400" />
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-slate-400">{helperText}</p>
      )}
    </div>
  );
}

export default Input;
