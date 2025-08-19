import React, { forwardRef, useImperativeHandle, useState } from "react";

export type PortalItemHandle = {
  update: (node: React.ReactNode) => void;
};

export const PortalItem = forwardRef<
  PortalItemHandle,
  { initial: React.ReactNode }
>(({ initial }, ref) => {
  const [node, setNode] = useState<React.ReactNode>(initial);

  useImperativeHandle(ref, () => ({
    update: (next: React.ReactNode) => setNode(next),
  }));

  return <>{node}</>;
});

PortalItem.displayName = "PortalItem";
