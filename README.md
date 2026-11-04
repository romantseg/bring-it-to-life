# Bring It To Life

`index.html` is Greg's Bring It To Life website, built as a Claude artifact and served as a static site at https://bringittolife.info and https://bringittolife.org. Unlike the other prototypes, it is live and changes whenever Greg wants his latest artifact published. It is not part of the SaveWave app.

## Provenance

| Fact | Value |
|---|---|
| Source | https://claude.ai/artifact/6Pp9aE5NvNvnsLzRYQuooL (public share link to artifact `2bad1cb3-2ac7-4089-9164-450d54c56167`) |
| Imported | 2026-10-29, by Roman, from frame version `1793115625-2792`; updated 2026-11-02 to `1793478422-bd1f` (adds French), at Greg's request; replaced 2026-11-04 by the standalone `index.html` Greg emailed for his Montréal talk (anonymous counts, Results page, talk banner), then that afternoon by his emailed fix for the French diagrams (labels wrap or shrink to fit their boxes) |
| Author | Greg, who sent the link on 2026-10-29 |
| Film | `bil-film-v3.mp4` (61 s, 1080p, 11.7 MB) and `bil-film-v3-poster.jpg`, which the home page's `<video>` loads from beside `index.html`. The artifact refers to them but doesn't contain them; Greg emailed them on 2026-10-31 and they went live on 2026-11-02 |

The page is Greg's file byte for byte, with `lang="en"` added to `<html>`; a file taken from the artifact frame also has Claude's frame runtime (everything up to `<!-- /frame-runtime -->`) replaced by `<!doctype html><html lang="en"><head>`. Outside Claude, `window.claude` is absent, so badge downloads use the page's own browser fallback. Visitors' choices stay in their `localStorage` under `bil:` keys.

Since 2026-11-04 the page also sends anonymous records to Greg's Google Sheet through a Google Apps Script web app (`BITL_API` in the page): constellations joined or left, ways of caring, proposals, a random browser ID and a visit per `?src=` tag. It reads totals back for the Results page (`#results`, or `#results-<tag>`). `?src=mtl` tags a visitor for 7 days as coming from the Montréal talk and shows a welcome banner. When checking the page in a browser, block `script.google.com` so test visits don't count.

## Hosting

| Piece | Setting |
|---|---|
| Vercel | Team `handprinter`, project `bring-it-to-life`, no Git connection; also at https://bring-it-to-life.vercel.app |
| Domains | `bringittolife.info` (2026-10-29) and `bringittolife.org` (2026-10-30, Greg's request), both registered at Network Solutions in Greg's account (the same login as savewave.global). Each apex serves the site; each `www` redirects to its own apex with a 308. Neither redirects to the other, because Greg may move `.info` to science and modeling later |
| DNS | The same for both: A `@` → `216.150.1.1` and `216.150.16.1`, CNAME `www` → `a64b06bc47c50eeb.vercel-dns-016.com`, TTL 1 hour. On `.info`, the parked "Hosting service" had to be unassigned first; until it let go (a few hours), it pinned `@` to the Under Construction page |
| Not connected | `bringittolife.site`, `.online`, `.fun` and `.solutions`, also in Greg's account |

## Publish Greg's latest version

If Greg emails the file, use it: the Gmail connector can't download attachments, so fetch the message with `messageFormat: RAW`, decode the MIME part named `index.html`, convert its CRLF line endings to LF and add `lang="en"`, then go to step 4. Otherwise rebuild it from the share link:

1. Open the share link in a browser and check it shows the version Greg wants live. If he started a new artifact, use its link instead.
2. Copy the `src` of the page's artifact iframe (`https://<uuid>.frame.claudeusercontent.com/_f/<version>/…`). claude.ai's API sits behind a Cloudflare check, so this step needs a browser.
3. Rebuild `index.html` from it, leaving the two film files in place:

   ```bash
   curl -s -H 'Sec-Fetch-Dest: iframe' -H 'Referer: https://claude.ai/' '<iframe src>' \
     | python3 -I -c "import sys; s=sys.stdin.read(); m='<!-- /frame-runtime -->'; sys.stdout.write('<!doctype html>\n<html lang=\"en\"><head>' + s[s.index(m)+len(m):])" \
     > index.html
   ```

4. Preview it with `python3 -m http.server 4173`, then deploy from this folder: `npx vercel@latest deploy --prod --scope handprinter`.

`.vercel/` and the CLI's `.env.local` are gitignored. On a fresh clone, link first: `npx vercel@latest link --scope handprinter --project bring-it-to-life`.
