import type {
  CanvasEdgeId,
  CanvasGraphId,
  CanvasGroupId,
  CanvasNodeId,
  CanvasPortId,
  IO,
  Point,
  Rect,
} from "../../shared/types";
import { NodeType } from "../../shared/types";

export type CanvasGraph = {
  id: CanvasGraphId;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  groups: CanvasGroup[];
};

export type CanvasNode = {
  id: CanvasNodeId;
  type: NodeType;
  position: Point;
  width: number;
  height: number;
  label: string;
  parentGroupId?: CanvasGroupId;
  data: {
    nodeDefId: string;
    ports: CanvasPort[];
  };
};

export type CanvasPort = {
  id: CanvasPortId;
  io: IO;
  order: number;
  label: string;
  portDefId: string;
};

export type CanvasEdge = {
  id: CanvasEdgeId;
  source: CanvasNodeId;
  sourceHandle: CanvasPortId;
  target: CanvasNodeId;
  targetHandle: CanvasPortId;
};

export type CanvasPortRef = {
  nodeId: CanvasNodeId;
  portId: CanvasPortId;
};

export type CanvasGroup = {
  id: CanvasGroupId;
  nodeIds: CanvasNodeId[];
  label?: string;
  rect?: Rect;
  collapsed?: boolean;
};
