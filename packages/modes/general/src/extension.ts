import type { CanvasExtension, CanvasGraphId } from "@nodecanvas/core";

import type {
  DefaultAnnotationData,
  DefaultEdgeData,
  DefaultGraph,
  DefaultGroupData,
  DefaultNodeData,
  DefaultNodeKind,
  DefaultPortData,
} from "./domain";
import {
  createDefaultNode,
  defaultNodeDefinitions,
  type DefaultNodeDefinition,
} from "./nodes";
import { createTypedPortsAdapter, type TypePolicy } from "./typedPorts";

export type DefaultExtensionOptions = {
  typePolicy?: TypePolicy;
};

export type DefaultExtension = CanvasExtension<
  DefaultNodeData,
  DefaultPortData,
  DefaultEdgeData,
  DefaultGroupData,
  DefaultAnnotationData
> & {
  nodes: DefaultNodeDefinition[];
  createNode: typeof createDefaultNode;
  createInitialGraph: () => DefaultGraph;
};

export function createDefaultExtension({
  typePolicy = "warn",
}: DefaultExtensionOptions = {}): DefaultExtension {
  return {
    id: "default",
    label: "Default nodes",
    version: "0.0.0",
    nodes: defaultNodeDefinitions,
    createNode: createDefaultNode,
    createInitialGraph: () => ({
      id: "local-app-graph" as CanvasGraphId,
      nodes: [
        createDefaultNode("number-1", "number-source", { x: 40, y: 80 }),
        createDefaultNode("processor-1", "processor", { x: 320, y: 90 }),
        createDefaultNode("sink-1", "sink", { x: 610, y: 90 }),
      ],
      edges: [],
      groups: [],
      annotations: [],
      data: undefined,
    }),
    adapter: createTypedPortsAdapter(typePolicy),
  };
}

export type { DefaultNodeKind, TypePolicy };
