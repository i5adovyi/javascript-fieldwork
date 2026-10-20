#!/usr/bin/env python3
"""Keep the existing open-source UI fonts local, with their licenses."""
import hashlib
import json
from pathlib import Path
import re
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "dist" / "vendor" / "fonts"
SOURCE = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;450;500;550;600;650;700&family=Manrope:wght@400;500;600;650;700;750;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"

def get(url):
    return urllib.request.urlopen(
        urllib.request.Request(url, headers={"User-Agent": AGENT}), timeout=60
    ).read()

DEST.mkdir(parents=True, exist_ok=True)
css = get(SOURCE).decode()
sources = {}
for url in sorted(set(re.findall(r"url\((https://fonts\.gstatic\.com/[^)]+)\)", css))):
    content = get(url)
    suffix = Path(url).suffix
    name = hashlib.sha256(content).hexdigest()[:20] + suffix
    (DEST / name).write_bytes(content)
    sources[name] = url
    css = css.replace(url, "./" + name)

for family in ["dmsans", "manrope", "ibmplexmono"]:
    url = f"https://raw.githubusercontent.com/google/fonts/main/ofl/{family}/OFL.txt"
    (DEST / f"{family}-OFL.txt").write_bytes(get(url))
(DEST / "fonts.css").write_text(
    "/* Locally bundled Google Fonts; SIL Open Font License notices are alongside this file. */\n" + css
)
(DEST / "sources.json").write_text(json.dumps({"stylesheet": SOURCE, "files": sources}, indent=2) + "\n")
print(f"Bundled {len(sources)} font files and all three SIL OFL notices.")
