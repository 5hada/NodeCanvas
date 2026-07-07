import { Card, CardContent, CardHeader, Separator } from "@heroui/react";
import { CanvasNode } from "@nodecanvas/core";
import { Handle, Position } from "@xyflow/react";

export function DefaultCanvasNode<TNode>(
  annotation: CanvasNode<TNode>,
  selected: boolean,
) {
  return (
    <Card
      className="min-h-16 min-w-30 flex-col gap-3 overflow-hidden border border-default-200 p-4 text-xs"
      variant="secondary"
      data-selected={selected ? "true" : "false"}
    >
      <Handle type="target" position={Position.Left} />

      <CardHeader className="flex justify-between">
        <Card.Title>{annotation.id}</Card.Title>
        <Card.Description>Test Description</Card.Description>
      </CardHeader>
      <CardContent>
        <Separator className="w-full mt-1"></Separator>
        <span>
          Example description contents contents contents contentscontents
        </span>
      </CardContent>

      <Handle type="source" position={Position.Right} />
    </Card>
  );
}
