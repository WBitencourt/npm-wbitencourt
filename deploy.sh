#!/bin/bash

npm run build

git add .

git commit -m "build: building workspace"

npm version patch -w wbitencourt

npm version patch -w @wbitencourt/util

git add .

git commit -m "deploy: update version to $npm_package_version"

git push

npm publish --access public -w wbitencourt

npm publish --access public -w @wbitencourt/util
