import { describe, expect, it } from "vitest";

import type { NodeChange } from "@xyflow/react";

import type {
  CanvasEdgeId,
  CanvasGraph,
  CanvasGraphId,
  CanvasNodeId,
  CanvasPortId,
} from "../../packages/graph/src";
import {
  applyReactFlowNodeChanges,
  toReactFlowEdges,
  toReactFlowNodes,
} from "./convert";
import type { CanvasReactNode } from "./types";

type NodeData = {
  title: string;
};

type PortData = {
  role: string;
};

type EdgeData = {
  relation: string;
};

const graphId = "graph-1" as CanvasGraphId;
const nodeAId = "node-a" as CanvasNodeId;
const nodeBId = "node-b" as CanvasNodeId;
const outputPortId = "output" as CanvasPortId;
const inputPortId = "input" as CanvasPortId;
const edgeId = "edge-1" as CanvasEdgeId;

function createGraph(): CanvasGraph<NodeData, PortData, EdgeData> {
  return {
    id: graphId,
    nodes: [
      {
        id: nodeAId,
        type: "source-node",
        label: "Source",
        position: { x: 10, y: 20 },
        size: { width: 120, height: 80 },
        ports: [
          {
            id: outputPortId,
            direction: "output",
            label: "out",
            data: { role: "result" },
          },
        ],
        data: { title: "Source" },
      },
      {
        id: nodeBId,
        type: "target-node",
        label: "Target",
        position: { x: 260, y: 20 },
        size: { width: 120, height: 80 },
        ports: [
          {
            id: inputPortId,
            direction: "input",
            label: "in",
            data: { role: "input" },
          },
        ],
        data: { title: "Target" },
      },
    ],
    edges: [
      {
        id: edgeId,
        from: { nodeId: nodeAId, portId: outputPortId },
        to: { nodeId: nodeBId, portId: inputPortId },
        data: { relation: "flow" },
      },
    ],
    groups: [],
    annotations: [],
    data: undefined,
  };
}

describe("react graph conversion", () => {
  it("maps canvas nodes and edges into React Flow elements", () => {
    const graph = createGraph();

    expect(toReactFlowNodes(graph)).toMatchObject([
      {
        id: nodeAId,
        position: { x: 10, y: 20 },
        data: { label: "Source" },
      },
      {
        id: nodeBId,
        position: { x: 260, y: 20 },
        data: { label: "Target" },
      },
    ]);
    expect(toReactFlowEdges(graph)).toMatchObject([
      {
        id: edgeId,
        source: nodeAId,
        sourceHandle: outputPortId,
        target: nodeBId,
        targetHandle: inputPortId,
      },
    ]);
  });

  it("applies React Flow position changes back to the canvas graph", () => {
    const graph = createGraph();
    const changes: NodeChange<CanvasReactNode>[] = [
      {
        id: nodeAId,
        type: "position",
        position: { x: 40, y: 50 },
      },
    ];

    const nextGraph = applyReactFlowNodeChanges(graph, changes);

    expect(nextGraph.nodes[0]?.position).toEqual({ x: 40, y: 50 });
    expect(graph.nodes[0]?.position).toEqual({ x: 10, y: 20 });
  });
});
