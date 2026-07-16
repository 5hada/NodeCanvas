import type {
  CanvasEdgeId,
  CanvasGroupId,
  CanvasNodeId,
  CanvasPortId,
} from "../shared/types";

export type ValidationIssue = {
  id: string;
  severity: "info" | "warning" | "error";
  code: string;
  message: string;
  target?: ValidationTarget;
  data?: unknown;
};

export type ValidationTarget =
  | {
      kind: "document" | "graph";
    }
  | {
      kind: "node";
      nodeId: CanvasNodeId;
    }
  | {
      kind: "edge";
      edgeId: CanvasEdgeId;
    }
  | {
      kind: "port";
      nodeId: CanvasNodeId;
      portId: CanvasPortId;
    }
  | {
      kind: "group";
      groupId: CanvasGroupId;
    };
