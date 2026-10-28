"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Portal = Portal;
const react_1 = require("react");
const PortalProvider_1 = require("./PortalProvider");
function Portal({ children }) {
    const host = (0, react_1.useContext)(PortalProvider_1.PortalContext);
    const idRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (!host) {
            if (__DEV__) {
                console.warn("[react-native-dialog] <Dialog> must be rendered inside a <DialogProvider>; nothing will be shown.");
            }
            return;
        }
        idRef.current = host.addPortal(children);
        return () => {
            if (idRef.current)
                host.removePortal(idRef.current);
        };
    }, []);
    (0, react_1.useEffect)(() => {
        if (idRef.current)
            host?.updatePortal(idRef.current, children);
    }, [children, host]);
    return null;
}
