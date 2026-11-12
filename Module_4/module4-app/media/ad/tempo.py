import sys,subprocess,array,math
import os; FF=os.path.abspath('node_modules/ffmpeg-static/ffmpeg.exe')
def env(path,dur=60,sr=8000,hop=80):
    raw=subprocess.run([FF,'-v','quiet','-i',path,'-t',str(dur),'-ac','1','-ar',str(sr),'-f','s16le','-'],capture_output=True).stdout
    a=array.array('h',raw); n=len(a)//hop
    e=[sum(abs(x) for x in a[i*hop:(i+1)*hop])/hop for i in range(n)]
    o=[max(0,e[i]-e[i-1]) for i in range(1,n)]
    return o, sr/hop
for p in sys.argv[1:]:
    o,fr=env(p); m=sum(o)/len(o); o=[x-m for x in o]
    best=[]
    for bpm10 in range(700,1800,2):
        lag=fr*60/(bpm10/10); L=int(lag)
        s=0
        for k in (1,2,4):
            lk=lag*k; li=int(lk); f=lk-li
            s+=sum(o[i]*((1-f)*o[i+li]+f*o[i+li+1]) for i in range(0,len(o)-li-2,2))
        best.append((s,bpm10/10))
    best.sort(reverse=True); bpm=best[0][1]
    per=fr*60/bpm
    ph=max(range(int(per)),key=lambda p:sum(o[int(p+k*per)] for k in range(int((len(o)-p)/per)-1)))
    print(p, 'bpm', bpm, 'beat0 %.3fs'%(ph/fr), 'top', [b for _,b in best[:4]])
