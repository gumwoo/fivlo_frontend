module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // 제스처 기능을 위해 꼭 필요한 플러그인입니다.
      'react-native-reanimated/plugin',
    ],
  };
};