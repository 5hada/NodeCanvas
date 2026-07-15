import * as T from "./types";
import { IOTypes, NodeType, nodeTypes } from "../../shared/types";

const defaultPortPolicies: T.PortPolicies = {
  canAdd: true,
  canEdit: true,
};

const defaultNodePolicies: T.NodePolicies = {
  canEditlabel: true,
  canEditPorts: true,
};

const defaultValidationPolicies: T.ValidationPolicies = {
  mode: "info",
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
      label: "Process",
      ports: {
        in: [{ id: "any", label: "Any", allowMulti: true }],
        out: [{ id: "any", label: "Any", allowMulti: true }],
      },
    },
  ],
  source: [
    {
      id: "source",
      label: "Source",
      ports: {
        out: [{ id: "any", label: "any", allowMulti: true }],
      },
    },
  ],
  sink: [
    {
      id: "sink",
      label: "Sink",
      ports: {
        in: [{ id: "any", label: "any", allowMulti: true }],
      },
    },
  ],
  annotation: [
    {
      id: "annotation",
      label: "annotation",
      ports: {},
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
              label: node.label,
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
