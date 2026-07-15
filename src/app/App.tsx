import { useMemo, useState } from "react";
import { useTheme } from "@heroui/react";
import { ColorMode } from "@xyflow/react";
import { SideBar } from "./components/SideBar";
import { Flex } from "./components/templates/Flex";
import { ThemeControl } from "@/lib/types";
import { CanvasGraph } from "../../packages/core/src/features/canvas/canvas";
import { EditorState } from "../../packages/core/src/features/editor/editor";
import {
  addNodeById,
  createEdgeData,
  createEdgeId,
  createGraph,
  initEditor,
} from "./operation";
import { getMode } from "../../packages/core/src/features/mode/mode";
import { NodeCanvas } from "./components/NodeCanvas";
import { nodeTypes } from "../../packages/core/src/shared/types";

export function App(): React.JSX.Element {
  const [currentGraph, setGraph] = useState<CanvasGraph>(createGraph);
  const [currentEditor, setEditor] = useState<EditorState>(initEditor);
  const currentModeId = currentEditor.mode;
  const currentMode = useMemo(() => getMode(currentModeId), [currentModeId]);
  const modePorts = currentMode.ports;
  const modeNodes = currentMode.nodes;

  const { resolvedTheme, setTheme, theme } = useTheme();
  const colorMode: ColorMode = resolvedTheme === "dark" ? "dark" : "light";
  const isDarkTheme = resolvedTheme === "dark";
  const themeControl: ThemeControl = { isDarkTheme, setTheme };

  const summary = useMemo(
    () => ({
      nodes: currentGraph.nodes.length,
      ports: currentGraph.nodes.reduce(
        (count, node) => count + node.data.ports.length,
        0,
      ),
      edges: currentGraph.edges.length,
    }),
    [currentGraph],
  );

  const defaultNodeTypes = {};

  return (
    <main className="w-full h-screen">
      <div className="flex flex-row w-full h-screen bg-background text-foreground">
        <Flex className="max-w-70 sm:max-w-75 md:max-w-80">
          <section className="flex size-full">
            <SideBar
              theme={themeControl}
              nodeDefs={modeNodes}
              addNodeById={addNodeById}
            ></SideBar>
          </section>
        </Flex>
        <Flex>
          <section className="size-full">
            <NodeCanvas
              graph={currentGraph}
              nodeTypes={defaultNodeTypes}
              onGraphChange={setGraph}
              createEdgeData={createEdgeData}
              createEdgeId={createEdgeId}
            />
          </section>
        </Flex>
      </div>
    </main>
  );
}
