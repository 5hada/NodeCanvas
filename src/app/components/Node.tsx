import { NodeProps } from "@xyflow/react";

export function ProcessorNode(props: NodeProps) {
  return (
    <div>
      <p>Processor</p>
      <button className="nodrag">Increment</button>
    </div>
  );
}

export function SourceNode(props: NodeProps) {
  return (
    <div>
      <p>Source</p>
      <button className="nodrag">Increment</button>
    </div>
  );
}

export function SinkNode(props: NodeProps) {
  return (
    <div>
      <p>Sink</p>
      <button className="nodrag">Increment</button>
    </div>
  );
}
