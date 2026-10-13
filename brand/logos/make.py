# Generates the LazyDonkeyGames logo concepts as SVG. Run: python3 make.py
# Torn edges use a seeded random so every run produces the same files.
import math, random

def jag_circle(cx, cy, r, n, amp, seed):
    rnd = random.Random(seed)
    pts = []
    for i in range(n):
        a = 2 * math.pi * i / n + rnd.uniform(-0.3, 0.3) * (2 * math.pi / n)
        rr = r + rnd.uniform(-amp, amp)
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    return pts

def path(pts):
    return "M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in pts) + " Z"

def flaps(cx, cy, r, count, seed, length=(40, 84)):
    """Torn paper flaps folded outward: each is a triangle-ish shard with a base
    on the rim and a ragged point, the way paper tears (user's preferred look)."""
    rnd = random.Random(seed)
    out = []
    for i in range(count):
        a0 = 2 * math.pi * (i + rnd.uniform(0.05, 0.3)) / count - math.pi / 2
        span = 2 * math.pi / count * rnd.uniform(0.5, 0.85)
        a1 = a0 + span
        L = rnd.uniform(*length)
        tipa = (a0 + a1) / 2 + rnd.uniform(-0.22, 0.22)
        base0 = (cx + r * math.cos(a0), cy + r * math.sin(a0))
        base1 = (cx + r * math.cos(a1), cy + r * math.sin(a1))
        tip = (cx + (r + L) * math.cos(tipa), cy + (r + L) * math.sin(tipa))
        edge = [base0]
        for (p, q) in ((base0, tip), (tip, base1)):
            for k in range(1, 6):
                t = k / 6
                edge.append((p[0] + (q[0] - p[0]) * t + rnd.uniform(-4, 4), p[1] + (q[1] - p[1]) * t + rnd.uniform(-4, 4)))
            edge.append(q)
        rim = [(cx + (r - 3) * math.cos(a1 - (a1 - a0) * k / 6), cy + (r - 3) * math.sin(a1 - (a1 - a0) * k / 6)) for k in range(1, 6)]
        out.append((edge + rim, tip, tipa))
    return out

