import { ValidationLevel } from "./validation";
import { NodeType } from "./graph";
import { IO } from "./primitives";

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
  allowLinkTo?: string[];
};

export type PortData = {
  id: string;
  name: string;
  allowMulti?: boolean;
};

export type NodeDef = {
  id: string;
  name: string;
  type: NodeType;
  ports?: Partial<Record<IO, PortData[]>>;
};

export type ModeDef = {
  id: string;
  version: string;
  title: string;
  desc: string;
  ports: PortDef[];
  nodes: NodeDef[];
  policies: Policies;
};
