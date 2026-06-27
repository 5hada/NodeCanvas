import { composeExtensionAdapters, type NodeCanvasAdapter } from "@nodecanvas/core";
import {
  createDefaultExtension,
  type DefaultExtension,
  type DefaultNodeKind,
  type TypePolicy,
} from "@nodecanvas/extensions-default";

import type {
  AppEdgeData,
  AppAnnotationData,
  AppGroupData,
  AppNodeData,
  AppPortData,
} from "../domain";

export type AppExtension = DefaultExtension;

export type AppExtensionRegistry = {
  extensions: AppExtension[];
  nodes: DefaultExtension["nodes"];
  createNode: DefaultExtension["createNode"];
  createInitialGraph: DefaultExtension["createInitialGraph"];
  adapter: NodeCanvasAdapter<
    AppNodeData,
    AppPortData,
    AppEdgeData,
    AppGroupData,
    AppAnnotationData
  >;
};

export type CreateAppExtensionRegistryOptions = {
  typePolicy: TypePolicy;
};

export function createAppExtensionRegistry({
  typePolicy,
}: CreateAppExtensionRegistryOptions): AppExtensionRegistry {
  const defaultExtension = createDefaultExtension({ typePolicy });
  const extensions: AppExtension[] = [defaultExtension];

  return {
    extensions,
    nodes: extensions.flatMap((extension) => extension.nodes),
    createNode: defaultExtension.createNode,
    createInitialGraph: defaultExtension.createInitialGraph,
    adapter: composeExtensionAdapters<
      AppNodeData,
      AppPortData,
      AppEdgeData,
      AppGroupData,
      AppAnnotationData
    >(extensions),
  };
}
