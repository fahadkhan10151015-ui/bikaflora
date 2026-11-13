#!/usr/bin/env bash
# Runs on GitHub's servers (see .github/workflows/fetch-assets.yml).
# Makes preview sheets of candidate florist videos (clips from the same shoot have nearby ids).
set -u
OUT=_incoming/videos; mkdir -p $OUT
probe() {
  id=$1
  for q in hd_1280_720_25fps hd_1280_720_24fps hd_1280_720_30fps hd_1366_720_25fps hd_1366_720_24fps sd_960_540_25fps sd_960_540_24fps; do
    url="https://videos.pexels.com/video-files/$id/$id-$q.mp4"
    if curl -sfL --max-time 60 "$url" -o /tmp/$id.mp4; then
      dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 /tmp/$id.mp4)
      ffmpeg -loglevel error -y -i /tmp/$id.mp4 -vf "fps=6/$dur,scale=320:-2,tile=6x1" -frames:v 1 "$OUT/$id.jpg" && echo "$id $q $dur" >> $OUT/list.txt
      rm -f /tmp/$id.mp4; return
    fi
  done
}
export -f probe; export OUT
{ seq 5756270 5756310; seq 4621340 4621380; seq 5564520 5564575; seq 7626700 7626730; seq 8279140 8279165; } | xargs -P 12 -I{} bash -c 'probe {}'
sort -o $OUT/list.txt $OUT/list.txt; wc -l $OUT/list.txt
