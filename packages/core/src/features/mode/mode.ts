import { createModeDef } from "./defaults";
import { ModeDef, ModeDefInput } from "./types";
import modeIndex from "../../../../modes/index.json";

const modeModules = import.meta.glob<ModeDefInput>("../../../../modes/*.json", {
  eager: true,
  import: "default",
});

export const generalMode = createModeDef({
  id: "general",
  version: "1.0.0",
  title: "General",
});

const indexedModes = modeIndex.map((fileName) => {
  const path = `../../../../modes/${fileName}`;
  const mode = modeModules[path];

  if (!mode) {
    throw new Error(`Mode listed in index.json was not found: ${fileName}`);
  }

  return mode;
});

export const modes = new Map(
  indexedModes.map((mode) => [mode.id, createModeDef(mode)]),
).set("general", generalMode);

export const modeIds = ["general", ...modes.keys()];

export function getMode(modeId: string): ModeDef {
  if (!modes.has(modeId)) {
    throw new Error("Unknown mode id");
  } else {
    return modes.get(modeId) as ModeDef;
  }
}
