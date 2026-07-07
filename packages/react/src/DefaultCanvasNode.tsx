import { Handle, Position, type NodeProps } from "@xyflow/react";

import type { CanvasReactNode } from "./types";

const nodeClassName = [
  "node-canvas-node",
  "flex min-h-16 min-w-30 flex-col gap-3 overflow-hidden border p-4 text-xs",
  "rounded-[min(32px,var(--radius-3xl))] bg-(--surface) text-(--surface-foreground)",
  "shadow-(--surface-shadow)",
  "transition-[border-color,box-shadow,transform] duration-150 ease-(--ease-out,ease)",
  "data-[selected=true]:shadow-[0_0_0_2px_color-mix(in_oklab,var(--accent)_18%,transparent),var(--overlay-shadow)]",
].join(" ");

const nodeHeaderClassName =
  "text-center font-semibold leading-6 text-(--foreground)";
const portsClassName = "grid grid-cols-2 gap-3";
const portColumnClassName = "grid gap-1.5";
const outputPortColumnClassName = `${portColumnClassName} text-right`;
const inputPortClassName = "relative min-h-4 pl-1 text-(--muted)";
const outputPortClassName = "relative min-h-4 pr-1 text-(--muted)";
const handleClassName = [
  "node-canvas-handle",
  "!size-2 !border !border-(--surface) !bg-(--accent)",
  "!shadow-[0_0_0_2px_color-mix(in_oklab,var(--accent)_16%,transparent)]",
  "hover:!bg-(--accent-hover)",
].join(" ");

export function DefaultCanvasNode({
  data,
  selected,
}: NodeProps<CanvasReactNode>): React.JSX.Element {
  const inputPorts = data.ports.filter((port) => port.direction === "input");
  const outputPorts = data.ports.filter((port) => port.direction === "output");

  return (
    <div className={nodeClassName} data-selected={selected ? "true" : "false"}>
      <div className={nodeHeaderClassName}>{data.label}</div>
      <div className={portsClassName}>
        <div className={portColumnClassName}>
          {inputPorts.map((port, index) => (
            <div className={inputPortClassName} key={port.id}>
              <Handle
                className={handleClassName}
                id={port.id}
                type="target"
                position={Position.Left}
                style={{ top: 40 + index * 22 }}
              />
              <span>{port.label ?? port.id}</span>
            </div>
          ))}
        </div>
        <div className={outputPortColumnClassName}>
          {outputPorts.map((port, index) => (
            <div className={outputPortClassName} key={port.id}>
              <Handle
                className={handleClassName}
                id={port.id}
                type="source"
                position={Position.Right}
                style={{ top: 40 + index * 22 }}
              />
              <span>{port.label ?? port.id}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
