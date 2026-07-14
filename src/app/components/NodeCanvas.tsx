import {
  Background,
  BackgroundVariant,
  Controls,
  EdgeTypes,
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
import type { CanvasGraph } from "../../../packages/core/src/features/canvas/canvas";
import type {
  CanvasNode,
  CanvasEdge,
} from "../../../packages/core/src/features/canvas/canvas";
import {
  validateConnection,
  applyEdgeChanges,
  applyNodeChanges,
} from "../operation";

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

type NodeCanvasProps = {
  graph: CanvasGraph;
  showBackground: boolean;
  showControls: boolean;
  showMiniMap: boolean;
  showStatusPanel: boolean;
  nodeTypes: NodeTypes;
  edgeTypes: EdgeTypes;
  fitView: boolean;
  className: string;
  children: React.JSX.Element;
  onGraphChange: (graph: CanvasGraph) => void;
  createEdgeData: Promise<() => void>;
  createEdgeId: Promise<() => void>;
  onConnectionValidation: (result: {
    connection: Connection;
    mode: "";
  }) => void;
};

export function NodeCanvas({
  graph,
  onGraphChange,
  createEdgeData,
  createEdgeId,
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
}: NodeCanvasProps): React.JSX.Element {
  const nodes = useMemo(() => graph.nodes, [graph]);
  const edges = useMemo(() => graph.edges, [graph]);
  const flowClassName = [flowClassNames, className].filter(Boolean).join(" ");

  const handleNodesChange = useCallback(
    (changes: NodeChange<CanvasNode>[]) => {
      onGraphChange(applyNodeChanges(graph, changes));
    },
    [graph, onGraphChange],
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange<CanvasEdge>[]) => {
      onGraphChange(applyEdgeChanges(graph, changes));
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
      const validation = validateConnection(graph, connection);
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
      createEdgeData,
      createEdgeId,
      graph,
      onConnectionValidation,
      onGraphChange,
    ],
  );

  const isValidConnection = useCallback<IsValidConnection<CanvasEdge>>(
    (connection) =>
      validateConnection(graph, {
        source: connection.source,
        sourceHandle: connection.sourceHandle ?? null,
        target: connection.target,
        targetHandle: connection.targetHandle ?? null,
      }).mode !== "block",
    [graph],
  );

  return (
    <ReactFlowProvider>
      <ReactFlow
        {...reactFlowProps}
        className={flowClassName}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
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
