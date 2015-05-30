#!/usr/bin/env bash
dmg="$1"
identity="$2"

echo "### signing dmg"
codesign --force --verify --verbose --sign "${identity}" "${dmg}"

echo "### verifying signature"
codesign -vvv -d "${dmg}"
sudo spctl -a -vvvv "${dmg}"