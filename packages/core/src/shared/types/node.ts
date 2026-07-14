export const nodeTypes = ["processor", "source", "sink", "annotation"] as const;

export type NodeType = (typeof nodeTypes)[number];
