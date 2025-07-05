#!/bin/bash

npm version patch

git add .

git commit -m "deploy: update version to $npm_package_version"

git push

npm publish --access public