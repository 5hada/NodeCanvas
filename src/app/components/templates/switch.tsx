import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Switch({
  className,
  size = "xl",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "lg" | "xl";
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        // Base
        "peer group/switch relative inline-flex shrink-0 items-center",
        "rounded-full border border-transparent shadow-xs",
        "outline-none transition-all",

        // Size
        "data-[size=xl]:w-12 data-[size=xl]:h-7",
        "data-[size=lg]:w-8 data-[size=lg]:h-[18.4px]",
        "data-[size=sm]:w-6 data-[size=sm]:h-3.5",

        // Pseudo Element
        "after:absolute after:-inset-x-3 after:-inset-y-2",

        // Focus
        "focus-visible:border-ring",
        "focus-visible:ring-3 focus-visible:ring-ring/50",

        // Invalid
        "aria-invalid:border-destructive",
        "aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        "dark:aria-invalid:border-destructive/50",
        "dark:aria-invalid:ring-destructive/40",

        // State
        "data-checked:bg-primary",
        "data-unchecked:bg-input",
        "dark:data-unchecked:bg-input/80",

        // Disabled
        "data-disabled:cursor-not-allowed",
        "data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          // Layout
          "pointer-events-none block",

          // Shape
          "rounded-full",

          // Background
          "bg-background",
          "dark:data-checked:bg-primary-foreground",
          "dark:data-unchecked:bg-foreground",

          // Border
          "ring-0",

          // Animation
          "transition-transform",

          // Size
          "group-data-[size=xl]/switch:size-5",
          "group-data-[size=lg]/switch:size-4",
          "group-data-[size=sm]/switch:size-3",

          // Position
          "group-data-[size=xl]/switch:data-unchecked:translate-x-1",
          "group-data-[size=lg]/switch:data-unchecked:translate-x-0",
          "group-data-[size=sm]/switch:data-unchecked:translate-x-0",

          "group-data-[size=xl]/switch:data-checked:translate-x-[calc(110%)]",
          "group-data-[size=lg]/switch:data-checked:translate-x-[calc(100%-2px)]",
          "group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)]",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
