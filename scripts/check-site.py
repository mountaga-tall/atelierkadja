#!/usr/bin/env python3
"""Atelier Kadja static audit: links, media, locale hygiene and basic accessibility."""
from pathlib import Path
from html import unescape
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
HTML = sorted(ROOT.rglob("*.html"))

LOCAL_PREFIXES = ("/", "#")
SKIP_SCHEMES = ("mailto:", "tel:", "javascript:", "data:")
HREF_RE = re.compile(r'href=["\']([^"\']+)', re.I)
SRC_RE = re.compile(r'(?:src|poster|data-gallery-src)=["\']([^"\']+)', re.I)
ATTR_RE = re.compile(r'\b(?:alt|aria-label|title|placeholder|content)=["\']([^"\']*)', re.I)
LANG_RE = re.compile(r'<html\b[^>]*\blang=["\']([^"\']+)', re.I)
BASE_RE = re.compile(r'<base\s+href=["\']([^"\']+)', re.I)
ID_RE = re.compile(r'\bid=["\']([^"\']+)', re.I)

FR_ON_EN = re.compile(
    r'(Ouvrir la gallery|Voir la gallery|\bAccueil\b|\bNouveautés\b|\bLa Maison\b|'
    r'\bSur mesure\b|\bCommander\b|\bDécouvrir\b|\bExplorer\b|\bÀ venir\b|'
    r'\bChaque\b|\bgarde\b|\btoutes?\b|\bses\b|\bsa\b|\bavec\b|\bdans\b|'
    r'\bsans\b|\bcette\b|\bmise en avant\b|\bactuellement\b|\bAtypiques\b|'
    r'\bBrodés\b|\bmodèles?\b|\bcoloris\b|\bgalerie\b|\bvisuels?\b|'
    r'\baperçu\b|\bvue\s*\d+\b|\bprix sur demande\b|\bPlan du site\b|'
    r'\bService sur mesure\b|\brendez-vous\b|\bprojets personnalisés\b)',
    re.I,
)
EN_ON_FR = re.compile(
    r'(Open the gallery|View the gallery|\bHome\b|\bNew arrivals\b|\bThe House\b|'
    r'\bMade-to-measure\b|\bOrder\b|\bDiscover\b|\bExplore\b|'
    r'\bFull name\b|\bYour message\b|Send on WhatsApp|\bpreview\b)',
    re.I,
)

def source_base(page: Path, text: str) -> Path:
    base = page.parent
    m = BASE_RE.search(text)
    if not m:
        return base
    href = unescape(m.group(1))
    if href == "../":
        return ROOT
    if href.startswith("/"):
        return (ROOT / href.lstrip("/")).resolve()
    return (page.parent / href).resolve()

def resolve_local(page: Path, text: str, ref: str) -> Path:
    ref = unescape(ref).split("#", 1)[0].split("?", 1)[0]
    base = source_base(page, text)
    if ref.startswith("/"):
        return (ROOT / ref.lstrip("/")).resolve()
    return (base / ref).resolve()

def user_content(text: str) -> str:
    # User-facing text plus accessibility/meta text. Keep JSON-LD out of this pass.
    stripped = re.sub(
        r'<script\b[\s\S]*?</script>|<style\b[\s\S]*?</style>|<!--[\s\S]*?-->',
        " ",
        text,
        flags=re.I,
    )
    body = re.sub(r'<[^>]+>', ' ', stripped)
    attrs = " ".join(ATTR_RE.findall(stripped))
    return unescape(body + " " + attrs)

broken_links = []
missing_media = []
language_errors = []
bad_lang = []
missing_alt = []
duplicate_ids = []
wrong_locale_links = []
media_css_errors = []
service_worker_errors = []

