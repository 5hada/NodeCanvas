import type { EdgeChange, NodeChange } from '@xyflow/react'

import {
  addEdge,
  moveNode,
  removeEdge,
  removeNode,
  resizeNode,
  type CanvasEdge,
  type CanvasEdgeId,
  type CanvasGraph,
  type CanvasNodeId,
  type CanvasPortId,
} from '../core'
import type {
  CanvasReactEdge,
  CanvasReactNode,
  CreateEdgeContext,
} from './types'

export function toReactFlowNodes<
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
): CanvasReactNode<TNodeData, TPortData>[] {
  return graph.nodes.map((node) => ({
    id: node.id,
    type: 'nodeCanvasDefault',
    position: node.position,
    width: node.size.width,
    height: node.size.height,
    zIndex: node.zIndex,
    parentId: node.parentGroupId,
    data: {
      canvasNode: node,
      ports: node.ports,
      label: node.label ?? node.type,
    },
  }))
}

export function toReactFlowEdges<
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
): CanvasReactEdge<TEdgeData>[] {
  return graph.edges.map((edge) => ({
    id: edge.id,
    source: edge.from.nodeId,
    sourceHandle: edge.from.portId,
    target: edge.to.nodeId,
    targetHandle: edge.to.portId,
    zIndex: edge.zIndex,
    label: edge.label,
    data: {
      canvasEdge: edge,
    },
  }))
}

export function applyReactFlowNodeChanges<TGraph extends CanvasGraph>(
  graph: TGraph,
  changes: NodeChange<CanvasReactNode>[],
): TGraph {
  return changes.reduce((nextGraph, change) => {
    switch (change.type) {
      case 'position':
        if (!change.position) {
          return nextGraph
        }
        return moveNode(
          nextGraph,
          change.id as CanvasNodeId,
          change.position,
        ) as TGraph
      case 'dimensions':
        if (!change.dimensions) {
          return nextGraph
        }
        return resizeNode(
          nextGraph,
          change.id as CanvasNodeId,
          {
            width: change.dimensions.width,
            height: change.dimensions.height,
          },
        ) as TGraph
      case 'remove':
        return removeNode(nextGraph, change.id as CanvasNodeId) as TGraph
      default:
        return nextGraph
    }
  }, graph)
}

export function applyReactFlowEdgeChanges<TGraph extends CanvasGraph>(
  graph: TGraph,
  changes: EdgeChange<CanvasReactEdge>[],
): TGraph {
  return changes.reduce((nextGraph, change) => {
    switch (change.type) {
      case 'remove':
        return removeEdge(nextGraph, change.id as CanvasEdgeId) as TGraph
      default:
        return nextGraph
    }
  }, graph)
}

export function connectReactFlowEdge<
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
  context: CreateEdgeContext<
    TNodeData,
    TPortData,
    TEdgeData,
    TGroupData,
    TAnnotationData,
    TGraphData
  >,
  edgeId: string,
  edgeData: TEdgeData,
): CanvasGraph<
  TNodeData,
  TPortData,
  TEdgeData,
  TGroupData,
  TAnnotationData,
  TGraphData
> {
  const edge: CanvasEdge<TEdgeData> = {
    id: edgeId as CanvasEdgeId,
    from: {
      nodeId: context.sourceNodeId as CanvasNodeId,
      portId: context.sourcePortId as CanvasPortId,
    },
    to: {
      nodeId: context.targetNodeId as CanvasNodeId,
      portId: context.targetPortId as CanvasPortId,
    },
    data: edgeData,
  }

  return addEdge(graph, edge)
}
