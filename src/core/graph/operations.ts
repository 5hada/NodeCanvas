import type {
  CanvasAnnotation,
  CanvasEdge,
  CanvasGraph,
  CanvasGroup,
  CanvasNode,
  CanvasPort,
  CanvasPortRef,
} from './types'
import type {
  CanvasAnnotationId,
  CanvasEdgeId,
  CanvasGroupId,
  CanvasNodeId,
  Point,
  Size,
} from '../primitives'

type EditableGraph = CanvasGraph<
  unknown,
  unknown,
  unknown,
  unknown,
  unknown,
  unknown
>

type GraphNode<TGraph extends EditableGraph> = TGraph['nodes'][number]
type GraphPort<TGraph extends EditableGraph> = GraphNode<TGraph>['ports'][number]
type GraphEdge<TGraph extends EditableGraph> = TGraph['edges'][number]
type GraphGroup<TGraph extends EditableGraph> = TGraph['groups'][number]
type GraphAnnotation<TGraph extends EditableGraph> =
  TGraph['annotations'][number]

export type EntityUpdate<TEntity> = Partial<TEntity> | ((entity: TEntity) => TEntity)

export function findNode<TGraph extends EditableGraph>(
  graph: TGraph,
  nodeId: CanvasNodeId,
): GraphNode<TGraph> | undefined {
  return graph.nodes.find((node) => node.id === nodeId)
}

export function findPort<TGraph extends EditableGraph>(
  graph: TGraph,
  ref: CanvasPortRef,
): GraphPort<TGraph> | undefined {
  return findNode(graph, ref.nodeId)?.ports.find((port) => port.id === ref.portId)
}

export function findEdge<TGraph extends EditableGraph>(
  graph: TGraph,
  edgeId: CanvasEdgeId,
): GraphEdge<TGraph> | undefined {
  return graph.edges.find((edge) => edge.id === edgeId)
}

export function hasNode<TGraph extends EditableGraph>(
  graph: TGraph,
  nodeId: CanvasNodeId,
): boolean {
  return findNode(graph, nodeId) !== undefined
}

export function hasPort<TGraph extends EditableGraph>(
  graph: TGraph,
  ref: CanvasPortRef,
): boolean {
  return findPort(graph, ref) !== undefined
}

export function getConnectedEdges<TGraph extends EditableGraph>(
  graph: TGraph,
  ref: CanvasPortRef,
): GraphEdge<TGraph>[] {
  return graph.edges.filter(
    (edge) => samePortRef(edge.from, ref) || samePortRef(edge.to, ref),
  )
}

export function addNode<TGraph extends EditableGraph>(
  graph: TGraph,
  node: GraphNode<TGraph>,
): TGraph {
  assertMissingNode(graph, node.id)
  return {
    ...graph,
    nodes: [...graph.nodes, node],
  }
}

export function updateNode<TGraph extends EditableGraph>(
  graph: TGraph,
  nodeId: CanvasNodeId,
  update: EntityUpdate<GraphNode<TGraph>>,
): TGraph {
  assertExistingNode(graph, nodeId)
  return {
    ...graph,
    nodes: graph.nodes.map((node) =>
      node.id === nodeId ? applyUpdate(node, update) : node,
    ),
  }
}

export function moveNode<TGraph extends EditableGraph>(
  graph: TGraph,
  nodeId: CanvasNodeId,
  position: Point,
): TGraph {
  return updateNode(graph, nodeId, { position } as Partial<GraphNode<TGraph>>)
}

export function resizeNode<TGraph extends EditableGraph>(
  graph: TGraph,
  nodeId: CanvasNodeId,
  size: Size,
): TGraph {
  return updateNode(graph, nodeId, { size } as Partial<GraphNode<TGraph>>)
}

export function removeNode<TGraph extends EditableGraph>(
  graph: TGraph,
  nodeId: CanvasNodeId,
): TGraph {
  assertExistingNode(graph, nodeId)
  return {
    ...graph,
    nodes: graph.nodes.filter((node) => node.id !== nodeId),
    edges: graph.edges.filter(
      (edge) => edge.from.nodeId !== nodeId && edge.to.nodeId !== nodeId,
    ),
    groups: graph.groups.map((group) => ({
      ...group,
      nodeIds: group.nodeIds.filter((id) => id !== nodeId),
    })),
  }
}

