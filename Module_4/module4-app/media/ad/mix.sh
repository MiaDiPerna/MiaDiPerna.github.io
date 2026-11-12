#!/bin/sh
# Builds audio/mix.wav: Mixkit SFX on the script's cues + "Swing is the Answer" from 15s.
FF=node_modules/ffmpeg-static/ffmpeg.exe
B() { python -c "print(round(15+$1*60/90,3))"; }
ms() { python -c "print(int(round($1*1000)))"; }
F="aformat=sample_rates=44100:channel_layouts=stereo"
PUL="0.15 0.85 1.55 2.25 2.95 3.65"
fc="[0:a]$F,atrim=0:0.45,afade=t=out:st=0.3:d=0.15,volume=0.8,asplit=6[b0][b1][b2][b3][b4][b5];"
i=0; for p in $PUL; do fc="$fc[b$i]adelay=$(ms $p)|$(ms $p)[bz$i];"; i=$((i+1)); done
fc="$fc[1:a]$F,adelay=4850|4850,volume=1.0[boing];"
fc="$fc[2:a]$F,atrim=0.13:3.18,asetpts=PTS-STARTPTS,afade=t=out:st=3.03:d=0.02,adelay=5750|5750,volume=0.7[type];"
fc="$fc[3:a]$F,afade=t=out:st=4.0:d=0.6,adelay=10600|10600,volume=0.9[bone];"
fc="$fc[4:a]$F,atrim=0.19:0.55,asetpts=PTS-STARTPTS,asplit=4[k0][k1][k2][k3];"
j=0; for n in 7 11 17 22; do d=$(ms $(B $n)); fc="$fc[k$j]adelay=$d|$d,volume=0.8[ck$j];"; j=$((j+1)); done
fc="$fc[5:a]$F,asplit=3[d0][d1][d2];"
j=0; for n in 9 14 19; do d=$(ms $(B $n)); fc="$fc[d$j]adelay=$d|$d,volume=0.75[dg$j];"; j=$((j+1)); done
fc="$fc[6:a]$F,atrim=start=75.367:duration=30,asetpts=PTS-STARTPTS,afade=t=in:d=0.03,adelay=15000|15000,volume=0.85[mus];"
fc="$fc[bz0][bz1][bz2][bz3][bz4][bz5][boing][type][bone][ck0][ck1][ck2][ck3][dg0][dg1][dg2][mus]amix=inputs=17:normalize=0:duration=longest,atrim=0:45,afade=t=out:st=44.6:d=0.4,loudnorm=I=-16:TP=-1.5,aresample=48000[out]"
$FF -v error -y -i audio/buzz.mp3 -i audio/boing.mp3 -i audio/typing.mp3 -i audio/trombone_sad.mp3 -i audio/click.mp3 -i audio/ding.mp3 -i audio/cand_swing.mp3 -filter_complex "$fc" -map "[out]" audio/mix.wav
