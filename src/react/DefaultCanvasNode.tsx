import { Handle, Position, type NodeProps } from "@xyflow/react";

import type { CanvasReactNode } from "./types";

const nodeClassNames = [
  "node-canvas-node",
  "flex min-h-16 min-w-30 flex-col gap-3 overflow-hidden border-0 p-4 text-xs",
  "rounded-[min(32px,var(--radius-3xl))] bg-[var(--surface)] text-[var(--surface-foreground)]",
  "shadow-[var(--surface-shadow)]",
  "transition-[border-color,box-shadow,transform] duration-150 ease-[var(--ease-out,ease)]",
  "data-[selected=true]:shadow-[0_0_0_2px_color-mix(in_oklab,var(--accent)_18%,transparent),var(--overlay-shadow)]",
].join(" ");
const nodeHeaderClassNames =
  "text-center font-semibold leading-6 text-[var(--foreground)]";
const portsClassNames = "grid grid-cols-2 gap-3";
const portColumnClassNames = "grid gap-1.5";
const outputPortColumnClassNames = `${portColumnClassNames} text-right`;
const inputPortClassNames = "relative min-h-4 pl-1 text-[var(--muted)]";
const outputPortClassNames = "relative min-h-4 pr-1 text-[var(--muted)]";
const handleClassNames = [
  "node-canvas-handle",
  "!size-2 !border !border-[var(--surface)] !bg-[var(--accent)]",
  "!shadow-[0_0_0_2px_color-mix(in_oklab,var(--accent)_16%,transparent)]",
  "hover:!bg-[var(--accent-hover)]",
].join(" ");

export function DefaultCanvasNode({
  data,
  selected,
}: NodeProps<CanvasReactNode>): React.JSX.Element {
  const inputPorts = data.ports.filter((port) => port.direction === "input");
  const outputPorts = data.ports.filter((port) => port.direction === "output");

  return (
    <div className={nodeClassNames} data-selected={selected ? "true" : "false"}>
      <div className={nodeHeaderClassNames}>{data.label}</div>
      <div className={portsClassNames}>
        <div className={portColumnClassNames}>
          {inputPorts.map((port, index) => (
            <div className={inputPortClassNames} key={port.id}>
              <Handle
                className={handleClassNames}
                id={port.id}
                type="target"
                position={Position.Left}
                style={{ top: 40 + index * 22 }}
              />
              <span>{port.label ?? port.id}</span>
            </div>
          ))}
        </div>
        <div className={outputPortColumnClassNames}>
          {outputPorts.map((port, index) => (
            <div className={outputPortClassNames} key={port.id}>
              <Handle
                className={handleClassNames}
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
