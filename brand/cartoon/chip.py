import numpy as np, wave
sr=44100; D=23.0; N=int(sr*D); out=np.zeros(N)
def sq(f,dur,vol=0.1,duty=0.5):
    t=np.arange(int(sr*dur))/sr; w=np.where((t*f)%1<duty,1.0,-1.0)
    env=np.minimum(1,t/0.005)*np.minimum(1,(dur-t)/0.02); return vol*w*env
def tri(f,dur,vol=0.15):
    t=np.arange(int(sr*dur))/sr; w=2*np.abs(2*((t*f)%1)-1)-1
    return vol*w*np.minimum(1,(dur-t)/0.02)
def add(x,start):
    i=int(start*sr); x=x[:max(0,N-i)]; out[i:i+len(x)]+=x
nf=lambda n:440*2**((n-69)/12)
bpm=150; e=60/bpm/2
mel=[72,76,79,76,74,77,81,77,72,76,79,84,83,79,76,74]
bass=[48,48,55,55,53,53,55,55]
def music(a,b,trans=0,vol=1.0):
    k=0; t=a
    while t<b-e:
        add(sq(nf(mel[k%16]+trans),e*0.9,0.05*vol,0.25),t)
        if k%2==0: add(tri(nf(bass[(k//2)%8]+trans),e*1.8,0.16*vol),t)
        if k%4==2: add(np.random.randn(int(sr*0.04))*0.05*vol*np.exp(-np.arange(int(sr*0.04))/300),t)
        k+=1; t+=e
music(0,8.3); music(10.3,16.9,5); music(16.9,23,7,0.8)
for th in (4.2,6.0,7.8):   # bonk
    t=np.arange(int(sr*0.25))/sr; f=400*np.exp(-t*8); add(0.18*np.sign(np.sin(2*np.pi*np.cumsum(f)/sr))*np.exp(-t*6),th)
for i,n in enumerate([67,64,60,55]): add(sq(nf(n),0.28,0.1),8.35+i*0.3)   # game over
for i,n in enumerate([72,76,79]): add(sq(nf(n),0.1,0.08),9.4+i*0.12)
for th in (11.3,12.6,13.9,15.2): add(sq(nf(83),0.07,0.1),th); add(sq(nf(88),0.25,0.1),th+0.07)  # coin
for th in [x-0.4 for x in (11.3,12.6,13.9,15.2)]+[15.7]:   # jump
    t=np.arange(int(sr*0.15))/sr; f=300+1500*t; add(0.06*np.sign(np.sin(2*np.pi*np.cumsum(f)/sr)),th)
for i,n in enumerate([60,64,67,72,76,79,84]): add(sq(nf(n),0.09,0.09),16.9+i*0.08)
t=np.arange(N)/sr; out*=np.minimum(1,(D-t)/1.5)
out=out/np.abs(out).max()*0.8
w=wave.open("chip.wav","wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes((out*32767).astype(np.int16).tobytes()); w.close()
