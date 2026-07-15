import type {
  CanvasEdgeId,
  CanvasGroupId,
  CanvasNodeId,
  Point,
} from "../../shared/types";

export type EditorState = {
  mode: string;
  selection: SelectionState;
  viewport: ViewportState;
  panels?: PanelState[];
  activeTool?: string;
  grid?: GridSettings;
};

export type SelectionState = {
  nodeIds: CanvasNodeId[];
  edgeIds: CanvasEdgeId[];
  groupIds: CanvasGroupId[];
};

export type SelectableEntity =
  | {
      kind: "node";
      id: CanvasNodeId;
    }
  | {
      kind: "edge";
      id: CanvasEdgeId;
    }
  | {
      kind: "group";
      id: CanvasGroupId;
    };

export type ViewportState = Point & {
  zoom: number;
};

export type PanelState = {
  id: string;
  open: boolean;
  size?: number;
};

export type GridSettings = {
  visible: boolean;
  snap: boolean;
  size: number;
};

export type ConnectValidationPolicy = "none" | "info" | "alert";
