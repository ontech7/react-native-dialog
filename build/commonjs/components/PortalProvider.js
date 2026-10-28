"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalStackContext = exports.PortalContext = void 0;
exports.PortalProvider = PortalProvider;
const react_1 = __importStar(require("react"));
const PortalItem_1 = require("./PortalItem");
// `null` means "no host above": the root `DialogProvider` creates one.
exports.PortalContext = (0, react_1.createContext)(null);
function createModalStack() {
    let ids = [];
    const listeners = new Set();
    const notify = () => listeners.forEach((listener) => listener());
    return {
        push: (id) => {
            ids = [...ids.filter((e) => e !== id), id];
            notify();
        },
        remove: (id) => {
            ids = ids.filter((e) => e !== id);
            notify();
        },
        subscribe: (listener) => {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
        indexOf: (id) => ids.indexOf(id),
        isTop: (id) => ids[ids.length - 1] === id,
    };
}
// A store rather than state: dialogs read their own position with
// `useSyncExternalStore`, so opening one doesn't re-render all the others.
exports.ModalStackContext = (0, react_1.createContext)(null);
let NEXT_ID = 0;
const genId = () => String(++NEXT_ID);
function PortalProvider({ children }) {
    const [entries, setEntries] = (0, react_1.useState)([]);
    const parentStack = (0, react_1.useContext)(exports.ModalStackContext);
    const ownStack = (0, react_1.useRef)(null);
    if (!parentStack && !ownStack.current) {
        ownStack.current = createModalStack();
    }
    const modalStack = parentStack ?? ownStack.current;
    const itemRefs = (0, react_1.useRef)(new Map());
    const addPortal = (0, react_1.useCallback)((node) => {
        const id = genId();
        setEntries((prev) => [...prev, { id, initial: node }]);
        return id;
    }, []);
    const updatePortal = (0, react_1.useCallback)((id, node) => {
        const ref = itemRefs.current.get(id);
        ref?.current?.update(node);
    }, []);
    const removePortal = (0, react_1.useCallback)((id) => {
        setEntries((prev) => prev.filter((e) => e.id !== id));
        itemRefs.current.delete(id);
    }, []);
    const ctx = (0, react_1.useMemo)(() => ({ addPortal, updatePortal, removePortal }), [addPortal, updatePortal, removePortal]);
    return (react_1.default.createElement(exports.PortalContext.Provider, { value: ctx },
        react_1.default.createElement(exports.ModalStackContext.Provider, { value: modalStack },
            children,
            entries.map(({ id, initial }) => {
                let ref = itemRefs.current.get(id);
                if (!ref) {
                    ref = react_1.default.createRef();
                    itemRefs.current.set(id, ref);
                }
                return react_1.default.createElement(PortalItem_1.PortalItem, { key: id, ref: ref, initial: initial });
            }))));
}
