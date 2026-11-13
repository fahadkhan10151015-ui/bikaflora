#!/usr/bin/env bash
# Runs on GitHub's servers (see .github/workflows/fetch-assets.yml).
# Downloads candidate "moments" photos (free Pexels licence).
set -u
OUT=_incoming/moments; mkdir -p $OUT
for id in 5070334 5331258 18612640 236287 15457219 13978471 19363508 20002701 6532845 5332157 1589830 20253665 6720589 72634 10792771 6578940 5331263; do
  curl -sfL --max-time 60 "https://images.pexels.com/photos/$id/pexels-photo-$id.jpeg?auto=compress&cs=tinysrgb&w=1400" -o $OUT/$id.jpg && echo "$id ok" >> $OUT/list.txt || echo "$id fail" >> $OUT/list.txt
done
cat $OUT/list.txt
