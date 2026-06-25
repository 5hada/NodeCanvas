import { Handle, Position, type NodeProps } from '@xyflow/react'

import type { CanvasReactNode } from './types'

export function DefaultCanvasNode({
  data,
  selected,
}: NodeProps<CanvasReactNode>): React.JSX.Element {
  const inputPorts = data.ports.filter((port) => port.direction === 'input')
  const outputPorts = data.ports.filter((port) => port.direction === 'output')

  return (
    <div
      style={{
        minWidth: 120,
        minHeight: 64,
        border: selected ? '2px solid #2563eb' : '1px solid #cbd5e1',
        borderRadius: 8,
        background: '#ffffff',
        color: '#0f172a',
        boxShadow: selected
          ? '0 8px 24px rgba(37, 99, 235, 0.18)'
          : '0 4px 14px rgba(15, 23, 42, 0.1)',
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        fontSize: 12,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          borderBottom: '1px solid #e2e8f0',
          fontWeight: 600,
          padding: '8px 10px',
          textAlign: 'center',
        }}
      >
        {data.label}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8,
          padding: 10,
        }}
      >
        <div style={{ display: 'grid', gap: 6 }}>
          {inputPorts.map((port, index) => (
            <div key={port.id} style={{ position: 'relative', paddingLeft: 4 }}>
              <Handle
                id={port.id}
                type="target"
                position={Position.Left}
                style={{
                  top: 40 + index * 22,
                  width: 8,
                  height: 8,
                  background: '#64748b',
                }}
              />
              <span>{port.label ?? port.id}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gap: 6, textAlign: 'right' }}>
          {outputPorts.map((port, index) => (
            <div key={port.id} style={{ position: 'relative', paddingRight: 4 }}>
              <Handle
                id={port.id}
                type="source"
                position={Position.Right}
                style={{
                  top: 40 + index * 22,
                  width: 8,
                  height: 8,
                  background: '#64748b',
                }}
              />
              <span>{port.label ?? port.id}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
