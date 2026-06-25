import type { Connection } from '@xyflow/react'

import type {
  CanvasDocument,
  CanvasGraph,
  ConnectionContext,
  ConnectionValidationResult,
  NodeCanvasAdapter,
} from '../core'

export function createConnectionContext<
  TNodeData,
  TPortData,
  TEdgeData,
  TGroupData,
  TAnnotationData,
  TGraphData,
  TDocumentData,
>(
  document: CanvasDocument<
    TNodeData,
    TPortData,
    TEdgeData,
    TGroupData,
    TAnnotationData,
    TGraphData,
    TDocumentData
  >,
  connection: Connection,
):
  | ConnectionContext<
      TNodeData,
      TPortData,
      TEdgeData,
      TGroupData,
      TAnnotationData,
      TGraphData,
      TDocumentData
    >
  | undefined {
  if (
    !connection.source ||
    !connection.sourceHandle ||
    !connection.target ||
    !connection.targetHandle
  ) {
    return undefined
  }

  const fromNode = document.graph.nodes.find(
    (node) => node.id === connection.source,
  )
  const toNode = document.graph.nodes.find((node) => node.id === connection.target)
  const fromPort = fromNode?.ports.find(
    (port) => port.id === connection.sourceHandle,
  )
  const toPort = toNode?.ports.find((port) => port.id === connection.targetHandle)

  if (!fromNode || !toNode || !fromPort || !toPort) {
    return undefined
  }

  return {
    document,
    graph: document.graph,
    fromNode,
    fromPort,
    toNode,
    toPort,
  }
}

export function createGraphBackedDocument<
  TNodeData,
  TPortData,
  TEdgeData,
  TGroupData,
  TAnnotationData,
  TGraphData,
>(
  graph: CanvasGraph<
    TNodeData,
    TPortData,
    TEdgeData,
    TGroupData,
    TAnnotationData,
    TGraphData
  >,
): CanvasDocument<
  TNodeData,
  TPortData,
  TEdgeData,
  TGroupData,
  TAnnotationData,
  TGraphData,
  undefined
> {
  return {
    schemaVersion: 1,
    id: graph.id as unknown as CanvasDocument<
      TNodeData,
      TPortData,
      TEdgeData,
      TGroupData,
      TAnnotationData,
      TGraphData,
      undefined
    >['id'],
    name: String(graph.id),
    graph,
    data: undefined,
  }
}

export function validateReactFlowConnection<
  TNodeData,
  TPortData,
  TEdgeData,
  TGroupData,
  TAnnotationData,
  TGraphData,
>(
  graph: CanvasGraph<
    TNodeData,
    TPortData,
    TEdgeData,
    TGroupData,
    TAnnotationData,
    TGraphData
  >,
  connection: Connection,
  adapter?: NodeCanvasAdapter<
    TNodeData,
    TPortData,
    TEdgeData,
    TGroupData,
    TAnnotationData,
    TGraphData,
    undefined
  >,
): ConnectionValidationResult {
  const context = createConnectionContext(
    createGraphBackedDocument(graph),
    connection,
  )

  if (!context) {
    return {
      mode: 'block',
      issues: [
        {
          id: 'invalid-connection-ref',
          severity: 'error',
          code: 'invalid-connection-ref',
          message: 'Connection references a missing node or port.',
        },
      ],
    }
  }

  return (
    adapter?.validateConnection?.(context) ?? {
      mode: 'allow',
      issues: [],
    }
  )
}
