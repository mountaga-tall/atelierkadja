#!/usr/bin/env python3
"""Audit local HTML links and media references for Atelier Kadja."""
from pathlib import Path
from html import unescape
import re, sys

ROOT = Path(__file__).resolve().parents[1]
HTML = sorted(ROOT.glob("*.html"))
missing = []
broken_html = []

for page in HTML:
    text = page.read_text(encoding="utf-8", errors="replace")
    for href in re.findall(r'href=["\']([^"\']+)', text, flags=re.I):
        href = unescape(href).split("#", 1)[0].split("?", 1)[0]
        if not href or "://" in href or href.startswith(("mailto:", "tel:", "javascript:")):
            continue
        target = (page.parent / href).resolve()
        if href.lower().endswith((".html", ".htm")) and not target.exists():
            broken_html.append((page.name, href))
    for src in re.findall(r'(?:src|poster|data-gallery-src)=["\']([^"\']+)', text, flags=re.I):
        src = unescape(src).split("#", 1)[0].split("?", 1)[0]
        if not src or "://" in src or src.startswith("data:"):
            continue
        target = (page.parent / src).resolve()
        if not target.exists():
            missing.append((page.name, src))

print(f"HTML pages: {len(HTML)}")
print(f"Broken local HTML links: {len(broken_html)}")
for page, href in broken_html:
    print(f"  {page}: {href}")
print(f"Missing local media/assets: {len(missing)}")
for page, src in sorted(missing):
    print(f"  {page}: {src}")

sys.exit(1 if broken_html else 0)