export function addPort<TGraph extends EditableGraph>(
  graph: TGraph,
  nodeId: CanvasNodeId,
  port: GraphPort<TGraph>,
): TGraph {
  const node = assertExistingNode(graph, nodeId)
  if (node.ports.some((existingPort) => existingPort.id === port.id)) {
    throw new Error(`Port already exists on node: ${String(port.id)}`)
  }

  return updateNode(graph, nodeId, {
    ports: [...node.ports, port],
  } as Partial<GraphNode<TGraph>>)
}

export function updatePort<TGraph extends EditableGraph>(
  graph: TGraph,
  ref: CanvasPortRef,
  update: EntityUpdate<GraphPort<TGraph>>,
): TGraph {
  const node = assertExistingNode(graph, ref.nodeId)
  if (!node.ports.some((port) => port.id === ref.portId)) {
    throw new Error(`Port does not exist: ${String(ref.portId)}`)
  }

  return updateNode(graph, ref.nodeId, {
    ports: node.ports.map((port) =>
      port.id === ref.portId ? applyUpdate(port, update) : port,
    ),
  } as Partial<GraphNode<TGraph>>)
}

export function removePort<TGraph extends EditableGraph>(
  graph: TGraph,
  ref: CanvasPortRef,
): TGraph {
  const node = assertExistingNode(graph, ref.nodeId)
  if (!node.ports.some((port) => port.id === ref.portId)) {
    throw new Error(`Port does not exist: ${String(ref.portId)}`)
  }

  return {
    ...updateNode(graph, ref.nodeId, {
      ports: node.ports.filter((port) => port.id !== ref.portId),
    } as Partial<GraphNode<TGraph>>),
    edges: graph.edges.filter(
      (edge) => !samePortRef(edge.from, ref) && !samePortRef(edge.to, ref),
    ),
  }
}

export function addEdge<TGraph extends EditableGraph>(
  graph: TGraph,
  edge: GraphEdge<TGraph>,
): TGraph {
  if (graph.edges.some((existingEdge) => existingEdge.id === edge.id)) {
    throw new Error(`Edge already exists: ${String(edge.id)}`)
  }
  assertExistingPort(graph, edge.from)
  assertExistingPort(graph, edge.to)

  return {
    ...graph,
    edges: [...graph.edges, edge],
  }
}

export function updateEdge<TGraph extends EditableGraph>(
  graph: TGraph,
  edgeId: CanvasEdgeId,
  update: EntityUpdate<GraphEdge<TGraph>>,
): TGraph {
  if (!graph.edges.some((edge) => edge.id === edgeId)) {
    throw new Error(`Edge does not exist: ${String(edgeId)}`)
  }

  const nextEdges = graph.edges.map((edge) =>
    edge.id === edgeId ? applyUpdate(edge, update) : edge,
  )
  nextEdges.forEach((edge) => {
    assertExistingPort(graph, edge.from)
    assertExistingPort(graph, edge.to)
  })

  return {
    ...graph,
    edges: nextEdges,
  }
}

export function removeEdge<TGraph extends EditableGraph>(
  graph: TGraph,
  edgeId: CanvasEdgeId,
): TGraph {
  if (!graph.edges.some((edge) => edge.id === edgeId)) {
    throw new Error(`Edge does not exist: ${String(edgeId)}`)
  }

  return {
    ...graph,
    edges: graph.edges.filter((edge) => edge.id !== edgeId),
  }
}

export function addGroup<TGraph extends EditableGraph>(
  graph: TGraph,
  group: GraphGroup<TGraph>,
): TGraph {
  if (graph.groups.some((existingGroup) => existingGroup.id === group.id)) {
    throw new Error(`Group already exists: ${String(group.id)}`)
  }
  group.nodeIds.forEach((nodeId) => assertExistingNode(graph, nodeId))

  return {
    ...graph,
    groups: [...graph.groups, group],
  }
}

