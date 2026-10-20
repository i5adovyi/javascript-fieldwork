#!/usr/bin/env python3
"""Reproduce the local PDF.js runtime; never reads a learner's book."""
import base64
import hashlib
import io
from pathlib import Path, PurePosixPath
import tarfile
import urllib.request

VERSION = "6.4.299"
INTEGRITY = "AVl138zALtfaAPvADulE0PZThbYzCBS79nL4pOSL/6Sm/4AH5A21BD9VHt97OlCuzJuCpmeZtAtkinisF4Vb1g=="
URL = f"https://registry.npmjs.org/pdfjs-dist/-/pdfjs-dist-{VERSION}.tgz"
DEST = Path(__file__).resolve().parents[1] / "dist" / "vendor" / "pdfjs"
RENAMES = {
    "package/legacy/build/pdf.min.mjs": "pdf.mjs",
    "package/legacy/build/pdf.worker.min.mjs": "pdf.worker.mjs",
    "package/web/pdf_viewer.css": "pdf_viewer.css",
    "package/LICENSE": "LICENSE",
}
PREFIXES = ("package/cmaps/", "package/standard_fonts/", "package/wasm/")

archive = urllib.request.urlopen(URL, timeout=60).read()
actual = base64.b64encode(hashlib.sha512(archive).digest()).decode()
if actual != INTEGRITY:
    raise RuntimeError("PDF.js package integrity does not match the pinned release.")

count = 0
with tarfile.open(fileobj=io.BytesIO(archive), mode="r:gz") as package:
    for member in package.getmembers():
        if not member.isfile():
            continue
        destination = RENAMES.get(member.name)
        if destination is None and member.name.startswith(PREFIXES):
            destination = member.name.removeprefix("package/")
        if destination is None:
            continue
        relative = PurePosixPath(destination)
        if relative.is_absolute() or ".." in relative.parts:
            raise RuntimeError("Unexpected archive path.")
        path = DEST.joinpath(*relative.parts)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(package.extractfile(member).read())
        count += 1

(DEST / "VERSION").write_text(
    f"PDF.js / pdfjs-dist {VERSION}\n"
    f"Source: {URL}\nSHA-512: {INTEGRITY}\n"
    "License: Apache-2.0 (see LICENSE and asset-specific notices)\n"
)
print(f"Vendored {count} PDF.js runtime/license files. No book files are read.")
