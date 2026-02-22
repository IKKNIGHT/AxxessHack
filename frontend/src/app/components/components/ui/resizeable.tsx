"use client";

import * as React from "react";
import { GripVerticalIcon } from "lucide-react";

import { cn } from "./utils";

// Stub components - react-resizable-panels has a different API
function ResizablePanelGroup({
  className,
  children,
  ...props
}: any) {
  return (
    <div
      data-slot="resizable-panel-group"
      className={cn("flex h-full w-full", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function ResizablePanel({
  children,
  ...props
}: any) {
  return (
    <div data-slot="resizable-panel" {...props}>
      {children}
    </div>
  );
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: any) {
  return (
    <div
      data-slot="resizable-handle"
      className={cn("bg-border relative w-px", className)}
      {...props}
    >
      {withHandle && (
        <div className="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border">
          <GripVerticalIcon className="size-2.5" />
        </div>
      )}
    </div>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
