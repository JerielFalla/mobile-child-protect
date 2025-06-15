// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Enable resolution of .cjs modules
config.resolver.sourceExts.push("cjs");

// Disable enforcing package.json exports (needed for Firebase)
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
