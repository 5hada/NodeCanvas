import { createModeDef } from "./defaults";
import { ModeDefInput } from "./types";

// const generalModePath = "../../../modes/general/manifest.json";

// export const generalMode = await fetch(`${generalModePath}`).then(
//   (r) => r.json() as unknown as ModeDef,
// );

export const generalMode = createModeDef({
  id: "general",
  version: "1.0.0",
  title: "General",
});

const modesJson: string[] = await fetch("../../../modes/index.json").then((r) =>
  r.json(),
);

export const modes = new Map(
  (
    await Promise.all(
      modesJson.map((mode) =>
        fetch(`../../../modes/${mode}`).then(
          (r) => r.json() as unknown as ModeDefInput,
        ),
      ),
    )
  ).map((mode) => [mode.id, createModeDef(mode)]),
).set("general", generalMode);

export const modeIds = ["general", ...modes.keys()];

export function getMode(modeId: string) {
  if (!modes.has(modeId)) {
    throw new Error("Unknown mode id");
  } else {
    return modes.get(modeId);
  }
}
