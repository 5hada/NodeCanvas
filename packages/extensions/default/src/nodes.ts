import type { CanvasNodeId, CanvasPortId, Point, Size } from "@nodecanvas/core";

import type { DefaultNode, DefaultNodeKind } from "./domain";

export type DefaultNodeDefinition = {
  kind: DefaultNodeKind;
  label: string;
  size: Size;
  createPorts: () => DefaultNode["ports"];
};

const defaultNodeSize: Size = { width: 160, height: 104 };

export const defaultNodeDefinitions: DefaultNodeDefinition[] = [
  {
    kind: "source",
    label: "Source",
    size: defaultNodeSize,
    createPorts: () => [
      {
        id: "out" as CanvasPortId,
        direction: "output",
        label: "out",
        data: { typeKey: "any" },
      },
    ],
  },
  {
    kind: "number-source",
    label: "Number",
    size: defaultNodeSize,
    createPorts: () => [
      {
        id: "out" as CanvasPortId,
        direction: "output",
        label: "number",
        data: { typeKey: "number" },
      },
    ],
  },
  {
    kind: "text-source",
    label: "Text",
    size: defaultNodeSize,
    createPorts: () => [
      {
        id: "out" as CanvasPortId,
        direction: "output",
        label: "text",
        data: { typeKey: "text" },
      },
    ],
  },
  {
    kind: "processor",
    label: "Processor",
    size: defaultNodeSize,
    createPorts: () => [
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
    ],
  },
  {
    kind: "sink",
    label: "Sink",
    size: defaultNodeSize,
    createPorts: () => [
      {
        id: "in" as CanvasPortId,
        direction: "input",
        label: "text",
        data: { typeKey: "text" },
      },
    ],
  },
];

export function getDefaultNodeDefinition(
  kind: DefaultNodeKind,
): DefaultNodeDefinition {
  const definition = defaultNodeDefinitions.find((node) => node.kind === kind);

  if (!definition) {
    throw new Error(`Default node definition was not found: ${kind}`);
  }

  return definition;
}

export function createDefaultNode(
  id: string,
  kind: DefaultNodeKind,
  position: Point,
): DefaultNode {
  const definition = getDefaultNodeDefinition(kind);

  return {
    id: id as CanvasNodeId,
    type: kind,
    label: definition.label,
    position,
    size: definition.size,
    ports: definition.createPorts(),
    data: { kind },
  };
}

export function getDefaultNodeLabel(kind: DefaultNodeKind): string {
  return getDefaultNodeDefinition(kind).label;
}
