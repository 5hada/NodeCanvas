import type { Point } from "@nodecanvas/core";
import {
  createDefaultExtension,
  getDefaultNodeLabel,
} from "../../packages/modes/general/src";
import type { AppGraph, AppNode, AppNodeKind } from "./domain";

const defaultExtension = createDefaultExtension();

export const initialGraph: AppGraph = defaultExtension.createInitialGraph();

export function createAppNode(
  id: string,
  kind: AppNodeKind,
  position: Point,
): AppNode {
  return defaultExtension.createNode(id, kind, position);
}

export const labelForKind = getDefaultNodeLabel;
