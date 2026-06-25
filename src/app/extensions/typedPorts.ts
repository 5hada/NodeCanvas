import type { AppExtension } from './types'

export type TypePolicy = 'warn' | 'block'

export function createTypedPortsExtension(policy: TypePolicy): AppExtension {
  return {
    id: 'typed-ports',
    label: 'Typed ports',
    adapter: {
      validateConnection: ({ fromPort, toPort }) => {
        if (
          fromPort.data.typeKey === 'any' ||
          toPort.data.typeKey === 'any' ||
          fromPort.data.typeKey === toPort.data.typeKey
        ) {
          return { mode: 'allow', issues: [] }
        }

        return {
          mode: policy,
          issues: [
            {
              id: 'typed-ports-mismatch',
              severity: policy === 'block' ? 'error' : 'warning',
              code: 'typed-ports-mismatch',
              message: `${fromPort.data.typeKey} -> ${toPort.data.typeKey}`,
            },
          ],
        }
      },
    },
  }
}
