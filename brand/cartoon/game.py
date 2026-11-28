import sys,math,random,subprocess
from common import *
W,H,FPS=1080,1920,30; DUR=23.0
GROUND=1450; BX=300; SPEED=520
HITS=[(4.2,"NO","WEBSITE"),(6.0,"SLOW","APP"),(7.8,"ZERO","REACH")]
PICK=[(11.3,"WEBSITE"),(12.6,"APP"),(13.9,"MARKETING"),(15.2,"GAME DEV")]
JUMPOVER=(16.2,"NO","LEADS")
GO=(8.3,10.3)
def ease(t): t=max(0,min(1,t)); return 1-(1-t)**3
def gfill(img,box,shape="ellipse",r=0):
    x0,y0,x1,y1=map(int,box); w,h=x1-x0,y1-y0
    if w<=0 or h<=0: return
    m=Image.new("L",(w,h),0); md=ImageDraw.Draw(m)
    (md.ellipse if shape=="ellipse" else (lambda b,fill: md.rounded_rectangle(b,r,fill=fill)))((0,0,w-1,h-1),fill=255)
    img.paste(gradient(w,h),(x0,y0),m)
def heart(d,cx,cy,s,col):
    r=s*0.3
    d.ellipse((cx-2*r,cy-r,cx,cy+r),fill=col); d.ellipse((cx,cy-r,cx+2*r,cy+r),fill=col)
    d.polygon([(cx-2*r+2,cy+r*0.3),(cx+2*r-2,cy+r*0.3),(cx,cy+2.2*r)],fill=col)
def star(d,cx,cy,R,col):
    pts=[(cx+(R if i%2==0 else R*0.45)*math.cos(-math.pi/2+i*math.pi/5),cy+(R if i%2==0 else R*0.45)*math.sin(-math.pi/2+i*math.pi/5)) for i in range(10)]
    d.polygon(pts,fill=col)
