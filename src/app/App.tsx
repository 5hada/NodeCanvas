import { useMemo, useState } from 'react'

import { addNode, type CanvasEdgeId } from '../core'
import { NodeCanvas } from '../react'
import type { AppGraph, AppNodeKind } from './domain'
import { composeExtensionAdapters } from './extensions/types'
import { createTypedPortsExtension, type TypePolicy } from './extensions/typedPorts'
import { createAppNode, initialGraph, labelForKind } from './graphFactory'

export function App(): React.JSX.Element {
  const [graph, setGraph] = useState<AppGraph>(initialGraph)
  const [nodeSequence, setNodeSequence] = useState(2)
  const [typePolicy, setTypePolicy] = useState<TypePolicy>('warn')
  const [lastConnectionMode, setLastConnectionMode] = useState('idle')

  const extensions = useMemo(
    () => [createTypedPortsExtension(typePolicy)],
    [typePolicy],
  )
  const adapter = useMemo(
    () => composeExtensionAdapters(extensions),
    [extensions],
  )
  const summary = useMemo(
    () => ({
      nodes: graph.nodes.length,
      ports: graph.nodes.reduce((count, node) => count + node.ports.length, 0),
      edges: graph.edges.length,
    }),
    [graph],
  )

  function addNodeByKind(kind: AppNodeKind): void {
    const nextSequence = nodeSequence + 1
    setNodeSequence(nextSequence)
    setGraph((currentGraph) =>
      addNode(
        currentGraph,
        createAppNode(
          `${kind}-${nextSequence}`,
          labelForKind(kind),
          kind,
          {
            x: 120 + nextSequence * 36,
            y: 120 + nextSequence * 24,
          },
        ),
      ),
    )
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">NodeCanvas</div>
        <div className="toolbar">
          <button type="button" onClick={() => addNodeByKind('number-source')}>
            + Number
          </button>
          <button type="button" onClick={() => addNodeByKind('text-source')}>
            + Text
          </button>
          <button type="button" onClick={() => addNodeByKind('processor')}>
            + Processor
          </button>
          <button type="button" onClick={() => addNodeByKind('sink')}>
            + Sink
          </button>
        </div>
        <section className="panel">
          <div className="panel-title">Extensions</div>
          <label className="field">
            <span>Typed ports</span>
            <select
              value={typePolicy}
              onChange={(event) => setTypePolicy(event.target.value as TypePolicy)}
            >
              <option value="warn">Warn</option>
              <option value="block">Block</option>
            </select>
          </label>
        </section>
        <dl className="stats">
          <div>
            <dt>Nodes</dt>
            <dd>{summary.nodes}</dd>
          </div>
          <div>
            <dt>Ports</dt>
            <dd>{summary.ports}</dd>
          </div>
          <div>
            <dt>Edges</dt>
            <dd>{summary.edges}</dd>
          </div>
          <div>
            <dt>Connection</dt>
            <dd>{lastConnectionMode}</dd>
          </div>
        </dl>
      </aside>
      <section className="canvas-region">
        <NodeCanvas
          graph={graph}
          onGraphChange={setGraph}
          adapter={adapter}
          createEdgeData={() => ({ createdBy: 'user' as const })}
          createEdgeId={({ sourceNodeId, sourcePortId, targetNodeId, targetPortId }) =>
            `${sourceNodeId}:${sourcePortId}->${targetNodeId}:${targetPortId}` as CanvasEdgeId
          }
          onConnectionValidation={({ mode }) => setLastConnectionMode(mode)}
          minZoom={0.25}
          maxZoom={2}
        />
      </section>
    </main>
  )
}
