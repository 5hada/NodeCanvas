import type { PersistedEditorState } from '../editor'
import type { CanvasGraph } from '../graph'
import type { CanvasDocumentId, IsoDateTime } from '../primitives'

export type CanvasDocument<
  TNodeData = unknown,
  TPortData = unknown,
  TEdgeData = unknown,
  TGroupData = unknown,
  TAnnotationData = unknown,
  TGraphData = unknown,
  TDocumentData = unknown,
> = {
  schemaVersion: number
  id: CanvasDocumentId
  name: string
  createdAt?: IsoDateTime
  updatedAt?: IsoDateTime
  graph: CanvasGraph<
    TNodeData,
    TPortData,
    TEdgeData,
    TGroupData,
    TAnnotationData,
    TGraphData
  >
  editorState?: PersistedEditorState
  data: TDocumentData
}
