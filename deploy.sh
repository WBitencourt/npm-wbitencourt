#!/bin/bash

npm run build

git add .

git commit -m "build: building workspace"

cd packages/cli

npm version patch

git commit -m "deploy: update version to $npm_package_version"

git push

npm publish --access public

cd ../../