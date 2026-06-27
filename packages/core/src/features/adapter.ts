import type {
  CanvasGraph,
  ConnectionValidationResult,
  NodeCanvasAdapter,
} from "../types";

export type CanvasExtension<
  TNodeData = unknown,
  TPortData = unknown,
  TEdgeData = unknown,
  TGroupData = unknown,
  TAnnotationData = unknown,
  TGraphData = unknown,
  TDocumentData = unknown,
> = {
  id: string;
  label: string;
  version?: string;
  adapter?: NodeCanvasAdapter<
    TNodeData,
    TPortData,
    TEdgeData,
    TGroupData,
    TAnnotationData,
    TGraphData,
    TDocumentData
  >;
};

export function composeExtensionAdapters<
  TNodeData = unknown,
  TPortData = unknown,
  TEdgeData = unknown,
  TGroupData = unknown,
  TAnnotationData = unknown,
  TGraphData = unknown,
  TDocumentData = unknown,
>(
  extensions: CanvasExtension<
    TNodeData,
    TPortData,
    TEdgeData,
    TGroupData,
    TAnnotationData,
    TGraphData,
    TDocumentData
  >[],
): NodeCanvasAdapter<
  TNodeData,
  TPortData,
  TEdgeData,
  TGroupData,
  TAnnotationData,
  TGraphData,
  TDocumentData
> {
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
    validateGraph: (
      graph: CanvasGraph<
        TNodeData,
        TPortData,
        TEdgeData,
        TGroupData,
        TAnnotationData,
        TGraphData
      >,
    ) =>
      extensions.flatMap(
        (extension) => extension.adapter?.validateGraph?.(graph) ?? [],
      ),
  };
}
