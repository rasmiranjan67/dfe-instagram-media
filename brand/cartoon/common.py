from PIL import Image, ImageDraw, ImageFont
NAVY=(30,12,58); GREY=(90,80,110); C1,C2,C3=(106,13,200),(200,20,170),(255,23,68)
F="/usr/share/fonts/truetype/google-fonts/"; BOLD=F+"Poppins-Bold.ttf"; REG=F+"Poppins-Regular.ttf"
_fc={}
def font(p,s):
    k=(p,s)
    if k not in _fc: _fc[k]=ImageFont.truetype(p,s)
    return _fc[k]
def lerp(a,b,t): return tuple(int(a[i]+(b[i]-a[i])*t) for i in range(3))
def grad_color(t): return lerp(C1,C2,t*2) if t<0.5 else lerp(C2,C3,(t-0.5)*2)
_gc={}
def gradient(w,h):
    if (w,h) in _gc: return _gc[(w,h)]
    row=Image.new("RGB",(w,1))
    for x in range(w): row.putpixel((x,0),grad_color(x/max(w-1,1)))
    g=row.resize((w,h)); _gc[(w,h)]=g; return g
logo=Image.open("/home/claude/dfe-instagram-media/brand/logo.png").convert("RGB").crop((100,440,1170,840))
a=logo.convert("L").point(lambda v:0 if v>235 else (255 if v<200 else int((235-v)*255/35)))
logo=logo.convert("RGBA"); logo.putalpha(a)
def logo_at(w): return logo.resize((w,int(logo.height*w/logo.width)),Image.LANCZOS)
def grad_text(img,xy,text,f,anchor="la"):
    d=ImageDraw.Draw(img); b=d.textbbox(xy,text,font=f,anchor=anchor)
    m=Image.new("L",(b[2]-b[0]+4,b[3]-b[1]+4),0)
    ImageDraw.Draw(m).text((xy[0]-b[0],xy[1]-b[1]),text,font=f,fill=255,anchor=anchor)
    img.paste(gradient(m.width,m.height),(b[0],b[1]),m)
def wrap(d,text,f,maxw):
    words,lines,cur=text.split(),[],""
    for w in words:
        t=(cur+" "+w).strip()
        if d.textlength(t,font=f)<=maxw: cur=t
        else: lines.append(cur); cur=w
    lines.append(cur); return lines
def check_glyphs(texts):
    from fontTools.ttLib import TTFont
    cm=TTFont(BOLD).getBestCmap()
    bad={c for t in texts for c in t if ord(c) not in cm and c not in "\n"}
    assert not bad, bad
