import { describe, expect, it } from 'vitest'

import {
  addEdge,
  addNode,
  addPort,
  removeNode,
  removePort,
} from './operations'
import type { CanvasGraph, CanvasNode, CanvasPort } from './types'
import type {
  CanvasEdgeId,
  CanvasGraphId,
  CanvasNodeId,
  CanvasPortId,
} from '../primitives'

type NodeData = {
  title: string
}

type PortData = {
  role: string
}

type EdgeData = {
  relation: string
}

const graphId = 'graph-1' as CanvasGraphId
const nodeAId = 'node-a' as CanvasNodeId
const nodeBId = 'node-b' as CanvasNodeId
const inputPortId = 'input' as CanvasPortId
const outputPortId = 'output' as CanvasPortId
const edgeId = 'edge-1' as CanvasEdgeId

function createGraph(): CanvasGraph<NodeData, PortData, EdgeData> {
  return {
    id: graphId,
    nodes: [],
    edges: [],
    groups: [],
    annotations: [],
    data: undefined,
  }
}

function createNode(id: CanvasNodeId): CanvasNode<NodeData, PortData> {
  return {
    id,
    type: 'basic',
    label: String(id),
    position: { x: 0, y: 0 },
    size: { width: 120, height: 80 },
    ports: [],
    data: { title: String(id) },
  }
}

function createPort(
  id: CanvasPortId,
  direction: CanvasPort<PortData>['direction'],
): CanvasPort<PortData> {
  return {
    id,
    direction,
    data: { role: String(id) },
  }
}

describe('graph operations', () => {
  it('adds nodes and rejects duplicate node ids', () => {
    const graph = addNode(createGraph(), createNode(nodeAId))

    expect(graph.nodes).toHaveLength(1)
    expect(() => addNode(graph, createNode(nodeAId))).toThrow(
      'Node already exists',
    )
  })

  it('adds ports and edges between existing port refs', () => {
    const graph = addEdge(
      addPort(
        addPort(
          addNode(addNode(createGraph(), createNode(nodeAId)), createNode(nodeBId)),
          nodeAId,
          createPort(outputPortId, 'output'),
        ),
        nodeBId,
        createPort(inputPortId, 'input'),
      ),
      {
        id: edgeId,
        from: { nodeId: nodeAId, portId: outputPortId },
        to: { nodeId: nodeBId, portId: inputPortId },
        data: { relation: 'flow' },
      },
    )

    expect(graph.edges).toHaveLength(1)
  })

  it('removes connected edges when a port is removed', () => {
    const graph = addEdge(
      addPort(
        addPort(
          addNode(addNode(createGraph(), createNode(nodeAId)), createNode(nodeBId)),
          nodeAId,
          createPort(outputPortId, 'output'),
        ),
        nodeBId,
        createPort(inputPortId, 'input'),
      ),
      {
        id: edgeId,
        from: { nodeId: nodeAId, portId: outputPortId },
        to: { nodeId: nodeBId, portId: inputPortId },
        data: { relation: 'flow' },
      },
    )

    const nextGraph = removePort(graph, {
      nodeId: nodeAId,
      portId: outputPortId,
    })

    expect(nextGraph.edges).toHaveLength(0)
  })

  it('removes connected edges when a node is removed', () => {
    const graph = addEdge(
      addPort(
        addPort(
          addNode(addNode(createGraph(), createNode(nodeAId)), createNode(nodeBId)),
          nodeAId,
          createPort(outputPortId, 'output'),
        ),
        nodeBId,
        createPort(inputPortId, 'input'),
      ),
      {
        id: edgeId,
        from: { nodeId: nodeAId, portId: outputPortId },
        to: { nodeId: nodeBId, portId: inputPortId },
        data: { relation: 'flow' },
      },
    )

    const nextGraph = removeNode(graph, nodeAId)

    expect(nextGraph.nodes).toHaveLength(1)
    expect(nextGraph.edges).toHaveLength(0)
  })
})
