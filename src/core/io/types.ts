import type { CanvasDocument } from '../document'

export type DocumentExportFormat = string

export type DocumentExportOptions<TOptionsData = unknown> = {
  format: DocumentExportFormat
  data?: TOptionsData
}

export type DocumentImportResult<TDocument extends CanvasDocument = CanvasDocument> =
  | {
      ok: true
      document: TDocument
      source: string
    }
  | {
      ok: false
      reason: string
      message?: string
      cause?: unknown
    }

export interface DocumentCodec<
  TDocument extends CanvasDocument = CanvasDocument,
  TExportOptionsData = unknown,
> {
  canDecode(file: File): Promise<boolean>
  decode(file: File): Promise<DocumentImportResult<TDocument>>
  encode(
    document: TDocument,
    options: DocumentExportOptions<TExportOptionsData>,
  ): Promise<Blob>
}
