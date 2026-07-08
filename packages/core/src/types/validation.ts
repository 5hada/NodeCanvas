import type {
  CanvasAnnotationId,
  CanvasEdgeId,
  CanvasGroupId,
  CanvasNodeId,
  CanvasPortId,
} from "./primitives";

export type ValidationLevel = "none" | "info" | "warning" | "error";

export type ValidationIssue = {
  id: string;
  severity: ValidationLevel;
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
    }
  | {
      kind: "annotation";
      annotationId: CanvasAnnotationId;
    };
