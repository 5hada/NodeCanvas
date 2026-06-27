import type {
  CanvasAnnotationId,
  CanvasEdgeId,
  CanvasGraphId,
  CanvasGroupId,
  CanvasNodeId,
  CanvasPortId,
  Point,
  Rect,
  Size,
} from "./primitives";

export type CanvasGraph<
  TNodeData = unknown,
  TPortData = unknown,
  TEdgeData = unknown,
  TGroupData = unknown,
  TAnnotationData = unknown,
  TGraphData = unknown,
> = {
  id: CanvasGraphId;
  nodes: CanvasNode<TNodeData, TPortData>[];
  edges: CanvasEdge<TEdgeData>[];
  groups: CanvasGroup<TGroupData>[];
  annotations: CanvasAnnotation<TAnnotationData>[];
  data: TGraphData;
};

export type CanvasNode<TNodeData = unknown, TPortData = unknown> = {
  id: CanvasNodeId;
  type: string;
  position: Point;
  size: Size;
  ports: CanvasPort<TPortData>[];
  data: TNodeData;
  label?: string;
  parentGroupId?: CanvasGroupId;
  zIndex?: number;
};

export type CanvasPort<TPortData = unknown> = {
  id: CanvasPortId;
  direction: "input" | "output";
  data: TPortData;
  label?: string;
  order?: number;
};

export type CanvasEdge<TEdgeData = unknown> = {
  id: CanvasEdgeId;
  from: CanvasPortRef;
  to: CanvasPortRef;
  data: TEdgeData;
  label?: string;
  zIndex?: number;
};

export type CanvasPortRef = {
  nodeId: CanvasNodeId;
  portId: CanvasPortId;
};

export type CanvasGroup<TGroupData = unknown> = {
  id: CanvasGroupId;
  nodeIds: CanvasNodeId[];
  data: TGroupData;
  label?: string;
  bounds?: Rect;
  collapsed?: boolean;
  zIndex?: number;
};

export type CanvasAnnotation<TAnnotationData = unknown> = {
  id: CanvasAnnotationId;
  type: string;
  position: Point;
  size: Size;
  data: TAnnotationData;
  zIndex?: number;
};
