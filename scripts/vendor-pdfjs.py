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
# pdfjs-dist 6.4.299 embeds core-js and ships the QuickJS sandbox. Supply
# the MIT notices that are not included as text files in the npm archive.
EXTRA_NOTICES = {
    "LICENSE_CORE_JS": (
        "https://raw.githubusercontent.com/zloirock/core-js/v3.50.0/LICENSE",
        "b87653fff2d44426ab5cd4723cee3b1364dc8d35a0acdf098c54689543123bf8",
    ),
    "wasm/LICENSE_QUICKJS": (
        "https://raw.githubusercontent.com/bellard/quickjs/3d5e064e9dd67c70f7962836505a7fa067bf0a4e/LICENSE",
        "598fd7fc928e4350abce36e337ba5a1346923c5c692f5be92c3d8e29ddd7c18d",
    ),
    "wasm/LICENSE_PDFJS_QUICKJS": (
        "https://raw.githubusercontent.com/mozilla/pdf.js.quickjs/e2c5bfc8194b16f5973eea5e4e025b67be3c1015/LICENSE",
        "7fdaed3d938f3dfce7189db07e74773c23789143a55db81a95d09dcbfda267b0",
    ),
}

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

for name, (url, digest) in EXTRA_NOTICES.items():
    notice = urllib.request.urlopen(url, timeout=60).read()
    if hashlib.sha256(notice).hexdigest() != digest:
        raise RuntimeError(f"{name}: upstream notice does not match the pinned SHA-256.")
    (DEST / name).write_bytes(notice)
    count += 1

(DEST / "VERSION").write_text(
    f"PDF.js / pdfjs-dist {VERSION}\n"
    f"Source: {URL}\nSHA-512: {INTEGRITY}\n"
    "License: Apache-2.0 (see LICENSE and asset-specific notices)\n"
)
print(f"Vendored {count} PDF.js runtime/license files. No book files are read.")
