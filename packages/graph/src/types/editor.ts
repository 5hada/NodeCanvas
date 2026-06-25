import type {
  CanvasAnnotationId,
  CanvasEdgeId,
  CanvasGroupId,
  CanvasNodeId,
  Point,
} from "./primitives";

export type PersistedEditorState = {
  selection: SelectionState;
  viewport: ViewportState;
  panels?: PanelState[];
  activeTool?: string;
  grid?: GridSettings;
  data?: unknown;
};

export type SelectionState = {
  nodeIds: CanvasNodeId[];
  edgeIds: CanvasEdgeId[];
  groupIds: CanvasGroupId[];
  annotationIds: CanvasAnnotationId[];
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
    }
  | {
      kind: "annotation";
      id: CanvasAnnotationId;
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

export type HistoryState<TSnapshot> = {
  past: TSnapshot[];
  present: TSnapshot;
  future: TSnapshot[];
  limit?: number;
};
