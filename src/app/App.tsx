import { useMemo, useState } from "react";
import { useTheme } from "@heroui/react";
import { ColorMode } from "@xyflow/react";

import { addNode, type CanvasEdgeId } from "@nodecanvas/core";
import { NodeCanvas } from "@nodecanvas/react";
import type { TypePolicy } from "@nodecanvas/extensions-default";
import type { AppGraph, AppNodeKind } from "./domain";
import { createAppExtensionRegistry } from "./extensions/registry";
import { initialGraph } from "./graphFactory";
import { SideBar } from "./components/SideBar";
import { Flex } from "./components/templates/Flex";
import { ThemeControl } from "@/lib/types";

export function App(): React.JSX.Element {
  const [graph, setGraph] = useState<AppGraph>(initialGraph);
  const [typePolicy, setTypePolicy] = useState<TypePolicy>("warn");
  const [lastConnectionMode, setLastConnectionMode] = useState("idle");

  const { resolvedTheme, setTheme, theme } = useTheme();
  const colorMode: ColorMode = resolvedTheme === "dark" ? "dark" : "light";
  const isDarkTheme = resolvedTheme === "dark";
  const themeControl: ThemeControl = { isDarkTheme, setTheme };

  const registry = useMemo(
    () => createAppExtensionRegistry({ typePolicy }),
    [typePolicy],
  );
  const adapter = useMemo(() => registry.adapter, [registry]);
  const summary = useMemo(
    () => ({
      nodes: graph.nodes.length,
      ports: graph.nodes.reduce((count, node) => count + node.ports.length, 0),
      edges: graph.edges.length,
    }),
    [graph],
  );

  return (
    <main className="flex flex-row w-full h-screen bg-background text-foreground">
      <Flex className="max-w-70 sm:max-w-75 md:max-w-80">
        <section className="flex size-full">
          <SideBar
            theme={themeControl}
            registry={registry}
            typePolicy={typePolicy}
            setGraph={setGraph}
            setTypePolicy={setTypePolicy}
          ></SideBar>
        </section>
      </Flex>
      <Flex>
        <section className="size-full">
          <NodeCanvas
            colorMode={colorMode}
            graph={graph}
            onGraphChange={setGraph}
            adapter={adapter}
            createEdgeData={() => ({ createdBy: "user" as const })}
            createEdgeId={({
              sourceNodeId,
              sourcePortId,
              targetNodeId,
              targetPortId,
            }) =>
              `${sourceNodeId}:${sourcePortId}->${targetNodeId}:${targetPortId}` as CanvasEdgeId
            }
            onConnectionValidation={({ mode }) => setLastConnectionMode(mode)}
            minZoom={0.25}
            maxZoom={2}
          />
        </section>
      </Flex>
    </main>
  );
}
