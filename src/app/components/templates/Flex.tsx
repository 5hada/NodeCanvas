import { cn } from "@/lib/utils";

export function Flex({
  className,
  r,
  ...props
}: React.ComponentProps<"div"> & { r?: string }) {
  const style = cn("size-full gap-2 p-2", r ? "flex-2" : "flex-1", className);
  return <div data-slot="flex" className={style} {...props} />;
}