for page in HTML:
    text = page.read_text(encoding="utf-8", errors="replace")
    rel = page.relative_to(ROOT).as_posix()
    expected = "en" if rel.startswith("en/") else "fr" if rel.startswith("fr/") else None

    if expected:
        lang = (LANG_RE.search(text).group(1).lower() if LANG_RE.search(text) else "")
        if lang != expected:
            bad_lang.append((rel, lang, expected))

        content = user_content(text)
        if expected == "en" and FR_ON_EN.search(content):
            language_errors.append((rel, FR_ON_EN.search(content).group(0)))
        if expected == "fr" and EN_ON_FR.search(content):
            language_errors.append((rel, EN_ON_FR.search(content).group(0)))

        hrefs = HREF_RE.findall(text)
        if any(h.startswith("/fr/") for h in hrefs) and expected == "en":
            wrong_locale_links.append((rel, "FR link"))
        if any(h.startswith("/en/") for h in hrefs) and expected == "fr":
            wrong_locale_links.append((rel, "EN link"))

    for tag in re.findall(r'<img\b[^>]*>', text, flags=re.I):
        if not re.search(r'\balt=["\']', tag, re.I):
            missing_alt.append(rel)

    for href in HREF_RE.findall(text):
        if not href or href.startswith(SKIP_SCHEMES) or href.startswith("#") or "://" in href:
            continue
        target = resolve_local(page, text, href)
        clean = href.lower().split("?", 1)[0]
        if clean.endswith((".html", ".htm")) and not target.exists():
            broken_links.append((rel, href))

    for src in SRC_RE.findall(text):
        if not src or src.startswith(SKIP_SCHEMES) or "://" in src:
            continue
        target = resolve_local(page, text, src)
        if not target.exists():
            missing_media.append((rel, src))

    seen = set()
    for ident in ID_RE.findall(text):
        if ident in seen:
            duplicate_ids.append((rel, ident))
        seen.add(ident)

print(f"HTML pages: {len(HTML)}")
print(f"Broken local HTML links: {len(broken_links)}")
print(f"Missing local media/assets: {len(missing_media)}")
print(f"Language leaks: {len(language_errors)}")
print(f"Wrong-locale internal links: {len(wrong_locale_links)}")
print(f"Bad/missing lang attributes: {len(bad_lang)}")
print(f"Images without alt: {len(missing_alt)}")
print(f"Duplicate IDs: {len(duplicate_ids)}")

# CSS/media invariants: photos must never be crop-filled by the site CSS.
css_path = ROOT / "styles.css"
if css_path.exists():
    css = css_path.read_text(encoding="utf-8", errors="replace")
    if not re.search(r'main\s+img[^}]*object-fit\s*:\s*contain\s*!important', css, re.I | re.S):
        media_css_errors.append("styles.css: missing global uncropped main img rule")
    if re.search(r'\.editorial-quick-card\s+img[^}]*object-fit\s*:\s*cover', css, re.I | re.S):
        media_css_errors.append("styles.css: editorial quick-card photos still use object-fit:cover")

sw_path = ROOT / "sw.js"
if sw_path.exists():
    sw = sw_path.read_text(encoding="utf-8", errors="replace")
    if "caches.match('./index.html')" in sw and "isDocumentRequest(request)" in sw:
        service_worker_errors.append("sw.js: document offline fallback still points to index.html")

for label, items in (
    ("BROKEN LINK", broken_links),
    ("MISSING MEDIA", missing_media),
    ("LANGUAGE", language_errors),
    ("WRONG LOCALE LINK", wrong_locale_links),
    ("LANG", bad_lang),
    ("ALT", missing_alt),
    ("DUPLICATE ID", duplicate_ids),
    ("MEDIA CSS", media_css_errors),
    ("SERVICE WORKER", service_worker_errors),
):
    for item in items:
        print(f"{label}: {item}")

sys.exit(1 if (
    broken_links or missing_media or language_errors or
    wrong_locale_links or bad_lang or missing_alt or duplicate_ids or
    media_css_errors or service_worker_errors
) else 0)
