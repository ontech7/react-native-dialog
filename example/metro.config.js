// Resolve the library from its source (../src) so edits show up without a
// rebuild, while react / react-native always come from this app: the library's
// own node_modules (dev dependencies) must never be bundled.
const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const libraryRoot = path.resolve(projectRoot, "..");
const escape = (p) => p.replace(/[/\\^$*+?.()|[\]{}]/g, "\\$&");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [libraryRoot];
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, "node_modules")];
config.resolver.blockList = [
  new RegExp(`^${escape(path.join(libraryRoot, "node_modules"))}\\/.*$`),
];

const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "@ontech7/react-native-dialog") {
    return {
      type: "sourceFile",
      filePath: path.join(libraryRoot, "src", "index.ts"),
    };
  }
  return (defaultResolveRequest ?? context.resolveRequest)(
    context,
    moduleName,
    platform
  );
};

module.exports = config;
