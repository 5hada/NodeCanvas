import type { CanvasDocument } from '../document'
import type { CanvasEdge, CanvasGraph, CanvasNode, CanvasPort } from '../graph'
import type { ValidationIssue } from '../validation'

export type ConnectionValidationMode = 'allow' | 'warn' | 'block'

export type ConnectionValidationResult = {
  mode: ConnectionValidationMode
  issues: ValidationIssue[]
}

export type ConnectionContext<
  TNodeData = unknown,
  TPortData = unknown,
  TEdgeData = unknown,
  TGroupData = unknown,
  TAnnotationData = unknown,
  TGraphData = unknown,
  TDocumentData = unknown,
> = {
  document: CanvasDocument<
    TNodeData,
    TPortData,
    TEdgeData,
    TGroupData,
    TAnnotationData,
    TGraphData,
    TDocumentData
  >
  graph: CanvasGraph<
    TNodeData,
    TPortData,
    TEdgeData,
    TGroupData,
    TAnnotationData,
    TGraphData
  >
  fromNode: CanvasNode<TNodeData, TPortData>
  fromPort: CanvasPort<TPortData>
  toNode: CanvasNode<TNodeData, TPortData>
  toPort: CanvasPort<TPortData>
}

export type NodeCanvasAdapter<
  TNodeData = unknown,
  TPortData = unknown,
  TEdgeData = unknown,
  TGroupData = unknown,
  TAnnotationData = unknown,
  TGraphData = unknown,
  TDocumentData = unknown,
> = {
  validateConnection?: (
    context: ConnectionContext<
      TNodeData,
      TPortData,
      TEdgeData,
      TGroupData,
      TAnnotationData,
      TGraphData,
      TDocumentData
    >,
  ) => ConnectionValidationResult
  validateGraph?: (
    graph: CanvasGraph<
      TNodeData,
      TPortData,
      TEdgeData,
      TGroupData,
      TAnnotationData,
      TGraphData
    >,
  ) => ValidationIssue[]
  getNodeLabel?: (node: CanvasNode<TNodeData, TPortData>) => string
  getEdgeLabel?: (edge: CanvasEdge<TEdgeData>) => string
}
