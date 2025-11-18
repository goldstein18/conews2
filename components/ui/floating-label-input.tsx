"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface FloatingLabelInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ className, type, name, label, value, onChange, onBlur, ...props }, ref) => {
    const [active, setActive] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
      // Check if there's a value on mount or when value changes
      setActive(!!value);
    }, [value]);

    // Check for autofill
    React.useEffect(() => {
      const input = inputRef.current;
      if (!input) return;

      const checkAutofill = () => {
        // Check if input has autofilled value
        const hasValue = input.value && input.value.length > 0;
        if (hasValue) {
          setActive(true);
        }
      };

      // Check immediately
      checkAutofill();

      // Check after a short delay for autofill
      const timeoutId = setTimeout(checkAutofill, 100);

      // Listen for animation start (Chrome autofill detection)
      const handleAnimationStart = (e: AnimationEvent) => {
        if (e.animationName === 'onAutoFillStart') {
          setActive(true);
        }
      };

      input.addEventListener('animationstart', handleAnimationStart as EventListener);

      return () => {
        clearTimeout(timeoutId);
        input.removeEventListener('animationstart', handleAnimationStart as EventListener);
      };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setActive(!!e.target.value);
      onChange?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setActive(!!e.target.value);
      onBlur?.(e);
    };

    const handleFocus = () => {
      setActive(true);
    };

    const setRefs = (element: HTMLInputElement | null) => {
      inputRef.current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    return (
      <div className="relative">
        <input
          type={type}
          id={name}
          name={name}
          className={cn(
            "peer w-full rounded-md border border-gray-300 bg-white px-3 pb-2 outline-none transition-all duration-200 ease-in-out focus:border-blue-600 focus:ring-1 focus:ring-blue-600 autofill-detected",
            active ? "pt-6" : "pt-4",
            className
          )}
          ref={setRefs}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          {...props}
        />
        <label
          htmlFor={name}
          className={cn(
            "absolute left-3 top-0 flex items-center text-gray-500 transition-all duration-200 ease-in-out pointer-events-none",
            active
              ? "text-xs pt-1.5"
              : "text-base pt-4"
          )}
        >
          {label}
        </label>
      </div>
    );
  }
);

FloatingLabelInput.displayName = "FloatingLabelInput";

export { FloatingLabelInput };
