#!/bin/bash

cd $(dirname $0)
echo "exports.ip=\"$(ifconfig | grep inet\ | tail -1 | cut -d " " -f 2)\""\; > src/settings-local-ip.js
