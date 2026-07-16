import { Switch, IconChevronLeft, IconChevronRight } from "@heroui/react";
import { Plus, Gear, Sun, Moon } from "@gravity-ui/icons";
import { Button, Separator, Card, Flex } from "./templates";
import { ThemeControl } from "@/lib/types";
import type { NodeDefs } from "../../../packages/core/src/features/mode/types";
import { nodeTypes } from "../../../packages/core/src/shared/types";

export type SideBarState = "Default" | "Closed" | "Mobile" | "Mobile-Closed";

function ClosedSideBar() {
  return (
    <Button variant="secondary" size="icon">
      <IconChevronRight />
    </Button>
  );
}

function Title() {
  return (
    <div className="flex flex-row justify-between">
      <div className="flex flex-col w-full items-start gap-1 py-2 my-1">
        <span className="text-2xl">NodeCanvas</span>
        <span className="text-sm">{"Current"} Mode</span>
      </div>
      <Button variant="ghost" size="icon" className="">
        <IconChevronLeft />
      </Button>
    </div>
  );
}

function Footer({ isDarkTheme, setTheme }: ThemeControl) {
  return (
    <div className="w-full">
      <Separator />
      <div className="flex gap-3 mb-1 pr-1 justify-between">
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
  nodeDefs: NodeDefs;
  addNodeById: (nodeId: string) => void;
};

export function SideBar({ theme, nodeDefs, addNodeById }: SideBarProps) {
  return (
    <Card className="relative w-full flex flex-col justify-between px-4 py-2 gap-4">
      <Flex>
        <Title />
        <Separator />
        <div className="flex flex-col gap-2 pb-4">
          <div>
            <span className="text-xl">Nodes</span>
          </div>
          {nodeTypes.map((nodeType) => (
            <div className="w-full flex flex-col gap-1">
              <span>{nodeType}</span>
              <div key={nodeType}>
                {nodeDefs?.[nodeType]?.map((nodeDef) => (
                  <Button
                    className="w-full"
                    key={nodeDef.label}
                    variant="secondary"
                    onClick={() => addNodeById(nodeDef.id)}
                  >
                    <Plus />
                    {nodeDef.label}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <Separator />
        <div className="pt-3 pb-4">
          <span className="text-[13px]">Options</span>
        </div>
        <Separator />
      </Flex>
      <div className="w-full">
        <Footer isDarkTheme={theme.isDarkTheme} setTheme={theme.setTheme} />
      </div>
    </Card>
  );
}
