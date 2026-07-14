import { ChangeEvent, useMemo, useState } from "react";
import {
  CanvasEdge,
  CanvasGraph,
  CanvasNode,
} from "../../packages/core/src/features/canvas/canvas";
import {
  EditorState,
  SelectionState,
  ViewportState,
} from "../../packages/core/src/features/editor/editor";
import { CanvasGraphId } from "../../packages/core/src/shared/types";
import {
  Connection,
  ConnectionMode,
  EdgeChange,
  NodeChange,
} from "@xyflow/react";

export function createGraph(): CanvasGraph {
  return {
    id: crypto.randomUUID() as CanvasGraphId,
    nodes: [],
    edges: [],
    groups: [],
  };
}

export function initSelection(): SelectionState {
  return {
    nodeIds: [],
    edgeIds: [],
    groupIds: [],
  };
}

export function initViewport(): ViewportState {
  return {
    x: 0,
    y: 0,
    zoom: 0,
  };
}

export function initEditor(): EditorState {
  return {
    mode: "general",
    selection: initSelection(),
    viewport: initViewport(),
  };
}

export function validateConnection(graph: CanvasGraph, connection: Connection) {
  return {
    mode: "",
  };
}

export function addEdge() {}

export function addNode() {}

export function applyNodeChanges(
  graph: CanvasGraph,
  changes: NodeChange<CanvasNode>[],
): CanvasGraph {
  return {
    ...graph,
  };
}

export function applyEdgeChanges(
  graph: CanvasGraph,
  changes: EdgeChange<CanvasEdge>[],
): CanvasGraph {
  return {
    ...graph,
  };
}