# ---------- the donkey (original design), drawn in a 300x330 frame ----------
def donkey(style):
    o = style["outline"]; sw = style["stroke"]
    coat, coatD, coatL = style["coat"], style["coatDark"], style["coatLight"]
    mane, muzzle, hoof = style["mane"], style["muzzle"], style["hoof"]
    shade = style["shade"]
    S = f'stroke="{o}" stroke-width="{sw}" stroke-linejoin="round" stroke-linecap="round"'
    g = []
    g.append('<ellipse cx="152" cy="316" rx="98" ry="14" fill="#000" opacity=".18"/>')
    # far front legs, peeking between the rear legs
    g.append(f'<path d="M134,236 L136,298 L148,298 L148,236 Z" fill="{coatD}" {S}/>')
    g.append(f'<path d="M156,236 L157,298 L169,298 L170,236 Z" fill="{coatD}" {S}/>')
    g.append(f'<rect x="133" y="292" width="17" height="10" rx="4" fill="{hoof}" {S}/>')
    g.append(f'<rect x="155" y="292" width="17" height="10" rx="4" fill="{hoof}" {S}/>')
    # barrel and back, receding toward the withers
    g.append(f'<path d="M70,184 C66,136 120,104 182,104 C224,104 244,130 240,170 C236,206 190,214 150,212 C104,210 74,208 70,184 Z" fill="{coatD}" {S}/>')
    # neck rising to the head (over the right shoulder)
    g.append(f'<path d="M176,134 C178,100 200,74 226,60 L268,76 C254,96 244,122 240,150 C220,154 196,150 176,134 Z" fill="{coat}" {S}/>')
    g.append(f'<path d="M180,124 C182,96 200,70 222,54 L232,64 C210,80 196,100 192,128 Z" fill="{mane}" {S}/>')
    # far ear (behind head)
    g.append(f'<path d="M262,40 C270,14 282,-6 292,-12 C296,6 290,30 276,50 Z" fill="{coatD}" {S}/>')
    g.append(f'<path d="M270,38 C276,20 284,6 289,1 C289,14 285,28 277,42 Z" fill="{style["earIn"]}"/>')
    # head: skull plus a muzzle turned toward the viewer's right
    g.append(f'<path d="M214,52 C212,26 236,12 260,16 C284,20 296,38 292,58 C306,66 318,82 316,98 C314,118 294,126 274,122 C258,120 246,112 238,102 C222,94 214,74 214,52 Z" fill="{coat}" {S}/>')
    g.append(f'<path d="M248,92 C256,74 280,66 300,72 C314,78 320,94 314,108 C306,124 282,128 264,120 C252,114 244,104 248,92 Z" fill="{muzzle}" {S}/>')
    # near ear
    g.append(f'<path d="M224,30 C214,6 200,-12 188,-18 C186,2 196,24 214,44 Z" fill="{coat}" {S}/>')
    g.append(f'<path d="M218,30 C210,14 200,2 193,-4 C194,10 202,24 213,36 Z" fill="{style["earIn"]}"/>')
    g.append(f'<path d="M188,-18 C190,-10 194,-4 198,0 L193,-4 Z" fill="{mane}"/>')
    # forelock tuft
    g.append(f'<path d="M232,22 C240,8 254,6 262,14 C252,14 246,20 244,28 C240,22 236,22 232,22 Z" fill="{mane}" {S}/>')
    # eyes look at the viewer, half-lidded and sly
    for (ex, ey, rx, ry, px) in ((238, 50, 11, 13, -2), (268, 44, 9, 12, -3)):
        g.append(f'<ellipse cx="{ex}" cy="{ey}" rx="{rx}" ry="{ry}" fill="#fff" {S}/>')
        g.append(f'<circle cx="{ex+px}" cy="{ey+3}" r="{rx*0.55:.1f}" fill="#2b1d14"/>')
        g.append(f'<circle cx="{ex+px+2}" cy="{ey+1}" r="{rx*0.2:.1f}" fill="#fff"/>')
        # heavy upper lid covers the top of the eye
        g.append(f'<path d="M{ex-rx-1},{ey-1} C{ex-rx+2},{ey-ry-3} {ex+rx-2},{ey-ry-3} {ex+rx+1},{ey-3} C{ex+rx*0.3},{ey-ry*0.15} {ex-rx*0.5},{ey-ry*0.05} {ex-rx-1},{ey-1} Z" fill="{coat}" {S}/>')
    # brows: near one low and angled in (mischief), far one cocked up
    g.append(f'<path d="M225,36 C233,34 242,36 249,41" fill="none" stroke="{o}" stroke-width="{sw+1.5}" stroke-linecap="round"/>')
    g.append(f'<path d="M259,26 C266,20 274,20 280,25" fill="none" stroke="{o}" stroke-width="{sw+1.5}" stroke-linecap="round"/>')
    # nostrils
    g.append(f'<ellipse cx="303" cy="86" rx="4" ry="5" fill="{o}" transform="rotate(-20 303 86)"/>')
    g.append(f'<ellipse cx="288" cy="80" rx="3" ry="4" fill="{o}" transform="rotate(-20 288 80)"/>')
    # lopsided smirk: flat on the far side, curling up into the near cheek,
    # with a sliver of teeth at the raised corner
    g.append(f'<path d="M256,98 C262,104 270,108 280,108 C292,108 302,106 310,102 C302,112 290,116 278,115 C268,114 260,108 256,98 Z" fill="#5a1f1f" {S}/>')
    g.append(f'<path d="M259,102 C265,107 272,110 281,110 L282,106 C273,106 265,103 259,98 Z" fill="#fff"/>')
    g.append(f'<path d="M252,90 C252,96 254,100 258,102" fill="none" {S}/>')
    g.append(f'<path d="M296,110 C300,112 304,112 307,110" fill="none" stroke="{o}" stroke-width="{max(sw-1,2)}" stroke-linecap="round"/>')
    # planted rear-right leg
    g.append(f'<path d="M160,236 C162,252 173,266 177,282 L178,306 L199,306 L198,282 C200,266 212,254 216,222 Z" fill="{coat}" {S}/>')
    g.append(f'<rect x="176" y="300" width="25" height="14" rx="5" fill="{hoof}" {S}/>')
    g.append(f'<path d="M178,290 L199,290" stroke="{coatL}" stroke-width="5" stroke-linecap="round"/>')
    # near rear leg, cocked right after the kick: thigh down to the hock;
    # kick() draws the foreshortened lower leg and the hoof sole
    g.append(f'<path d="M70,222 C70,240 76,252 84,262 L120,258 C124,250 130,244 136,236 Z" fill="{coat}" {S}/>')
    # rump (closest to camera): two cheeks and a soft crease
    g.append(f'<path d="M150,150 C130,126 64,128 60,188 C58,232 92,254 122,254 L178,254 C208,254 242,232 240,188 C236,128 170,126 150,150 Z" fill="{coat}" {S}/>')
    if shade:
        g.append('<path d="M150,150 C130,126 64,128 60,188 C58,232 92,254 122,254 L178,254 C208,254 242,232 240,188 C236,128 170,126 150,150 Z" fill="url(#rumpShade)"/>')
    g.append(f'<path d="M150,154 C146,180 146,210 150,236" fill="none" stroke="{coatD}" stroke-width="{sw}" stroke-linecap="round"/>')
    g.append(f'<ellipse cx="106" cy="174" rx="22" ry="14" fill="{coatL}" opacity=".55" transform="rotate(-25 106 174)"/>')
    g.append(f'<ellipse cx="196" cy="174" rx="22" ry="14" fill="{coatL}" opacity=".55" transform="rotate(25 196 174)"/>')
    # rear legs with hocks
    # tail: a dark rope from the top of the crease, ending in a shaggy tuft
    g.append(f'<path d="M150,146 C141,166 138,190 142,210" fill="none" stroke="{o}" stroke-width="{sw+6}" stroke-linecap="round"/>')
    g.append(f'<path d="M150,146 C141,166 138,190 142,210" fill="none" stroke="{mane}" stroke-width="{max(sw+1,5)}" stroke-linecap="round"/>')
    g.append(f'<path d="M142,204 C132,210 126,226 128,242 L134,234 L136,248 L142,238 L147,250 L150,236 L156,242 C158,226 152,210 142,204 Z" fill="{mane}" {S}/>')
    return "\n".join(g)

