import { ConnectionValidationMode } from "../../types/validation";
import { IO, NodeType } from "../../shared/types";

export type PortPolicies = {
  canAdd: boolean;
  canEdit: boolean;
};

export type NodePolicies = {
  canEditlabel: boolean;
  canEditPorts: boolean;
};

export type ValidationPolicies = {
  mode: ConnectionValidationMode;
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
  label: string;
  allowMulti: boolean;
};

export type PortDataInput = {
  id: string;
  label: string;
  allowMulti?: boolean;
};

export type NodeDef = {
  id: string;
  label: string;
  ports: Partial<Record<IO, PortData[]>>;
};

export type NodeDefInput = {
  id: string;
  label: string;
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
  nodes?: Partial<Record<NodeType, NodeDef[]>>;
  policies?: Policies;
};
