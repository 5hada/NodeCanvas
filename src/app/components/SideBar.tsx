import { useState } from "react";
import { Select, Label, ListBox, Switch } from "@heroui/react";
import { Plus, Gear, Sun, Moon } from "@gravity-ui/icons";
import { DefaultGraph, TypePolicy } from "@nodecanvas/extensions-default";
import { AppExtensionRegistry } from "../extensions/registry";
import { AppNodeKind } from "../domain";
import { addNode } from "@nodecanvas/core";
import { Button, Separator, Card, Flex } from "./templates";
import { ThemeControl } from "@/lib/types";

function Title() {
  return (
    <div className="flex flex-col w-full items-start gap-1 p-2 mb-1">
      <span className="text-2xl">NodeCanvas</span>
      <span className="text-sm">Description</span>
    </div>
  );
}

function Footer({ isDarkTheme, setTheme }: ThemeControl) {
  return (
    <div className="w-full">
      <Separator />
      <div className="flex gap-3 mt-3 pr-1 justify-between">
        <Button variant="ghost" size="icon">
          <Gear />
        </Button>
        <Switch
          className="justify-center"
          isSelected={isDarkTheme}
          onChange={() => setTheme(isDarkTheme ? "light" : "dark")}
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
  );
}

export type SideBarProps = {
  theme: ThemeControl;
  registry: AppExtensionRegistry;
  typePolicy: TypePolicy;
  setGraph: React.Dispatch<React.SetStateAction<DefaultGraph>>;
  setTypePolicy: React.Dispatch<React.SetStateAction<TypePolicy>>;
};

export function SideBar({
  theme,
  registry,
  typePolicy,
  setGraph,
  setTypePolicy,
}: SideBarProps) {
  const [nodeSequence, setNodeSequence] = useState(2);

  function addNodeByKind(kind: AppNodeKind, nodeSequence: number): void {
    const nextSequence = nodeSequence + 1;
    setNodeSequence(nextSequence);
    setGraph((currentGraph) =>
      addNode(
        currentGraph,
        registry.createNode(`${kind}-${nextSequence}`, kind, {
          x: 120 + nextSequence * 36,
          y: 120 + nextSequence * 24,
        }),
      ),
    );
  }
  return (
    <Card className="relative w-full flex flex-col justify-between p-4 gap-4">
      <Flex>
        <Title />
        <Separator />
        <div className="grid gap-4 my-4">
          {registry.nodes.map((nodeDefinition) => (
            <Button
              key={nodeDefinition.kind}
              variant="secondary"
              onClick={() => addNodeByKind(nodeDefinition.kind, nodeSequence)}
            >
              <Plus />
              {nodeDefinition.label}
            </Button>
          ))}
        </div>
        <Separator />
        <div className="pt-3 pb-4">
          <span className="text-[13px]">Options</span>
          <Select
            value={typePolicy}
            fullWidth
            placeholder="Select one"
            onChange={(value) => setTypePolicy(value as TypePolicy)}
          >
            <Label className="text-xs text-gray-500">Connection policy</Label>
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
        </div>
        <Separator />
      </Flex>
      <div className="w-full">
        <Footer isDarkTheme={theme.isDarkTheme} setTheme={theme.setTheme} />
      </div>
    </Card>
  );
}