export function updateGroup<TGraph extends EditableGraph>(
  graph: TGraph,
  groupId: CanvasGroupId,
  update: EntityUpdate<GraphGroup<TGraph>>,
): TGraph {
  if (!graph.groups.some((group) => group.id === groupId)) {
    throw new Error(`Group does not exist: ${String(groupId)}`)
  }

  const nextGroups = graph.groups.map((group) =>
    group.id === groupId ? applyUpdate(group, update) : group,
  )
  nextGroups.forEach((group) => {
    group.nodeIds.forEach((nodeId) => assertExistingNode(graph, nodeId))
  })

  return {
    ...graph,
    groups: nextGroups,
  }
}

export function removeGroup<TGraph extends EditableGraph>(
  graph: TGraph,
  groupId: CanvasGroupId,
): TGraph {
  if (!graph.groups.some((group) => group.id === groupId)) {
    throw new Error(`Group does not exist: ${String(groupId)}`)
  }

  return {
    ...graph,
    groups: graph.groups.filter((group) => group.id !== groupId),
    nodes: graph.nodes.map((node) =>
      node.parentGroupId === groupId
        ? {
            ...node,
            parentGroupId: undefined,
          }
        : node,
    ),
  }
}

export function addAnnotation<TGraph extends EditableGraph>(
  graph: TGraph,
  annotation: GraphAnnotation<TGraph>,
): TGraph {
  if (
    graph.annotations.some(
      (existingAnnotation) => existingAnnotation.id === annotation.id,
    )
  ) {
    throw new Error(`Annotation already exists: ${String(annotation.id)}`)
  }

  return {
    ...graph,
    annotations: [...graph.annotations, annotation],
  }
}

export function updateAnnotation<TGraph extends EditableGraph>(
  graph: TGraph,
  annotationId: CanvasAnnotationId,
  update: EntityUpdate<GraphAnnotation<TGraph>>,
): TGraph {
  if (!graph.annotations.some((annotation) => annotation.id === annotationId)) {
    throw new Error(`Annotation does not exist: ${String(annotationId)}`)
  }

  return {
    ...graph,
    annotations: graph.annotations.map((annotation) =>
      annotation.id === annotationId
        ? applyUpdate(annotation, update)
        : annotation,
    ),
  }
}

export function removeAnnotation<TGraph extends EditableGraph>(
  graph: TGraph,
  annotationId: CanvasAnnotationId,
): TGraph {
  if (!graph.annotations.some((annotation) => annotation.id === annotationId)) {
    throw new Error(`Annotation does not exist: ${String(annotationId)}`)
  }

  return {
    ...graph,
    annotations: graph.annotations.filter(
      (annotation) => annotation.id !== annotationId,
    ),
  }
}

function applyUpdate<TEntity>(
  entity: TEntity,
  update: EntityUpdate<TEntity>,
): TEntity {
  return typeof update === 'function'
    ? update(entity)
    : {
        ...entity,
        ...update,
      }
}

function assertMissingNode<TGraph extends EditableGraph>(
  graph: TGraph,
  nodeId: CanvasNodeId,
): void {
  if (hasNode(graph, nodeId)) {
    throw new Error(`Node already exists: ${String(nodeId)}`)
  }
}

function assertExistingNode<TGraph extends EditableGraph>(
  graph: TGraph,
  nodeId: CanvasNodeId,
): GraphNode<TGraph> {
  const node = findNode(graph, nodeId)
  if (!node) {
    throw new Error(`Node does not exist: ${String(nodeId)}`)
  }
  return node
}

function assertExistingPort<TGraph extends EditableGraph>(
  graph: TGraph,
  ref: CanvasPortRef,
): void {
  if (!hasPort(graph, ref)) {
    throw new Error(
      `Port does not exist: ${String(ref.nodeId)}:${String(ref.portId)}`,
    )
  }
}

function samePortRef(left: CanvasPortRef, right: CanvasPortRef): boolean {
  return left.nodeId === right.nodeId && left.portId === right.portId
}

export type AnyCanvasNode = CanvasNode<unknown, unknown>
export type AnyCanvasPort = CanvasPort<unknown>
export type AnyCanvasEdge = CanvasEdge<unknown>
export type AnyCanvasGroup = CanvasGroup<unknown>
export type AnyCanvasAnnotation = CanvasAnnotation<unknown>
