#!/usr/bin/env bash
# Runs on GitHub's servers (see .github/workflows/fetch-assets.yml).
# Downloads the Grab store data + product photos and previews of candidate videos into _incoming/.
set -u
OUT=_incoming; mkdir -p $OUT/grab $OUT/videos
curl -sL "https://mart.grab.com/my/en/merchant/bika-flora-pangsapuri-lagoon-perdana/1-C8CGEE5UE4KJG6" -o $OUT/grab/page.html
python3 tools/parse_grab.py
rm -f $OUT/grab/page.html
for id in 4621358 4621364 6649769 5564563 5564530 5756290 7626714 8279152 5399641 4269125 9737877 4621359; do
  for q in hd_1920_1080_25fps hd_1920_1080_24fps hd_1920_1080_30fps uhd_2560_1440_25fps uhd_2560_1440_24fps hd_1280_720_25fps hd_1280_720_24fps hd_1280_720_30fps; do
    url="https://videos.pexels.com/video-files/$id/$id-$q.mp4"
    if curl -sfL -r 0-0 -o /dev/null "$url"; then
      curl -sL "$url" -o /tmp/v.mp4
      dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 /tmp/v.mp4)
      ffmpeg -loglevel error -y -i /tmp/v.mp4 -vf "fps=6/$dur,scale=480:-2,tile=3x2" -frames:v 1 "$OUT/videos/$id.jpg"
      echo "$id $q $dur" >> $OUT/videos/list.txt
      mkdir -p $OUT/videos/full && cp /tmp/v.mp4 "$OUT/videos/full/$id.mp4"
      break
    fi
  done
done
ls -la $OUT/grab | head; cat $OUT/videos/list.txt
