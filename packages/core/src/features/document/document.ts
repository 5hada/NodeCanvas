import type { EditorState } from "../editor/editor";
import type { CanvasGraph } from "../canvas/canvas";
import type { CanvasDocumentId, IsoDateTime } from "../../shared/types";

export type CanvasDocument = {
  id: CanvasDocumentId;
  name: string;
  createdAt?: IsoDateTime;
  updatedAt?: IsoDateTime;
  graph: CanvasGraph;
  editorState: EditorState;
};
