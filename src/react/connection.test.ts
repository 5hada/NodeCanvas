import { describe, expect, it } from 'vitest'

import type {
  CanvasGraph,
  CanvasGraphId,
  CanvasNodeId,
  CanvasPortId,
  NodeCanvasAdapter,
} from '../core'
import { validateReactFlowConnection } from './connection'

type PortData = {
  kind: 'number' | 'text'
}

const graphId = 'graph-1' as CanvasGraphId
const sourceNodeId = 'source' as CanvasNodeId
const targetNodeId = 'target' as CanvasNodeId
const outputPortId = 'output' as CanvasPortId
const inputPortId = 'input' as CanvasPortId

function createGraph(): CanvasGraph<unknown, PortData> {
  return {
    id: graphId,
    nodes: [
      {
        id: sourceNodeId,
        type: 'source',
        position: { x: 0, y: 0 },
        size: { width: 120, height: 80 },
        ports: [
          {
            id: outputPortId,
            direction: 'output',
            data: { kind: 'number' },
          },
        ],
        data: undefined,
      },
      {
        id: targetNodeId,
        type: 'target',
        position: { x: 200, y: 0 },
        size: { width: 120, height: 80 },
        ports: [
          {
            id: inputPortId,
            direction: 'input',
            data: { kind: 'text' },
          },
        ],
        data: undefined,
      },
    ],
    edges: [],
    groups: [],
    annotations: [],
    data: undefined,
  }
}

describe('react connection validation', () => {
  it('allows valid references without an adapter', () => {
    const result = validateReactFlowConnection(createGraph(), {
      source: sourceNodeId,
      sourceHandle: outputPortId,
      target: targetNodeId,
      targetHandle: inputPortId,
    })

    expect(result.mode).toBe('allow')
    expect(result.issues).toEqual([])
  })

  it('blocks missing node or port references', () => {
    const result = validateReactFlowConnection(createGraph(), {
      source: sourceNodeId,
      sourceHandle: 'missing' as CanvasPortId,
      target: targetNodeId,
      targetHandle: inputPortId,
    })

    expect(result.mode).toBe('block')
    expect(result.issues[0]?.code).toBe('invalid-connection-ref')
  })

  it('delegates domain policy to the adapter', () => {
    const adapter: NodeCanvasAdapter<unknown, PortData> = {
      validateConnection: ({ fromPort, toPort }) => ({
        mode: fromPort.data.kind === toPort.data.kind ? 'allow' : 'warn',
        issues:
          fromPort.data.kind === toPort.data.kind
            ? []
            : [
                {
                  id: 'kind-mismatch',
                  severity: 'warning',
                  code: 'kind-mismatch',
                  message: 'Port kinds do not match.',
                },
              ],
      }),
    }

    const result = validateReactFlowConnection(
      createGraph(),
      {
        source: sourceNodeId,
        sourceHandle: outputPortId,
        target: targetNodeId,
        targetHandle: inputPortId,
      },
      adapter,
    )

    expect(result.mode).toBe('warn')
    expect(result.issues[0]?.code).toBe('kind-mismatch')
  })
})
