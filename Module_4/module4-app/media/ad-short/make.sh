#!/bin/sh
# 12-second loop cut of ../ad/seatsync-ad.mp4 (1080x1080, 60fps, song at 90 BPM: 1 beat = 40 frames).
#   0.00- 0.67  end card held (loop point; same frame as the last frame)   1 beat
#   0.67- 5.33  hook        <- source 0.333-5.000  (frames 20-299)          7 beats
#   5.33- 8.67  app         <- source 16.333-19.667 (frames 980-1179)       5 beats
#   8.67-12.00  closing     <- source 39.000-42.333 (frames 2340-2539)      5 beats
# Every source segment starts on the source beat grid, so in-scene hits stay on the beat.
cd "$(dirname "$0")"
FF=/c/Users/dipernam/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.2-full_build/bin/ffmpeg.exe
A=../ad/audio
F="aformat=sample_rates=48000:channel_layouts=stereo"
v="[0:v]split=4[s0][s1][s2][s3];"
v="$v[s0]trim=start_frame=2539:end_frame=2540,setpts=N/(60*TB),loop=loop=39:size=1:start=0,setpts=N/(60*TB)[card];"
v="$v[s1]trim=start_frame=20:end_frame=300,setpts=N/(60*TB)[hook];"
v="$v[s2]trim=start_frame=980:end_frame=1180,setpts=N/(60*TB)[app];"
v="$v[s3]trim=start_frame=2340:end_frame=2540,setpts=N/(60*TB)[close];"
v="$v[card][hook][app][close]concat=n=4:v=1:a=0,fps=60[v];"
# Sound: song bed from its downbeat (same entry point the full ad uses), hook buzzes + boing shifted by +0.333s.
a="[1:a]$F,atrim=start=75.367:duration=12,asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st=11.85:d=0.15,volume=0.85[mus];"
a="$a[2:a]$F,atrim=0:0.45,afade=t=out:st=0.3:d=0.15,volume=0.8,asplit=5[b0][b1][b2][b3][b4];"
i=0; for ms in 1183 1883 2583 3283 3983; do a="$a[b$i]adelay=$ms|$ms[z$i];"; i=$((i+1)); done
a="$a[3:a]$F,adelay=5183|5183,volume=1.0[boing];"
a="$a[mus][z0][z1][z2][z3][z4][boing]amix=inputs=7:normalize=0:duration=first,atrim=0:12,loudnorm=I=-16:TP=-1.5,aresample=48000[a]"
$FF -v error -y -i ../ad/seatsync-ad.mp4 -i $A/cand_swing.mp3 -i $A/buzz.mp3 -i $A/boing.mp3 \
  -filter_complex "$v$a" -map "[v]" -map "[a]" -t 12 \
  -c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart seatsync-ad-short.mp4
