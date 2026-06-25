import type { Point, ViewportState } from "../types";

export type ZoomOptions = {
  minZoom?: number;
  maxZoom?: number;
  center?: Point;
};

export function createViewport(
  partial: Partial<ViewportState> = {},
): ViewportState {
  return {
    x: partial.x ?? 0,
    y: partial.y ?? 0,
    zoom: partial.zoom ?? 1,
  };
}

export function panViewport(
  viewport: ViewportState,
  delta: Point,
): ViewportState {
  return {
    ...viewport,
    x: viewport.x + delta.x,
    y: viewport.y + delta.y,
  };
}

export function setViewportCenter(
  viewport: ViewportState,
  center: Point,
): ViewportState {
  return {
    ...viewport,
    x: center.x,
    y: center.y,
  };
}

export function zoomViewport(
  viewport: ViewportState,
  zoom: number,
  options: ZoomOptions = {},
): ViewportState {
  const nextZoom = clamp(
    zoom,
    options.minZoom ?? Number.MIN_VALUE,
    options.maxZoom ?? Number.MAX_VALUE,
  );

  if (!options.center) {
    return {
      ...viewport,
      zoom: nextZoom,
    };
  }

  const scale = nextZoom / viewport.zoom;
  return {
    x: options.center.x - (options.center.x - viewport.x) * scale,
    y: options.center.y - (options.center.y - viewport.y) * scale,
    zoom: nextZoom,
  };
}

export function screenToCanvasPoint(
  viewport: ViewportState,
  point: Point,
): Point {
  return {
    x: (point.x - viewport.x) / viewport.zoom,
    y: (point.y - viewport.y) / viewport.zoom,
  };
}

export function canvasToScreenPoint(
  viewport: ViewportState,
  point: Point,
): Point {
  return {
    x: point.x * viewport.zoom + viewport.x,
    y: point.y * viewport.zoom + viewport.y,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
