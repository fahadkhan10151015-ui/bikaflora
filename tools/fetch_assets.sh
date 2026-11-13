#!/usr/bin/env bash
# Runs on GitHub's servers (see .github/workflows/fetch-assets.yml).
# Downloads the full-HD clips used for the hero "how it's made" video.
set -u
OUT=_incoming/clips; mkdir -p $OUT
for id in 4621364 4621365 4621368 4621366 4621360 4621356 4621370 4621362; do
  for q in hd_1920_1080_25fps hd_1920_1080_24fps hd_1920_1080_30fps uhd_2560_1440_25fps hd_1280_720_25fps; do
    url="https://videos.pexels.com/video-files/$id/$id-$q.mp4"
    if curl -sfL --max-time 120 "$url" -o /tmp/v.mp4; then
      ffmpeg -loglevel error -y -i /tmp/v.mp4 -an -vf "scale=1920:-2" -c:v libx264 -preset veryfast -crf 14 "$OUT/$id.mp4"
      echo "$id $q" >> $OUT/list.txt; break
    fi
  done
done
cat $OUT/list.txt; du -sh $OUT
