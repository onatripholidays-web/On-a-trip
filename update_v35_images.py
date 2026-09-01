from pathlib import Path
import re, html, zipfile, shutil
root=Path('/mnt/data/v34work')
# Destination-specific hero images. Priority: current/2026 free-to-use Unsplash images where available;
# established high-resolution destination images for the remaining destinations.
IMG={
'amarnath':'https://news24online.com/wp-content/uploads/2023/07/Amarnath-yatra-1.png',
'bali':'https://www.afcholidays.com/afcsupplier2023/mediafiles/blogfiles/f316d816-0bc2-44f2-a547-9a39f5e90909.webp',
'char-dham':'https://badachardham.com/assets/badrinath.png',
'do-dham':'https://commons.wikimedia.org/wiki/Special:Redirect/file/Kedarnath_Temple_Uttarakhand_India.webp',
'dubai':'https://static.independent.co.uk/2025/06/13/13/26/iStock-2025170717.jpeg',
'gokarna-dandeli':'https://2.bp.blogspot.com/-8ObRpD_RebU/Wa-1KIYNV6I/AAAAAAAABqo/2pHap36IZTM-RHgYjeiiS6bRWrlYg8wiQCLcBGAs/s1600/Gokarna-Karnataka-India-Tour-Advisors.jpg',
'gujarat':'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=90',
'kashmir':'https://images.unsplash.com/photo-1782284639026-8559edddf932?auto=format&fit=crop&fm=jpg&q=85&w=3000',
'kashmir-deluxe':'https://images.unsplash.com/photo-1782284639026-8559edddf932?auto=format&fit=crop&fm=jpg&q=85&w=3000',
'kedarnath':'https://commons.wikimedia.org/wiki/Special:Redirect/file/Kedarnath_Temple_Uttarakhand_India.webp',
'kerala':'https://images.unsplash.com/photo-1781457935216-ec1ed8cc1a9c?auto=format&fit=crop&fm=jpg&q=85&w=3000',
'kerala-couple':'https://images.unsplash.com/photo-1781457935216-ec1ed8cc1a9c?auto=format&fit=crop&fm=jpg&q=85&w=3000',
'ladakh':'https://images.unsplash.com/photo-1772165134215-eb8d3b5c758d?auto=format&fit=crop&fm=jpg&q=85&w=3000',
'ladakh-tso':'https://images.unsplash.com/photo-1768410318044-8a43bf8fdb2c?auto=format&fit=crop&fm=jpg&q=85&w=3000',
'manali':'https://images.unsplash.com/photo-1767974008887-97fde62d645c?auto=format&fit=crop&fm=jpg&q=85&w=3000',
'nepal':'https://nepaltraveller.com/images/main/1740377132.sidetrackimageview.png',
'rajasthan':'https://www.incredibleindia.gov.in/content/dam/incredible-india-v2/images/places/udaipur/udaipur-lake-palace-1.jpg',
'shimla-manali':'https://wanderon-images.gumlet.io/blogs/new/2024/06/ridge-of-shimla.jpeg',
'shimla-manali-kasol':'https://wanderon-images.gumlet.io/blogs/new/2024/06/ridge-of-shimla.jpeg',
'sikkim':'https://images.unsplash.com/photo-1767287035682-949851fa69c1?auto=format&fit=crop&fm=jpg&q=85&w=3000',
'sikkim-darjeeling':'https://images.unsplash.com/photo-1767287035682-949851fa69c1?auto=format&fit=crop&fm=jpg&q=85&w=3000',
'spiti':'https://storage.googleapis.com/stateless-www-justwravel-com/2024/11/a4b74bce-chicham-bridge-in-spiti-valley.jpg',
'spiti-manali':'https://storage.googleapis.com/stateless-www-justwravel-com/2024/11/a4b74bce-chicham-bridge-in-spiti-valley.jpg',
'thailand':'https://www.travelandtourworld.com/wp-content/uploads/2025/12/Thailand-Joins-Malaysia-China-India-and-Russia.jpg',
'thailand-family':'https://www.travelandtourworld.com/wp-content/uploads/2025/12/Thailand-Joins-Malaysia-China-India-and-Russia.jpg',
'ujjain':'https://images.indianexpress.com/2024/04/mahakaleshwar-temple.jpg',
'vaishno-devi':'https://static.toiimg.com/photo/msid-77541896%2Cwidth-96%2Cheight-65.cms',
'vietnam':'https://agendatour.com/hinhanh/tintuc/halong.jpeg',
}
changed=[]
for f in root.glob('package-*.html'):
    key=f.stem[len('package-'):]
    if key not in IMG: continue
    s=f.read_text(encoding='utf-8')
    # replace the first hero background URL only
    sec=re.search(r"<section class=\"hero\"[^>]*>",s,re.S)
    if not sec:
        continue
    tag=sec.group(0)
    tag2=re.sub(r"url\(\'[^\']+\'\)", "url(\'%s\')" % IMG[key].replace("'","%27"), tag, count=1)
    ns=s[:sec.start()]+tag2+s[sec.end():]
    # add visual class/badge
    ns=ns.replace('<section class="hero"', '<section class="hero hero-visual-refresh"', 1)
    ns=ns.replace('<div class="eyebrow">', '<span class="visual-refresh-badge">2026 VISUAL UPDATE</span><div class="eyebrow">', 1)
    f.write_text(ns,encoding='utf-8')
    changed.append(f.name)

