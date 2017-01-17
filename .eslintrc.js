module.exports = {
  "extends": "airbnb",
  "plugins": [
    "react",
    "jsx-a11y",
    "import",
    "react-native"
  ],
  "parser": "babel-eslint",
  "rules": {
    "arrow-body-style": 0,
    "import/prefer-default-export": 0,
    "react/forbid-prop-types": [0, {"forbid": "any"}],
    "react-native/no-unused-styles": 2,
    "react-native/split-platform-components": 2,
    "react-native/no-inline-styles": 2,
    "react-native/no-color-literals": 2,
    "react/jsx-filename-extension": 0,
    "no-unused-vars": ["error", {
      "argsIgnorePattern": "(dispatch|getState|state)"
    }]
  },
  "globals": {
    "__DEV__": true,
    "fetch": true,
    "Headers": true,
    "WebSocket": true
  }
};
