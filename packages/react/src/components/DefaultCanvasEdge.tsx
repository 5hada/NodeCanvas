import type { CanvasEdge } from "@nodecanvas/core";

export function DefaultCanvasEdge<TEdge>(edge: CanvasEdge<TEdge>) {
  return <g data-edge-id={edge.id} />;
}
