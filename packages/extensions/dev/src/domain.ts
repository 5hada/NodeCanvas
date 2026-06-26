import type {
  CanvasEdge,
  CanvasGraph,
  CanvasNode,
  CanvasPort,
} from "../../../graph/src";

export type DefaultNodeKind =
  | "source"
  | "number-source"
  | "text-source"
  | "processor"
  | "sink";

export type DefaultNodeData = {
  kind: DefaultNodeKind;
};

export type DefaultPortData = {
  typeKey: "number" | "text" | "any";
};

export type DefaultEdgeData = {
  createdBy: "user";
};

export type DefaultGroupData = {};

export type DefaultAnnotationData = {
  createdBy: "user";
};

export type DefaultGraph = CanvasGraph<
  DefaultNodeData,
  DefaultPortData,
  DefaultEdgeData,
  DefaultGroupData,
  DefaultAnnotationData
>;

export type DefaultNode = CanvasNode<DefaultNodeData, DefaultPortData>;

export type DefaultPort = CanvasPort<DefaultPortData>;

export type DefaultEdge = CanvasEdge<DefaultEdgeData>;
