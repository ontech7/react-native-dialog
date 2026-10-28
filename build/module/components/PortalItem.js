import React, { forwardRef, useImperativeHandle, useState } from "react";
export const PortalItem = forwardRef(({ initial }, ref) => {
    const [node, setNode] = useState(initial);
    useImperativeHandle(ref, () => ({
        update: (next) => setNode(next),
    }));
    return React.createElement(React.Fragment, null, node);
});
PortalItem.displayName = "PortalItem";
