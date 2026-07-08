import { ValidationLevel } from "../../types/validation";
import { NodeType } from "../../types/graph";
import { IO } from "../../types/primitives";

export type PortPolicies = {
  canAdd: boolean;
  canEdit: boolean;
};

export type NodePolicies = {
  canEditName: boolean;
  canEditPorts: boolean;
};

export type ValidationPolicies = {
  level: ValidationLevel;
  canChangeLevel: boolean;
};

export type Policies = {
  port: PortPolicies;
  node: NodePolicies;
  validation: ValidationPolicies;
};

export type PortDef = {
  id: string;
  allowLinkTo: string[];
};

export type PortDefInput = {
  id: string;
  allowLinkTo?: string[];
};

export type PortData = {
  id: string;
  name: string;
  allowMulti: boolean;
};

export type PortDataInput = {
  id: string;
  name: string;
  allowMulti?: boolean;
};

export type NodeDef = {
  id: string;
  name: string;
  ports: Partial<Record<IO, PortData[]>>;
};

export type NodeDefInput = {
  id: string;
  name: string;
  ports: Partial<Record<IO, PortDataInput[]>>;
};

export type ModeDef = {
  id: string;
  version: string;
  title: string;
  desc: string;
  ports: PortDef[];
  nodes: Partial<Record<NodeType, NodeDef[]>>;
  policies: Policies;
};

export type ModeDefInput = {
  id: string;
  version: string;
  title: string;
  desc?: string;
  ports?: PortDef[];
  nodes?: Partial<Record<NodeType, NodeDefInput[]>>;
  policies?: Policies;
};
