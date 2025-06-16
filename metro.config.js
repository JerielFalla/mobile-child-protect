// metro.config.js
const { getDefaultConfig } = require("@expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // ✅ Ensure Metro can resolve .cjs modules
  config.resolver.sourceExts.push("cjs");

  // ✅ Allow resolving CommonJS exports (Firebase compatibility)
  config.resolver.unstable_enablePackageExports = false;

  return config;
})();
