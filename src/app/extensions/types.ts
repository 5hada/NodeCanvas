import type {
  ConnectionValidationResult,
  NodeCanvasAdapter,
} from "../../../packages/graph/src";
import type {
  AppEdgeData,
  AppGraph,
  AppNodeData,
  AppPortData,
} from "../domain";

export type AppExtension = {
  id: string;
  label: string;
  adapter?: NodeCanvasAdapter<AppNodeData, AppPortData, AppEdgeData>;
};

export function composeExtensionAdapters(
  extensions: AppExtension[],
): NodeCanvasAdapter<AppNodeData, AppPortData, AppEdgeData> {
  return {
    validateConnection: (context) => {
      const results = extensions
        .map((extension) => extension.adapter?.validateConnection?.(context))
        .filter((result): result is ConnectionValidationResult =>
          Boolean(result),
        );

      if (results.length === 0) {
        return { mode: "allow", issues: [] };
      }

      return {
        mode: results.some((result) => result.mode === "block")
          ? "block"
          : results.some((result) => result.mode === "warn")
            ? "warn"
            : "allow",
        issues: results.flatMap((result) => result.issues),
      };
    },
    validateGraph: (graph: AppGraph) =>
      extensions.flatMap(
        (extension) => extension.adapter?.validateGraph?.(graph) ?? [],
      ),
  };
}
