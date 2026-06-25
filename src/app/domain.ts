import type { CanvasGraph, CanvasNode } from "../../packages/graph/src";

export type AppNodeKind =
  | "source"
  | "number-source"
  | "text-source"
  | "processor"
  | "sink";

export type AppNodeData = {
  kind: AppNodeKind;
};

export type AppPortData = {
  typeKey: "number" | "text" | "any";
};

export type AppEdgeData = {
  createdBy: "user";
};

export type AppGraph = CanvasGraph<AppNodeData, AppPortData, AppEdgeData>;

export type AppNode = CanvasNode<AppNodeData, AppPortData>;
