export type Brand<TValue, TBrand extends string> = TValue & {
  readonly __brand: TBrand;
};

export type CanvasDocumentId = Brand<string, "CanvasDocumentId">;
export type CanvasGraphId = Brand<string, "CanvasGraphId">;
export type CanvasNodeId = Brand<string, "CanvasNodeId">;
export type CanvasPortId = Brand<string, "CanvasPortId">;
export type CanvasEdgeId = Brand<string, "CanvasEdgeId">;
export type CanvasGroupId = Brand<string, "CanvasGroupId">;
export type CanvasAnnotationId = Brand<string, "CanvasAnnotationId">;

export type IsoDateTime = string;

export type Point = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

export type Rect = Point & Size;

export type JsonPrimitive = string | number | boolean | null;

export type JsonValue =
  | JsonPrimitive
  | JsonValue[]
  | {
      [key: string]: JsonValue;
    };

export type JsonObject = {
  [key: string]: JsonValue;
};
