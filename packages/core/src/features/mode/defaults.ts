import * as T from "./types";
import { IOTypes } from "../../types/index";
import { NodeType, nodeTypes } from "../../types/index";

const defaultPortPolicies: T.PortPolicies = {
  canAdd: true,
  canEdit: true,
};

const defaultNodePolicies: T.NodePolicies = {
  canEditName: true,
  canEditPorts: true,
};

const defaultValidationPolicies: T.ValidationPolicies = {
  level: "info",
  canChangeLevel: true,
};

export const defaultPolicies: T.Policies = {
  port: defaultPortPolicies,
  node: defaultNodePolicies,
  validation: defaultValidationPolicies,
};

const defaultPorts: T.PortDef[] = [
  {
    id: "any",
    allowLinkTo: ["any"],
  },
  {
    id: "none",
    allowLinkTo: [],
  },
];

const defaultNodes: Record<NodeType, T.NodeDef[]> = {
  processor: [
    {
      id: "process",
      name: "Process",
      ports: {
        in: [{ id: "any", name: "Any", allowMulti: true }],
        out: [{ id: "any", name: "Any", allowMulti: true }],
      },
    },
  ],
  source: [
    {
      id: "source",
      name: "Source",
      ports: {
        out: [{ id: "any", name: "any", allowMulti: true }],
      },
    },
  ],
  sink: [
    {
      id: "sink",
      name: "Sink",
      ports: {
        in: [{ id: "any", name: "any", allowMulti: true }],
      },
    },
  ],
};

const defaultPortDataProps: Pick<T.PortData, "allowMulti"> = {
  allowMulti: true,
};

export function createModeDef(mode: T.ModeDefInput): T.ModeDef {
  return {
    id: mode.id,
    version: mode.version,
    title: mode.title,
    desc: mode.desc ? mode.desc : "",
    ports: mode.ports
      ? [
          ...defaultPorts,
          ...mode.ports.map((port) => ({
            id: port.id,
            allowLinkTo: port.allowLinkTo ? port.allowLinkTo : [port.id, "any"],
          })),
        ]
      : defaultPorts,
    nodes: mode.nodes
      ? Object.fromEntries(
          nodeTypes.map((nodeType) => [
            nodeType,
            mode.nodes?.[nodeType]?.map((node) => ({
              id: node.id,
              name: node.name,
              ports: Object.fromEntries(
                IOTypes.map((io) => [
                  io,
                  node.ports?.[io]?.map((port) => ({
                    ...defaultPortDataProps,
                    ...port,
                  })) ?? [],
                ]),
              ),
            })) ?? [],
          ]),
        )
      : defaultNodes,
    policies: mode.policies
      ? {
          port: mode.policies.port
            ? { ...defaultPortPolicies, ...mode.policies.port }
            : defaultPortPolicies,
          node: mode.policies.node
            ? { ...defaultNodePolicies, ...mode.policies.node }
            : defaultNodePolicies,
          validation: mode.policies.validation
            ? {
                ...defaultValidationPolicies,
                ...mode.policies.validation,
              }
            : defaultValidationPolicies,
        }
      : defaultPolicies,
  };
}