def kick(style):
    """Lower part of the cocked rear leg: short and wide because it points at
    the camera, ending in the hoof sole (steel shoe, nails, frog)."""
    o = style["outline"]; sw = style["stroke"]; coat, hoof = style["coat"], style["hoof"]
    S = f'stroke="{o}" stroke-width="{sw}" stroke-linejoin="round" stroke-linecap="round"'
    g = ['<g transform="translate(0,-20)">']
    g.append(f'<path d="M84,276 C82,262 120,258 122,272 C126,284 124,296 118,306 L92,308 C86,300 82,288 84,276 Z" fill="{coat}" {S}/>')
    g.append(f'<path d="M88,298 C96,302 108,302 120,298" fill="none" stroke="{style["coatLight"]}" stroke-width="5" stroke-linecap="round"/>')
    t = 'transform="rotate(-6 105 316)"'
    g.append(f'<ellipse cx="105" cy="316" rx="22" ry="17" fill="{hoof}" {t} {S}/>')
    g.append(f'<path d="M89,322 C84,306 94,300 105,300 C116,300 126,306 121,322" fill="none" stroke="#cfd3d8" stroke-width="5.5" stroke-linecap="round" {t}/>')
    g.append(f'<g fill="{o}" {t}><circle cx="88" cy="314" r="1.3"/><circle cx="94" cy="304" r="1.3"/><circle cx="116" cy="304" r="1.3"/><circle cx="122" cy="314" r="1.3"/></g>')
    g.append(f'<path d="M100,321 L105,309 L110,321 Z" fill="#6b5a50" {t}/>')
    g.append('</g>')
    return "\n".join(g)

PAPER = dict(outline="#2d2d2d", stroke=3, coat="#8e9097", coatDark="#73757c", coatLight="#b3b5ba",
             mane="#45464c", muzzle="#d8d1c6", hoof="#3a3330", earIn="#c9a9a6", shade=True)

def scene(cx, cy, r, horizon_frac=0.56):
    """Sky over grass, clipped to the hole by the caller."""
    hy = cy - r + 2 * r * horizon_frac
    return f'''<rect x="{cx-r-20}" y="{cy-r-20}" width="{2*r+40}" height="{hy-(cy-r-20)}" fill="url(#sky)"/>
<rect x="{cx-r-20}" y="{hy}" width="{2*r+40}" height="{cy+r+20-hy}" fill="url(#grass)"/>
<ellipse cx="{cx-r*0.45}" cy="{hy}" rx="{r*0.7}" ry="{r*0.12}" fill="#3fa245"/>
<ellipse cx="{cx+r*0.5}" cy="{hy+2}" rx="{r*0.6}" ry="{r*0.1}" fill="#48b04e"/>
<g fill="#fff" opacity=".9"><ellipse cx="{cx-r*0.48}" cy="{cy-r*0.55}" rx="{r*0.2}" ry="{r*0.07}"/><ellipse cx="{cx-r*0.36}" cy="{cy-r*0.6}" rx="{r*0.12}" ry="{r*0.07}"/></g>'''

