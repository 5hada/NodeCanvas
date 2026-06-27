import "@xyflow/react/dist/style.css";
import "./NodeCanvas.css";

import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  type Connection,
  type EdgeChange,
  type IsValidConnection,
  type NodeChange,
  type NodeTypes,
} from "@xyflow/react";
import { useCallback, useMemo } from "react";

import type { CanvasGraph } from "@nodecanvas/core";
import {
  applyReactFlowEdgeChanges,
  applyReactFlowNodeChanges,
  connectReactFlowEdge,
  toReactFlowEdges,
  toReactFlowNodes,
} from "./convert";
import { validateReactFlowConnection } from "./connection";
import { DefaultCanvasNode } from "./DefaultCanvasNode";
import type {
  CanvasReactEdge,
  CanvasReactNode,
  NodeCanvasProps,
} from "./types";

const defaultNodeTypes: NodeTypes = {
  nodeCanvasDefault: DefaultCanvasNode,
};

const flowClassNames =
  "node-canvas-flow bg-[var(--background)] text-[var(--foreground)]";
const backgroundClassNames = "node-canvas-background bg-[var(--background)]";
const statusPanelClassNames = [
  "node-canvas-panel",
  "node-canvas-status-panel",
  "inline-flex min-h-9 items-center gap-2 rounded-[min(32px,var(--radius-3xl))]",
  "border border-[var(--border)] bg-[var(--overlay)] px-2.5 py-1.5",
  "text-xs font-semibold text-[var(--overlay-foreground)]",
  "shadow-[var(--overlay-shadow)] backdrop-blur-md",
].join(" ");
const controlsClassNames = [
  "node-canvas-controls",
  "!overflow-hidden !rounded-[min(32px,var(--radius-3xl))]",
  "!border !border-[var(--border)] !bg-[var(--overlay)]",
  "!shadow-[var(--overlay-shadow)]",
].join(" ");
const miniMapClassNames = [
  "node-canvas-minimap",
  "!overflow-hidden !rounded-[min(32px,var(--radius-3xl))]",
  "!border !border-[var(--border)] !bg-[var(--overlay)]",
  "!shadow-[var(--overlay-shadow)]",
].join(" ");

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
  showBackground = true,
  showControls = true,
  showMiniMap = true,
  showStatusPanel = true,
  nodeTypes,
  edgeTypes,
  fitView = true,
  className,
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
  const nodes = useMemo(() => toReactFlowNodes(graph), [graph]);
  const edges = useMemo(() => toReactFlowEdges(graph), [graph]);
  const flowClassName = [flowClassNames, className].filter(Boolean).join(" ");
  const mergedNodeTypes = useMemo(
    () => ({
      ...defaultNodeTypes,
      ...nodeTypes,
    }),
    [nodeTypes],
  );

  const handleNodesChange = useCallback(
    (changes: NodeChange<CanvasReactNode<TNodeData, TPortData>>[]) => {
      onGraphChange(applyReactFlowNodeChanges(graph, changes));
    },
    [graph, onGraphChange],
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange<CanvasReactEdge<TEdgeData>>[]) => {
      onGraphChange(applyReactFlowEdgeChanges(graph, changes));
    },
    [graph, onGraphChange],
  );

  const handleConnect = useCallback(
    (connection: Connection) => {
      if (
        !connection.source ||
        !connection.sourceHandle ||
        !connection.target ||
        !connection.targetHandle
      ) {
        return;
      }

      const context = {
        graph,
        sourceNodeId: connection.source,
        sourcePortId: connection.sourceHandle,
        targetNodeId: connection.target,
        targetPortId: connection.targetHandle,
      };
      const validation = validateReactFlowConnection(
        graph,
        connection,
        adapter,
      );
      onConnectionValidation?.({
        connection: context,
        mode: validation.mode,
      });
      if (validation.mode === "block") {
        return;
      }
      const edgeId =
        createEdgeId?.(context) ??
        `${connection.source}:${connection.sourceHandle}->${connection.target}:${connection.targetHandle}`;
      const edgeData = createEdgeData?.(context) ?? (undefined as TEdgeData);

      onGraphChange(connectReactFlowEdge(graph, context, edgeId, edgeData));
    },
    [
      adapter,
      createEdgeData,
      createEdgeId,
      graph,
      onConnectionValidation,
      onGraphChange,
    ],
  );

  const isValidConnection = useCallback<
    IsValidConnection<CanvasReactEdge<TEdgeData>>
  >(
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
      ).mode !== "block",
    [adapter, graph],
  );

  return (
    <ReactFlowProvider>
      <ReactFlow
        {...reactFlowProps}
        className={flowClassName}
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
        {showBackground ? (
          <Background
            className={backgroundClassNames}
            color="var(--separator)"
            gap={24}
            size={1.2}
            variant={BackgroundVariant.Dots}
          />
        ) : null}
        {showStatusPanel ? (
          <Panel className={statusPanelClassNames} position="top-left">
            <span>{graph.nodes.length} nodes</span>
            <span>{graph.edges.length} edges</span>
          </Panel>
        ) : null}
        {showControls ? (
          <Controls
            className={controlsClassNames}
            position="bottom-left"
            fitViewOptions={{ padding: 0.24 }}
          />
        ) : null}
        {showMiniMap ? (
          <MiniMap
            className={miniMapClassNames}
            position="bottom-right"
            pannable
            zoomable
            bgColor="var(--surface)"
            maskColor="color-mix(in oklab, var(--background) 72%, transparent)"
            nodeBorderRadius={8}
            nodeColor="var(--default)"
            nodeStrokeColor="var(--accent)"
            nodeStrokeWidth={2}
          />
        ) : null}
        {children}
      </ReactFlow>
    </ReactFlowProvider>
  );
}

export type AnyCanvasGraph = CanvasGraph;
