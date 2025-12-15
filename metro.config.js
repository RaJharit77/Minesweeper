const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts = [
    ...config.resolver.assetExts,
    'mp3',
    'wav',
    'ogg',
    'm4a',
    'caf'
];

config.resolver.sourceExts = [
    ...config.resolver.sourceExts,
    'js',
    'jsx',
    'ts',
    'tsx',
    'json'
];

module.exports = config;