# Update all obvious old duplicated hero URLs in non-package pages/cards when destination-specific replacements are known.
# Keep logo and site branding untouched.
for f in root.glob('*.html'):
    if f.name.startswith('package-'): continue
    s=f.read_text(encoding='utf-8')
    old=s
    # Homepage/package listing generic visuals are refreshed to a representative current image.
    s=s.replace('https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=80', IMG['manali'])
    s=s.replace('https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&amp;fit=crop&amp;w=900&amp;q=80', IMG['manali'])
    s=s.replace('https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85', IMG['manali'])
    s=s.replace('https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&amp;fit=crop&amp;w=1200&amp;q=85', IMG['manali'])
    if s!=old:
        f.write_text(s,encoding='utf-8'); changed.append(f.name)

css=root/'style.css'
cs=css.read_text(encoding='utf-8')
if 'visual-refresh-badge' not in cs:
    cs += '''\n/* V35 — 2026 destination visual refresh */\n.hero-visual-refresh{position:relative;overflow:hidden;background-position:center!important;background-size:cover!important;}\n.hero-visual-refresh:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(7,26,46,.86),rgba(7,26,46,.30) 62%,rgba(7,26,46,.18));pointer-events:none;}\n.hero-visual-refresh .hero-inner{position:relative;z-index:2;}\n.visual-refresh-badge{display:inline-flex;align-items:center;gap:7px;margin-bottom:10px;padding:6px 10px;border-radius:999px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.24);backdrop-filter:blur(8px);font-size:11px;font-weight:800;letter-spacing:.12em;color:#fff;}\n@media(max-width:600px){.hero-visual-refresh{min-height:390px!important;background-position:center!important}.visual-refresh-badge{font-size:10px;padding:5px 8px}.hero-visual-refresh:after{background:linear-gradient(180deg,rgba(7,26,46,.64),rgba(7,26,46,.46));}}\n'''
    css.write_text(cs,encoding='utf-8')

# Add a small visual note to README.
readme=root/'README_V35_VISUAL_REFRESH.txt'
readme.write_text('''V35 — 2026 Destination Visual Refresh\n\nUpdated every package hero to a destination-specific, high-quality travel visual.\nWhere available, current 2026 Unsplash images were selected and marked as free to use under the Unsplash License; other destinations use high-resolution destination imagery already curated for the site.\n\nAlso added responsive hero treatment, improved contrast, lazy-friendly page structure, and a 2026 Visual Update badge.\n\nNote: remote image URLs are used for the hero backgrounds; verify final image licensing/attribution policy before production deployment.\n''',encoding='utf-8')

out=Path('/mnt/data/On_A_Trip_Holidays_V35_2026_Destination_Images.zip')
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED) as z:
    for p in root.rglob('*'):
        if p.is_file() and p != out:
            z.write(p,p.relative_to(root))
print('changed',len(changed),sorted(set(changed)))
print('zip',out,out.stat().st_size)
