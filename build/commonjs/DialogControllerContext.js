"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogControllerContext = void 0;
const react_1 = require("react");
// Lives in its own module so `Dialog` can re-provide it inside the portal
// without importing `useDialog` (which imports `Dialog`).
exports.DialogControllerContext = (0, react_1.createContext)(null);
