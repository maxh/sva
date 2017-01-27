#/bin/bash
set -e

cd "$(dirname "$0")"
react-native bundle --platform ios --dev false --entry-file index.ios.js --bundle-output ios/main.jsbundle
./node_modules/.bin/esvalidate --formatter=sublime.js ios/main.jsbundle
