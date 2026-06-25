import type {
  CanvasGraphId,
  CanvasNodeId,
  CanvasPortId,
  Point,
} from "../../packages/graph/src";
import type { AppGraph, AppNode, AppNodeKind } from "./domain";

export const initialGraph: AppGraph = {
  id: "local-app-graph" as CanvasGraphId,
  nodes: [
    createAppNode("number-1", "Number", "number-source", { x: 40, y: 80 }),
    createAppNode("processor-1", "Processor", "processor", { x: 320, y: 90 }),
    createAppNode("sink-1", "Sink", "sink", { x: 610, y: 90 }),
  ],
  edges: [],
  groups: [],
  annotations: [],
  data: undefined,
};

export function createAppNode(
  id: string,
  label: string,
  kind: AppNodeKind,
  position: Point,
): AppNode {
  return {
    id: id as CanvasNodeId,
    type: kind,
    label,
    position,
    size: { width: 160, height: 104 },
    ports: portsForKind(kind),
    data: { kind },
  };
}

export function labelForKind(kind: AppNodeKind): string {
  switch (kind) {
    case "source":
      return "Source";
    case "number-source":
      return "Number";
    case "text-source":
      return "Text";
    case "processor":
      return "Processor";
    case "sink":
      return "Sink";
  }
}

function portsForKind(kind: AppNodeKind): AppNode["ports"] {
  switch (kind) {
    case "source":
      return [
        {
          id: "out" as CanvasPortId,
          direction: "output",
          label: "out",
          data: { typeKey: "any" },
        },
      ];
    case "number-source":
      return [
        {
          id: "out" as CanvasPortId,
          direction: "output",
          label: "number",
          data: { typeKey: "number" },
        },
      ];
    case "text-source":
      return [
        {
          id: "out" as CanvasPortId,
          direction: "output",
          label: "text",
          data: { typeKey: "text" },
        },
      ];
    case "processor":
      return [
        {
          id: "in" as CanvasPortId,
          direction: "input",
          label: "in",
          data: { typeKey: "any" },
        },
        {
          id: "out" as CanvasPortId,
          direction: "output",
          label: "out",
          data: { typeKey: "any" },
        },
      ];
    case "sink":
      return [
        {
          id: "in" as CanvasPortId,
          direction: "input",
          label: "text",
          data: { typeKey: "text" },
        },
      ];
  }
}
