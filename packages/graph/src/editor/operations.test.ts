import { describe, expect, it } from "vitest";

import {
  addToSelection,
  canRedo,
  canUndo,
  canvasToScreenPoint,
  createEmptySelection,
  createHistory,
  createViewport,
  pushHistory,
  redoHistory,
  screenToCanvasPoint,
  selectOnly,
  toggleSelection,
  undoHistory,
  zoomViewport,
} from "./index";
import type { CanvasNodeId } from "../types";

const nodeAId = "node-a" as CanvasNodeId;
const nodeBId = "node-b" as CanvasNodeId;

describe("editor operations", () => {
  it("selects, adds, and toggles entities", () => {
    const selection = addToSelection(
      selectOnly(createEmptySelection(), { kind: "node", id: nodeAId }),
      { kind: "node", id: nodeBId },
    );

    expect(selection.nodeIds).toEqual([nodeAId, nodeBId]);
    expect(
      toggleSelection(selection, { kind: "node", id: nodeAId }).nodeIds,
    ).toEqual([nodeBId]);
  });

  it("converts points between screen and canvas coordinates", () => {
    const viewport = createViewport({ x: 10, y: 20, zoom: 2 });
    const canvasPoint = screenToCanvasPoint(viewport, { x: 30, y: 60 });

    expect(canvasPoint).toEqual({ x: 10, y: 20 });
    expect(canvasToScreenPoint(viewport, canvasPoint)).toEqual({
      x: 30,
      y: 60,
    });
  });

  it("zooms around a stable center point", () => {
    const viewport = zoomViewport(createViewport(), 2, {
      center: { x: 100, y: 100 },
    });

    expect(viewport).toEqual({ x: -100, y: -100, zoom: 2 });
  });

  it("tracks undo and redo history", () => {
    const history = pushHistory(pushHistory(createHistory(1), 2), 3);

    expect(canUndo(history)).toBe(true);
    expect(undoHistory(history).present).toBe(2);
    expect(canRedo(undoHistory(history))).toBe(true);
    expect(redoHistory(undoHistory(history)).present).toBe(3);
  });
});