def ctext(d,y,txt,sz,col=NAVY,bold=True,x=W//2):
    d.text((x,y),txt,font=font(BOLD if bold else REG,sz),fill=col,anchor="mm")
def outline_text(d,xy,txt,sz,fill="white",stroke=NAVY,sw=8):
    d.text(xy,txt,font=font(BOLD,sz),fill=fill,anchor="mm",stroke_width=sw,stroke_fill=stroke)
def blob(img,d,x,y,t,state="run",scale=1.0,glow=False):
    s=scale; bw,bh=170*s,150*s
    if glow:
        for k in range(3):
            rr=bw*0.75+k*18+8*math.sin(t*10)
            d.ellipse((x-rr,y-bh/2-rr*0.9,x+rr,y-bh/2+rr*0.9),outline=grad_color(k/2),width=5)
    # feet
    ph=math.sin(t*22) if state=="run" else 0
    for i,sgn in enumerate((-1,1)):
        fx=x+sgn*40*s+(ph*18*s*sgn if state=="run" else 0); fy=y-6*s
        d.ellipse((fx-26*s,fy-16*s,fx+26*s,fy+14*s),fill=NAVY)
    sq=1+0.05*math.sin(t*22) if state=="run" else 1
    gfill(img,(x-bw/2,y-bh*sq-10*s,x+bw/2,y-10*s))
    # eyes
    ey=y-bh*0.62-10*s
    for sgn in (-1,1):
        ex=x+sgn*34*s+12*s
        if state=="hurt":
            for a in (1,-1): d.line((ex-14*s,ey-14*s*a,ex+14*s,ey+14*s*a),fill="white",width=int(7*s))
        else:
            blink=(t%3.1)<0.12
            if blink: d.line((ex-18*s,ey,ex+18*s,ey),fill="white",width=int(6*s))
            else:
                d.ellipse((ex-22*s,ey-26*s,ex+22*s,ey+26*s),fill="white")
                d.ellipse((ex-9*s+6*s,ey-12*s,ex+11*s+6*s,ey+12*s),fill=NAVY)
                d.ellipse((ex+4*s,ey-8*s,ex+10*s,ey-2*s),fill="white")
    my=y-bh*0.3-10*s
    if state=="hurt": d.ellipse((x+2*s,my-12*s,x+30*s,my+14*s),fill=NAVY)
    else: d.arc((x-8*s,my-24*s,x+40*s,my+10*s),20,160,fill=NAVY,width=int(6*s))
    d.ellipse((x-58*s,my-14*s,x-34*s,my),fill=(255,150,190)); d.ellipse((x+56*s,my-14*s,x+80*s,my),fill=(255,150,190))
def world(img,d,t,cam):
    # sky tint
    for k,c in enumerate([(248,243,255),(244,236,255)]): pass
    # clouds
    for i in range(6):
        cx=(i*420-cam*0.3)%(W+600)-300; cy=520+(i%3)*170
        for dx,r in ((0,55),(55,70),(115,50)): d.ellipse((cx+dx-r,cy-r,cx+dx+r,cy+r),fill=(238,230,252))
    # floating bricks
    for i in range(5):
        bx=(i*700+250-cam*0.6)%(W+700)-300
        for j in range(3): d.rectangle((bx+j*80,1080+(i%2)*60,bx+j*80+74,1080+(i%2)*60+74),fill=(225,212,248),outline=(206,188,240),width=4)
    # ground
    img.paste(gradient(W,22),(0,GROUND)); d.rectangle((0,GROUND+22,W,1920),fill=NAVY)
    for i in range(14):
        gx=(i*120-cam)%(W+120)-120
        d.rectangle((gx+10,GROUND+60,gx+60,GROUND+80),fill=(52,30,90))
def wall(d,sx,a,b,danger=True):
    w,h=230,270; d.rounded_rectangle((sx,GROUND-h,sx+w,GROUND),18,fill=(52,30,90) if danger else NAVY,outline=C3,width=8)
    d.text((sx+w/2,GROUND-h+90),a,font=font(BOLD,50),fill="white",anchor="mm")
    d.text((sx+w/2,GROUND-h+165),b,font=font(BOLD,40 if len(b)>6 else 46),fill=C3 if danger else "white",anchor="mm")
    # spikes
    for k in range(5): d.polygon([(sx+15+k*42,GROUND-h),(sx+36+k*42,GROUND-h-34),(sx+57+k*42,GROUND-h)],fill=C3)
def hud(d,img,t,hearts,score,level="LEVEL 1"):
    for i in range(3): heart(d,95+i*78,215,60,C3 if i<hearts else (215,205,230))
    d.text((W-70,215),f"SCORE {score:05d}",font=font(BOLD,46),fill=NAVY,anchor="rm")
    gfill(img,(W//2-120,180,W//2+120,250),"rr",35); ctext(d,215,level,36,"white")
random.seed(3); CONF=[(random.uniform(0,W),random.uniform(-400,0),random.uniform(-120,120),random.uniform(500,900),random.choice([C1,C2,C3,(255,196,0)]),random.uniform(10,22)) for _ in range(140)]
def frame(t):
    img=Image.new("RGB",(W,H),(250,246,255)); d=ImageDraw.Draw(img)
    img.paste(gradient(W,16),(0,0))
    cam=SPEED*t
    if t<2.6:  # title
        world(img,d,t,cam*0.2)
        p=ease(t/0.5)
        ctext(d,420,"POV:",70,GREY,False)
        ctext(d,560-int(60*(1-p)),"Your business",100)
        ctext(d,680-int(60*(1-p)),"is a video game",100)
        q=ease((t-0.6)/0.4)
        if q>0:
            ctext(d,820,"and you're stuck on",56,NAVY,False)
            s=0.6+0.4*q+0.04*math.sin(t*8); fs=int(140*s)
            grad_text(img,(W//2,950),"LEVEL 1",font(BOLD,fs),anchor="mm")
        blob(img,d,W//2,GROUND,t,"idle",1.3)
        if (t*2)%1<0.6: ctext(d,1680,"PRESS START >>",50,"white")
        return img
    if t>=19.4:  # end card
        lt=t-19.4; p=ease(lt/0.5)
        l=logo_at(int(640*(0.85+0.15*p))); img.paste(l,((W-l.width)//2,330),l)
        blob(img,d,W//2,1150+int(-abs(math.sin(lt*5))*60),t,"idle",1.0,glow=True)
        q=ease((lt-0.4)/0.5)
        if q>0:
            ctext(d,690+int(30*(1-q)),"Need power-ups",80); ctext(d,785+int(30*(1-q)),"for your business?",64,NAVY,False)
        q=ease((lt-0.9)/0.5)
        if q>0:
            gfill(img,(W//2-400,1280,W//2+400,1450),"rr",85); ctext(d,1365,"DM us \"GROW\"",80,"white")
            ctext(d,1530,"Websites  |  Apps  |  Games  |  Marketing",38,GREY,False)
        ctext(d,1740,"@dfe_technology",46,GREY)
        return img
    world(img,d,t,cam)
    # state
    hearts=3; score=0; state="run"; by=GROUND; glow=False
    for th,_,_ in HITS:
        if t>=th: hearts-=1
        if th<=t<th+0.45: state="hurt"
    if t>=GO[0]: hearts=0
    for i,(th,_) in enumerate(PICK):
        if t>=th: hearts=min(3,i+1) if t<PICK[-1][0] else 3; score+=2500; glow=True
        if th-0.45<=t<th+0.35: by=GROUND-int(380*(1-((t-th)/0.4)**2)) if abs(t-th)<0.4 else by
    if t>=PICK[0][0]: hearts=max(hearts,1)
    jt=JUMPOVER[0]
    if abs(t-jt)<0.5: by=GROUND-int(420*(1-((t-jt)/0.5)**2))
    if t>=jt+0.3: score+=1000
    if t>=16.9: score+=2000
    # obstacles
    for th,a,b in HITS:
        sx=BX+90+SPEED*(th-t)
        if -260<sx<W: wall(d,sx,a,b)
    sx=BX-115+SPEED*(jt-t)
    if -260<sx<W: wall(d,sx,JUMPOVER[1],JUMPOVER[2])
    for th,lab in PICK:
        cx=BX+SPEED*(th-t); cy=GROUND-380-80
        if t<th and -150<cx<W+150:
            bob=10*math.sin(t*6)
            gfill(img,(cx-75,cy-75+bob,cx+75,cy+75+bob)); d.ellipse((cx-75,cy-75+bob,cx+75,cy+75+bob),outline=(255,196,0),width=9)
            star(d,cx,cy+bob,46,"white")
            d.text((cx,cy-125+bob),lab,font=font(BOLD,44),fill=NAVY,anchor="mm",stroke_width=6,stroke_fill="white")
        if th<=t<th+0.9:
            k=(t-th)/0.9
            d.text((BX,by-260-int(160*k)),"+2500",font=font(BOLD,60),fill=C2,anchor="mm",stroke_width=6,stroke_fill="white")
    gx=GO[0]<=t<GO[1]
    blob(img,d,BX,by,t,"hurt" if (state=="hurt" or gx) else ("idle" if gx else "run"),1.0,glow and t<16.9)
    for th,_,_ in HITS:
        if th<=t<th+0.6:
            k=(t-th)/0.6; outline_text(d,(BX+40,by-300-int(80*k)),"OUCH!",int(90+30*k),C3,"white",8)
    # top caption
    if t<GO[0]: cap=("Running your business","offline be like...")
    elif t<GO[1]: cap=None
    elif t<16.9: cap=("Now add some","POWER-UPS")
    else: cap=None
    hud(d,img,t,0 if gx else hearts,score,"LEVEL 2" if t>=17.6 else "LEVEL 1")
    if cap:
        ctext(d,400,cap[0],68)
        if cap[1]=="POWER-UPS": grad_text(img,(W//2,500),cap[1],font(BOLD,96),anchor="mm")
        else: ctext(d,490,cap[1],68)
    for th,lab in PICK:
        if th<=t<th+1.2:
            k=ease((t-th)/0.25); gfill(img,(W//2-int(380*k),600,W//2+int(380*k),720),"rr",60)
            if k>0.9: ctext(d,660,f"POWER-UP: {lab}",48,"white")
    if gx:
        ov=Image.new("RGBA",(W,H),(30,12,58,170)); img.paste(ov,(0,0),ov); d=ImageDraw.Draw(img)
        lt=t-GO[0]; s=1+0.1*max(0,1-lt*4)
        outline_text(d,(W//2,760),"GAME OVER?",int(130*s),"white",C3,10)
        if lt>0.9:
            ctext(d,930,"CONTINUE?",64,"white")
            if (lt*3)%1<0.65: ctext(d,1030,"YES >>",72,(255,196,0))
    if t>=16.9:
        lt=t-16.9
        for (x0,y0,vx,vy,c,r) in CONF:
            x=x0+vx*lt; y=y0+vy*lt+200*lt*lt
            if y<H: d.rectangle((x,y,x+r,y+r*0.6),fill=c)
        s=ease(lt/0.35)
        grad_text(img,(W//2,780),"LEVEL UP!",font(BOLD,max(10,int(170*s))),anchor="mm")
        if lt>0.6: ctext(d,920,"Level 2 unlocked",60,NAVY,False)
    ctext(d,1790,"@dfe_technology",40,(200,190,225))
    return img
if __name__=="__main__":
    if len(sys.argv)>1:
        for t in map(float,sys.argv[1:]): frame(t).save(f"g_{t}.jpg",quality=90)
        sys.exit()
    p=subprocess.Popen(["ffmpeg","-y","-loglevel","error","-f","rawvideo","-pix_fmt","rgb24","-s",f"{W}x{H}","-r",str(FPS),"-i","-",
     "-c:v","libx264","-preset","veryfast","-crf","20","-pix_fmt","yuv420p","gvideo_tmp.mp4"],stdin=subprocess.PIPE)
    for n in range(int(DUR*FPS)): p.stdin.write(frame(n/FPS).tobytes())
    p.stdin.close(); assert p.wait()==0
