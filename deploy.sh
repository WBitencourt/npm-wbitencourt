#!/bin/bash

npm run build

git add .

git commit -m "build: building workspace"

npm version patch

git commit -m "deploy: update version to $npm_package_version"

git push

cd packages/cli

npm publish --access public