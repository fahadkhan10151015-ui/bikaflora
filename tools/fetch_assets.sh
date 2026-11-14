#!/usr/bin/env bash
# Runs on GitHub's servers (see .github/workflows/fetch-assets.yml).
# Downloads candidate "moments" photos (free Pexels licence).
set -u
OUT=_incoming/moments2; mkdir -p $OUT
for id in 5184426 9451121 3690656 9517336 14852776 5729053 12909055 4467334 18658006 2480516 10980619 13901874 36211765 4149006 19524029 5637532; do
  curl -sfL --max-time 60 "https://images.pexels.com/photos/$id/pexels-photo-$id.jpeg?auto=compress&cs=tinysrgb&w=1400" -o $OUT/$id.jpg && echo "$id ok" >> $OUT/list.txt || echo "$id fail" >> $OUT/list.txt
done
cat $OUT/list.txt
