import '@xyflow/react/dist/style.css'

import {
  Background,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  type Connection,
  type EdgeChange,
  type IsValidConnection,
  type NodeChange,
  type NodeTypes,
} from '@xyflow/react'
import { useCallback, useMemo } from 'react'

import type { CanvasGraph } from '../core'
import {
  applyReactFlowEdgeChanges,
  applyReactFlowNodeChanges,
  connectReactFlowEdge,
  toReactFlowEdges,
  toReactFlowNodes,
} from './convert'
import { validateReactFlowConnection } from './connection'
import { DefaultCanvasNode } from './DefaultCanvasNode'
import type { CanvasReactEdge, CanvasReactNode, NodeCanvasProps } from './types'

const defaultNodeTypes: NodeTypes = {
  nodeCanvasDefault: DefaultCanvasNode,
}

export function NodeCanvas<
  TNodeData = unknown,
  TPortData = unknown,
  TEdgeData = unknown,
  TGroupData = unknown,
  TAnnotationData = unknown,
  TGraphData = unknown,
>({
  graph,
  onGraphChange,
  createEdgeData,
  createEdgeId,
  adapter,
  onConnectionValidation,
  nodeTypes,
  edgeTypes,
  fitView = true,
  children,
  ...reactFlowProps
}: NodeCanvasProps<
  TNodeData,
  TPortData,
  TEdgeData,
  TGroupData,
  TAnnotationData,
  TGraphData
>): React.JSX.Element {
  const nodes = useMemo(() => toReactFlowNodes(graph), [graph])
  const edges = useMemo(() => toReactFlowEdges(graph), [graph])
  const mergedNodeTypes = useMemo(
    () => ({
      ...defaultNodeTypes,
      ...nodeTypes,
    }),
    [nodeTypes],
  )

  const handleNodesChange = useCallback(
    (changes: NodeChange<CanvasReactNode<TNodeData, TPortData>>[]) => {
      onGraphChange(applyReactFlowNodeChanges(graph, changes))
    },
    [graph, onGraphChange],
  )

  const handleEdgesChange = useCallback(
    (changes: EdgeChange<CanvasReactEdge<TEdgeData>>[]) => {
      onGraphChange(applyReactFlowEdgeChanges(graph, changes))
    },
    [graph, onGraphChange],
  )

  const handleConnect = useCallback(
    (connection: Connection) => {
      if (
        !connection.source ||
        !connection.sourceHandle ||
        !connection.target ||
        !connection.targetHandle
      ) {
        return
      }

      const context = {
        graph,
        sourceNodeId: connection.source,
        sourcePortId: connection.sourceHandle,
        targetNodeId: connection.target,
        targetPortId: connection.targetHandle,
      }
      const validation = validateReactFlowConnection(graph, connection, adapter)
      onConnectionValidation?.({
        connection: context,
        mode: validation.mode,
      })
      if (validation.mode === 'block') {
        return
      }
      const edgeId =
        createEdgeId?.(context) ??
        `${connection.source}:${connection.sourceHandle}->${connection.target}:${connection.targetHandle}`
      const edgeData = createEdgeData?.(context) ?? (undefined as TEdgeData)

      onGraphChange(connectReactFlowEdge(graph, context, edgeId, edgeData))
    },
    [
      adapter,
      createEdgeData,
      createEdgeId,
      graph,
      onConnectionValidation,
      onGraphChange,
    ],
  )

  const isValidConnection = useCallback<IsValidConnection<CanvasReactEdge<TEdgeData>>>(
    (connection) =>
      validateReactFlowConnection(
        graph,
        {
          source: connection.source,
          sourceHandle: connection.sourceHandle ?? null,
          target: connection.target,
          targetHandle: connection.targetHandle ?? null,
        },
        adapter,
      ).mode !== 'block',
    [adapter, graph],
  )

  return (
    <ReactFlowProvider>
      <ReactFlow
        {...reactFlowProps}
        nodes={nodes}
        edges={edges}
        nodeTypes={mergedNodeTypes}
        edgeTypes={edgeTypes}
        fitView={fitView}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        isValidConnection={isValidConnection}
      >
        <Background />
        <Controls />
        {children}
      </ReactFlow>
    </ReactFlowProvider>
  )
}

export type AnyCanvasGraph = CanvasGraph
