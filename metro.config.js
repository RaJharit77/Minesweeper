const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

const configWithNativeWind = withNativeWind(config, {
    input: './global.css',
    inlineRem: 16
});

configWithNativeWind.resolver.assetExts = [
    ...configWithNativeWind.resolver.assetExts.filter(ext => ext !== 'svg'),
    'mp3',
    'wav',
    'ogg',
    'm4a',
    'caf'
];

configWithNativeWind.resolver.sourceExts = [
    ...configWithNativeWind.resolver.sourceExts,
    'js',
    'jsx',
    'ts',
    'tsx',
    'json'
];

module.exports = configWithNativeWind;