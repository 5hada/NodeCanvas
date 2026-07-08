import type { NodeCanvasAdapter } from "@nodecanvas/core";

import type { DefaultEdgeData, DefaultNodeData, DefaultPortData } from "./domain";

export type TypePolicy = "warn" | "block";

export function createTypedPortsAdapter(
  policy: TypePolicy,
): NodeCanvasAdapter<DefaultNodeData, DefaultPortData, DefaultEdgeData> {
  return {
    validateConnection: ({ fromPort, toPort }) => {
      if (
        fromPort.data.typeKey === "any" ||
        toPort.data.typeKey === "any" ||
        fromPort.data.typeKey === toPort.data.typeKey
      ) {
        return { mode: "allow", issues: [] };
      }

      return {
        mode: policy,
        issues: [
          {
            id: "typed-ports-mismatch",
            severity: policy === "block" ? "error" : "warning",
            code: "typed-ports-mismatch",
            message: `${fromPort.data.typeKey} -> ${toPort.data.typeKey}`,
          },
        ],
      };
    },
  };
}
