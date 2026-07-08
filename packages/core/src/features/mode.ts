import { ModeDef } from "../types/mode";

const modesJson: string[] = await fetch("../../../modes/index.json").then((r) =>
  r.json(),
);

export const mode = await Promise.all(
  modesJson.map((mode) =>
    fetch(`../../../modes/${mode}`).then((r) => r.json() as unknown as ModeDef),
  ),
);
