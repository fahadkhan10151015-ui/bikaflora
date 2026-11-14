#!/usr/bin/env bash
# Runs on GitHub's servers (see .github/workflows/fetch-assets.yml).
# Downloads the Unsplash site photos (free Unsplash licence) so the site can host them itself.
set -u
OUT=_incoming/unsplash; mkdir -p $OUT
for id in 1561729098-cbab0f7a9f7c 1642751652611-bb9a7cad58a3 1567696153798-9111f9cd3d0d 1596422846543-75c6fc197f07 1566914447826-bf04e54bf1be 1762618300114-94ce42f22a53 1572454591674-2739f30d8c40 1620346328449-f8fb90a40ad5 1601884928885-92a922f7962f 1491994336086-44f5d76dd8f2; do
  curl -sfL --max-time 60 "https://images.unsplash.com/photo-$id?auto=format&fit=crop&w=2000&q=90&fm=jpg" -o $OUT/$id.jpg && echo "$id ok" >> $OUT/list.txt || echo "$id fail" >> $OUT/list.txt
done
cat $OUT/list.txt