DEFS = '''<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3cc4f0"/><stop offset="1" stop-color="#9fe3fb"/></linearGradient>
<linearGradient id="grass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#55c45b"/><stop offset="1" stop-color="#2f9a3a"/></linearGradient>
<radialGradient id="rumpShade" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></radialGradient>
<linearGradient id="flap" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbf7ef"/><stop offset="1" stop-color="#d9d1c2"/></linearGradient>
<radialGradient id="screen" cx=".35" cy=".25" r="1"><stop offset="0" stop-color="#4a4a4a"/><stop offset="1" stop-color="#262626"/></radialGradient>
<filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>
<filter id="inner" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="9"/></filter>
</defs>'''

def badge(cx, cy, r, seed, style, paper=True, donkey_scale=1.0, flap_len=(40, 84)):
    hole = jag_circle(cx, cy, r, 64, 5 if paper else 3, seed)
    hp = path(hole)
    fl = flaps(cx, cy, r, 8, seed + 1, flap_len)
    parts = []
    # fibrous white torn core just outside the hole
    core = jag_circle(cx, cy, r + 7, 90, 4, seed + 2)
    parts.append(f'<path d="{path(core)}" fill="#f4efe6"/>')
    parts.append(f'<clipPath id="hole{seed}"><path d="{hp}"/></clipPath>')
    ds = r / 150 * 0.72 * donkey_scale  # donkey frame is ~260 wide, ~350 tall
    tx, ty = cx - 186 * ds, cy + 0.05 * r - 156 * ds
    parts.append(f'<g clip-path="url(#hole{seed})">{scene(cx, cy, r)}'
                 f'<g transform="translate({tx:.1f},{ty:.1f}) scale({ds:.3f})">{donkey(style)}</g>'
                 # inner shadow so the scene sits behind the screen surface
                 f'<path d="{hp}" fill="none" stroke="#000" stroke-opacity="{.35 if paper else .2}" stroke-width="26" filter="url(#inner)"/></g>')
    parts.append(f'<path d="{hp}" fill="none" stroke="#2d2d2d" stroke-width="{2 if paper else 5}" stroke-linejoin="round"/>')
    for pts, tip, a in fl:
        p = path(pts)
        if paper:
            parts.append(f'<path d="{p}" fill="#000" opacity=".35" filter="url(#soft)" transform="translate({6*math.cos(a):.1f},{6*math.sin(a)+5:.1f})"/>')
            parts.append(f'<path d="{p}" fill="url(#flap)" stroke="#b9ae9c" stroke-width="1.5" stroke-linejoin="round"/>')
        else:
            parts.append(f'<path d="{p}" fill="#f7f2e8" stroke="#2d2d2d" stroke-width="5" stroke-linejoin="round"/>')
    # the kicking hoof bursts out over the torn edge (drawn unclipped, on top)
    parts.append(f'<g transform="translate({tx:.1f},{ty:.1f}) scale({ds:.3f})">{kick(style)}</g>')
    return "\n".join(parts)

def svg(w, h, body, bg=""):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">\n{DEFS}\n{bg}\n{body}\n</svg>\n'

# 1. Paper-craft badge on a charcoal screen
b1 = badge(256, 262, 150, 7, PAPER)
open("logo-1-paper.svg", "w").write(svg(512, 512, b1, '<rect width="512" height="512" rx="96" fill="url(#screen)"/>'))

# 3. Horizontal lockup: badge plus wordmark
b3 = badge(186, 170, 104, 7, PAPER, flap_len=(24, 50))
word = ('<text x="344" y="160" font-family="Rubik, \'Arial Rounded MT Bold\', system-ui, sans-serif" font-weight="800" font-size="84" fill="#fff" letter-spacing="-1">Lazy<tspan fill="#ffd400">Donkey</tspan></text>'
        '<text x="348" y="228" font-family="Rubik, system-ui, sans-serif" font-weight="700" font-size="44" fill="#b4b4b4" letter-spacing="6">GAMES</text>')
# The art spans x 49 to 826 (flap tips to the end of "Donkey"), so a width of
# 875 leaves the same 49px margin on both sides.
W3 = 875
open("logo-3-lockup.svg", "w").write(svg(W3, 340, b3 + word, f'<rect width="{W3}" height="340" rx="48" fill="url(#screen)"/>'))
print("wrote 2 logos")
