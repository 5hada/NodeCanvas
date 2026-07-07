import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

export function Separator({ className, ...props }: ComponentProps<"div">) {
  const cName = cn("w-full px-4 my-2 border-1 h-fit", className);
  return (
    <div className={cName} {...props}>
      {/* <div></div> */}
    </div>
  );
}
