"use client";

import * as React from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import { cn } from "@/lib/utils";

export interface MoneyInputProps extends Omit<NumericFormatProps, 'value' | 'onValueChange'> {
  value?: number;
  onValueChange?: (value: number | undefined) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
}

const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ 
    className, 
    value, 
    onValueChange, 
    placeholder = "0.00",
    disabled = false,
    min = 1,
    max = 99999.99,
    ...props 
  }, ref) => {
    
    const handleValueChange = (values: { floatValue?: number }) => {
      const { floatValue } = values;
      
      // Validate min/max
      if (floatValue !== undefined) {
        if (floatValue < min) {
          onValueChange?.(min);
          return;
        }
        if (floatValue > max) {
          onValueChange?.(max);
          return;
        }
      }
      
      onValueChange?.(floatValue);
    };

    return (
      <NumericFormat
        {...props}
        getInputRef={ref}
        value={value}
        onValueChange={handleValueChange}
        thousandSeparator=","
        decimalSeparator="."
        prefix="$"
        decimalScale={2}
        fixedDecimalScale={true}
        allowNegative={false}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      />
    );
  }
);

MoneyInput.displayName = "MoneyInput";

export { MoneyInput };