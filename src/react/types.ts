import type {
  Edge,
  EdgeTypes,
  Node,
  NodeTypes,
  ReactFlowProps,
} from "@xyflow/react";

import type {
  NodeCanvasAdapter,
  CanvasEdge,
  CanvasGraph,
  CanvasNode,
  CanvasPort,
} from "../../packages/graph/src";

export type CanvasReactNodeData<
  TNodeData = unknown,
  TPortData = unknown,
> = Record<string, unknown> & {
  canvasNode: CanvasNode<TNodeData, TPortData>;
  ports: CanvasPort<TPortData>[];
  label: string;
};

export type CanvasReactEdgeData<TEdgeData = unknown> = Record<
  string,
  unknown
> & {
  canvasEdge: CanvasEdge<TEdgeData>;
};

export type CanvasReactNode<TNodeData = unknown, TPortData = unknown> = Node<
  CanvasReactNodeData<TNodeData, TPortData>
>;

export type CanvasReactEdge<TEdgeData = unknown> = Edge<
  CanvasReactEdgeData<TEdgeData>
>;

export type CreateEdgeContext<
  TNodeData = unknown,
  TPortData = unknown,
  TEdgeData = unknown,
  TGroupData = unknown,
  TAnnotationData = unknown,
  TGraphData = unknown,
> = {
  graph: CanvasGraph<
    TNodeData,
    TPortData,
    TEdgeData,
    TGroupData,
    TAnnotationData,
    TGraphData
  >;
  sourceNodeId: string;
  sourcePortId: string;
  targetNodeId: string;
  targetPortId: string;
};

export type NodeCanvasProps<
  TNodeData = unknown,
  TPortData = unknown,
  TEdgeData = unknown,
  TGroupData = unknown,
  TAnnotationData = unknown,
  TGraphData = unknown,
> = Omit<
  ReactFlowProps<
    CanvasReactNode<TNodeData, TPortData>,
    CanvasReactEdge<TEdgeData>
  >,
  | "nodes"
  | "edges"
  | "onNodesChange"
  | "onEdgesChange"
  | "onConnect"
  | "nodeTypes"
  | "edgeTypes"
> & {
  graph: CanvasGraph<
    TNodeData,
    TPortData,
    TEdgeData,
    TGroupData,
    TAnnotationData,
    TGraphData
  >;
  onGraphChange: (
    graph: CanvasGraph<
      TNodeData,
      TPortData,
      TEdgeData,
      TGroupData,
      TAnnotationData,
      TGraphData
    >,
  ) => void;
  createEdgeData?: (
    context: CreateEdgeContext<
      TNodeData,
      TPortData,
      TEdgeData,
      TGroupData,
      TAnnotationData,
      TGraphData
    >,
  ) => TEdgeData;
  createEdgeId?: (
    context: CreateEdgeContext<
      TNodeData,
      TPortData,
      TEdgeData,
      TGroupData,
      TAnnotationData,
      TGraphData
    >,
  ) => string;
  adapter?: NodeCanvasAdapter<
    TNodeData,
    TPortData,
    TEdgeData,
    TGroupData,
    TAnnotationData,
    TGraphData,
    undefined
  >;
  onConnectionValidation?: (result: {
    connection: CreateEdgeContext<
      TNodeData,
      TPortData,
      TEdgeData,
      TGroupData,
      TAnnotationData,
      TGraphData
    >;
    mode: "allow" | "warn" | "block";
  }) => void;
  showBackground?: boolean;
  showControls?: boolean;
  showMiniMap?: boolean;
  showStatusPanel?: boolean;
  nodeTypes?: NodeTypes;
  edgeTypes?: EdgeTypes;
};
