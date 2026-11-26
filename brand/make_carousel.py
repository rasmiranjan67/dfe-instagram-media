from PIL import Image, ImageDraw, ImageFont, ImageChops
import os, sys

W, H = 1080, 1350
NAVY = (30, 12, 58)
GREY = (90, 80, 110)
C1, C2, C3 = (106, 13, 200), (200, 20, 170), (255, 23, 68)
F = "/usr/share/fonts/truetype/google-fonts/"
BOLD = F + "Poppins-Bold.ttf"
REG = F + "Poppins-Regular.ttf" if os.path.exists(F + "Poppins-Regular.ttf") else F + "Poppins-Medium.ttf"
OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)

def font(p, s):
    return ImageFont.truetype(p, s)

def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))

def grad_color(t):
    return lerp(C1, C2, t * 2) if t < 0.5 else lerp(C2, C3, (t - 0.5) * 2)

def gradient(w, h):
    g = Image.new("RGB", (w, h))
    d = ImageDraw.Draw(g)
    for x in range(w):
        d.line([(x, 0), (x, h)], fill=grad_color(x / max(w - 1, 1)))
    return g

# logo with white removed
logo = Image.open("/mnt/user-data/uploads/2fbfd93a-image.png").convert("RGB")
logo = logo.crop((100, 440, 1170, 840))
gray = logo.convert("L")
alpha = gray.point(lambda v: 0 if v > 235 else (255 if v < 200 else int((235 - v) * 255 / 35)))
logo = logo.convert("RGBA"); logo.putalpha(alpha)

def paste_logo(img, width, xy):
    l = logo.resize((width, int(logo.height * width / logo.width)), Image.LANCZOS)
    img.paste(l, xy, l)

def grad_text(img, xy, text, f):
    d = ImageDraw.Draw(img)
    bbox = d.textbbox(xy, text, font=f)
    w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    mask = Image.new("L", img.size, 0)
    ImageDraw.Draw(mask).text(xy, text, font=f, fill=255)
    g = Image.new("RGB", img.size)
    g.paste(gradient(w + 4, h + 4), (bbox[0], bbox[1]))
    img.paste(g, (0, 0), mask)

def wrap(d, text, f, maxw):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if d.textlength(t, font=f) <= maxw:
            cur = t
        else:
            lines.append(cur); cur = w
    lines.append(cur)
    return lines

def base(n, total):
    img = Image.new("RGB", (W, H), (255, 255, 255))
    d = ImageDraw.Draw(img)
    # soft corner blobs
    img.paste(gradient(W, 14), (0, 0))
    img.paste(gradient(W, 14), (0, H - 14))
    paste_logo(img, 210, (70, 60))
    d.text((W - 70, 80), f"{n}/{total}", font=font(BOLD, 30), fill=GREY, anchor="ra")
    d.text((W // 2, H - 70), "@dfe_technology", font=font(BOLD, 28), fill=GREY, anchor="mm")
    return img, d

slides = [
    ("cover", None),
    ("1", ("It takes more than 3 seconds to load", "Most visitors leave a slow site before it even opens. Every second costs you leads.")),
    ("2", ("It isn't built for mobile first", "Your customers are on their phones. If buttons are tiny and text needs zooming, they're gone.")),
    ("3", ("There's no instant way to contact you", "No WhatsApp button, no quick enquiry form? You're making buyers work too hard.")),
    ("4", ("Google can't find you", "No SEO basics means your competitors show up first, every single time.")),
    ("5", ("It still looks like 2018", "Old design quietly tells people your business is outdated too. Trust is lost in a glance.")),
    ("cta", None),
]
total = len(slides)

for i, (kind, data) in enumerate(slides, 1):
    img, d = base(i, total)
    if kind == "cover":
        d.text((80, 300), "Is your website", font=font(BOLD, 72), fill=NAVY)
        grad_text(img, (80, 390), "losing you", font(BOLD, 112))
        grad_text(img, (80, 520), "customers?", font(BOLD, 112))
        d.text((80, 720), "5 signs it's time for", font=font(REG, 48), fill=GREY)
        d.text((80, 785), "a new website in 2026", font=font(REG, 48), fill=GREY)
        bx = Image.new("RGB", (430, 100)); bx.paste(gradient(430, 100))
        m = Image.new("L", (430, 100), 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, 429, 99), 50, fill=255)
        img.paste(bx, (80, 960), m)
        d.text((80 + 215, 1010), "Swipe >>", font=font(BOLD, 44), fill="white", anchor="mm")
    elif kind == "cta":
        d.text((80, 260), "Ticked even one?", font=font(BOLD, 64), fill=NAVY)
        grad_text(img, (80, 350), "Let's fix it.", font(BOLD, 110))
        y = 560
        for s in ["Websites that load fast & sell", "Mobile apps", "Games", "Digital marketing & SEO"]:
            img.paste(gradient(18, 18), (90, y + 22))
            d.text((130, y), s, font=font(REG, 44), fill=NAVY); y += 80
        bx = Image.new("RGB", (920, 150)); bx.paste(gradient(920, 150))
        m = Image.new("L", (920, 150), 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, 919, 149), 40, fill=255)
        img.paste(bx, (80, 960), m)
        d.text((540, 1035), "DM us \"WEBSITE\" for a free audit", font=font(BOLD, 46), fill="white", anchor="mm")
    else:
        title, body = data
        grad_text(img, (70, 230), kind.zfill(2), font(BOLD, 260))
        y = 560
        for line in wrap(d, title, font(BOLD, 78), 940):
            d.text((70, y), line, font=font(BOLD, 78), fill=NAVY); y += 98
        y += 40
        img.paste(gradient(140, 10), (70, y)); y += 60
        for line in wrap(d, body, font(REG, 44), 940):
            d.text((70, y), line, font=font(REG, 44), fill=GREY); y += 66
    img.save(f"{OUT}/slide{i}.jpg", "JPEG", quality=92)
print("done")
