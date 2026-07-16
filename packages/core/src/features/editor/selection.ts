import type { SelectableEntity, SelectionState } from "../editor/editor";

export function createEmptySelection(): SelectionState {
  return {
    nodeIds: [],
    edgeIds: [],
    groupIds: [],
  };
}

export function selectOnly(
  selection: SelectionState,
  entity: SelectableEntity,
): SelectionState {
  return addToSelection(createEmptySelection(), entity);
}

export function addToSelection(
  selection: SelectionState,
  entity: SelectableEntity,
): SelectionState {
  switch (entity.kind) {
    case "node":
      return {
        ...selection,
        nodeIds: appendUnique(selection.nodeIds, entity.id),
      };
    case "edge":
      return {
        ...selection,
        edgeIds: appendUnique(selection.edgeIds, entity.id),
      };
    case "group":
      return {
        ...selection,
        groupIds: appendUnique(selection.groupIds, entity.id),
      };
  }
}

export function removeFromSelection(
  selection: SelectionState,
  entity: SelectableEntity,
): SelectionState {
  switch (entity.kind) {
    case "node":
      return {
        ...selection,
        nodeIds: selection.nodeIds.filter((id) => id !== entity.id),
      };
    case "edge":
      return {
        ...selection,
        edgeIds: selection.edgeIds.filter((id) => id !== entity.id),
      };
    case "group":
      return {
        ...selection,
        groupIds: selection.groupIds.filter((id) => id !== entity.id),
      };
  }
}

export function toggleSelection(
  selection: SelectionState,
  entity: SelectableEntity,
): SelectionState {
  return isSelected(selection, entity)
    ? removeFromSelection(selection, entity)
    : addToSelection(selection, entity);
}

export function clearSelection(selection: SelectionState): SelectionState {
  if (
    selection.nodeIds.length === 0 &&
    selection.edgeIds.length === 0 &&
    selection.groupIds.length === 0
  ) {
    return selection;
  }
  return createEmptySelection();
}

export function isSelected(
  selection: SelectionState,
  entity: SelectableEntity,
): boolean {
  switch (entity.kind) {
    case "node":
      return selection.nodeIds.includes(entity.id);
    case "edge":
      return selection.edgeIds.includes(entity.id);
    case "group":
      return selection.groupIds.includes(entity.id);
  }
}

function appendUnique<TValue>(values: TValue[], value: TValue): TValue[] {
  return values.includes(value) ? values : [...values, value];
}
