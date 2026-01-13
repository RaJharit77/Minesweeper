const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname, {
    isCSSEnabled: true,
});

const configWithNativeWind = withNativeWind(config, {
    input: './style/global.css',
    inlineRem: 16,
    unstable_cssModules: {
        targets: ['nativewind'],
    },
});

configWithNativeWind.resolver.assetExts = [
    ...configWithNativeWind.resolver.assetExts.filter(ext => ext !== 'svg'),
    'mp3',
    'wav',
    'ogg',
    'm4a',
    'caf',
    'mp4',
    'm4v',
    'mov',
    'avi',
];

configWithNativeWind.resolver.sourceExts = [
    ...configWithNativeWind.resolver.sourceExts.filter(ext => ext !== 'svg'),
    'svg',
];

module.exports = configWithNativeWind;