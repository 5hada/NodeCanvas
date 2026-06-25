import type { HistoryState } from './types'

export function createHistory<TSnapshot>(
  present: TSnapshot,
  limit?: number,
): HistoryState<TSnapshot> {
  return {
    past: [],
    present,
    future: [],
    limit,
  }
}

export function pushHistory<TSnapshot>(
  history: HistoryState<TSnapshot>,
  nextPresent: TSnapshot,
): HistoryState<TSnapshot> {
  if (Object.is(history.present, nextPresent)) {
    return history
  }

  const past = [...history.past, history.present]
  return {
    ...history,
    past:
      history.limit !== undefined && past.length > history.limit
        ? past.slice(past.length - history.limit)
        : past,
    present: nextPresent,
    future: [],
  }
}

export function undoHistory<TSnapshot>(
  history: HistoryState<TSnapshot>,
): HistoryState<TSnapshot> {
  if (history.past.length === 0) {
    return history
  }

  const present = history.past[history.past.length - 1] as TSnapshot
  return {
    ...history,
    past: history.past.slice(0, -1),
    present,
    future: [history.present, ...history.future],
  }
}

export function redoHistory<TSnapshot>(
  history: HistoryState<TSnapshot>,
): HistoryState<TSnapshot> {
  if (history.future.length === 0) {
    return history
  }

  const present = history.future[0] as TSnapshot
  const future = history.future.slice(1)
  return {
    ...history,
    past: [...history.past, history.present],
    present,
    future,
  }
}

export function canUndo(history: HistoryState<unknown>): boolean {
  return history.past.length > 0
}

export function canRedo(history: HistoryState<unknown>): boolean {
  return history.future.length > 0
}
