import { useMemo, useState } from "react";
import {
  Button,
  Label,
  ListBox,
  Select,
  Separator,
  Surface,
  Switch,
  Typography,
  useTheme,
} from "@heroui/react";
import { Gear, Moon, Plus, Sun } from "@gravity-ui/icons";

import { addNode, isSelected, type CanvasEdgeId } from "../core";
import { NodeCanvas } from "../react";
import type { AppGraph, AppNodeKind } from "./domain";
import { composeExtensionAdapters } from "./extensions/types";
import {
  createTypedPortsExtension,
  type TypePolicy,
} from "./extensions/typedPorts";
import { createAppNode, initialGraph, labelForKind } from "./graphFactory";

export function App(): React.JSX.Element {
  const [graph, setGraph] = useState<AppGraph>(initialGraph);
  const [nodeSequence, setNodeSequence] = useState(2);
  const [typePolicy, setTypePolicy] = useState<TypePolicy>("warn");
  const [lastConnectionMode, setLastConnectionMode] = useState("idle");
  const { resolvedTheme, setTheme, theme } = useTheme();
  const activeTheme = theme === "system" ? resolvedTheme : theme;

  const extensions = useMemo(
    () => [createTypedPortsExtension(typePolicy)],
    [typePolicy],
  );
  const adapter = useMemo(
    () => composeExtensionAdapters(extensions),
    [extensions],
  );
  const summary = useMemo(
    () => ({
      nodes: graph.nodes.length,
      ports: graph.nodes.reduce((count, node) => count + node.ports.length, 0),
      edges: graph.edges.length,
    }),
    [graph],
  );

  function addNodeByKind(kind: AppNodeKind): void {
    const nextSequence = nodeSequence + 1;
    setNodeSequence(nextSequence);
    setGraph((currentGraph) =>
      addNode(
        currentGraph,
        createAppNode(`${kind}-${nextSequence}`, labelForKind(kind), kind, {
          x: 120 + nextSequence * 36,
          y: 120 + nextSequence * 24,
        }),
      ),
    );
  }

  return (
    <main
      className="grid grid-cols-[240px_minmax(0,1fr)] h-full min-h-0"
      // className="grid grid-cols-[240px_minmax(0,1fr)] h-full min-h-0
      //           sm:grid-cols-1 xs:grid-rows-[auto_minmax(0,1fr)]"
    >
      <Surface
        className="relative grid content-start gap-4 p-4"
        variant="transparent"
      >
        <Typography type="h5" weight="bold">
          NodeCanvas
        </Typography>
        <div className="grid gap-4">
          <Button
            fullWidth
            variant="secondary"
            onClick={() => addNodeByKind("source")}
          >
            <Plus />
            Source
          </Button>
          <Button
            fullWidth
            variant="secondary"
            onClick={() => addNodeByKind("text-source")}
          >
            <Plus />
            Text
          </Button>
          <Button
            fullWidth
            variant="secondary"
            onClick={() => addNodeByKind("processor")}
          >
            <Plus />
            Processor
          </Button>
          <Button
            fullWidth
            variant="secondary"
            onClick={() => addNodeByKind("sink")}
          >
            <Plus />
            Sink
          </Button>
        </div>
        <Separator className="mt-1" />
        <Typography type="body-sm" weight="semibold" className="text-[13px]">
          Extensions
        </Typography>
        <Select
          value={typePolicy}
          fullWidth
          placeholder="Select one"
          onChange={(value) => setTypePolicy(value as TypePolicy)}
        >
          <Label className="text-xs text-gray-500">Typed ports</Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              <ListBox.Item id="warn" textValue="Warn">
                Warn
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="block" textValue="Block">
                Block
                <ListBox.ItemIndicator />
              </ListBox.Item>
            </ListBox>
          </Select.Popover>
        </Select>
        <Separator className="my-4" />
        {/* <dl className="stats">
          <div>
            <dt>Nodes</dt>
            <dd>{summary.nodes}</dd>
          </div>
          <div>
            <dt>Ports</dt>
            <dd>{summary.ports}</dd>
          </div>
          <div>
            <dt>Edges</dt>
            <dd>{summary.edges}</dd>
          </div>
          <div>
            <dt>Connection</dt>
            <dd>{lastConnectionMode}</dd>
          </div>
        </dl> */}
        <div className="flex">
          <div className="absolute flex-col-2 bottom-0">
            <Separator className="mb-4" />
            <div className="flex gap-3 mb-4">
              <Button variant="tertiary" isIconOnly>
                <Gear />
              </Button>
              <Switch
                className="right-0"
                aria-label="Enable notifications"
                onChange={() =>
                  setTheme(activeTheme == "light" ? "dark" : "light")
                }
              >
                {({ isSelected }) => (
                  <Switch.Content>
                    <Switch.Control>
                      <Switch.Thumb>
                        <Switch.Icon>
                          {isSelected ? (
                            <Sun className="size-3 text-inherit opacity-100" />
                          ) : (
                            <Moon className="size-3 text-inherit opacity-70" />
                          )}
                        </Switch.Icon>
                      </Switch.Thumb>
                    </Switch.Control>
                  </Switch.Content>
                )}
              </Switch>
            </div>
          </div>
        </div>
      </Surface>
      <section className="min-h-0">
        <NodeCanvas
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
    </main>
  );
}
