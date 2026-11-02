# Bring It To Life

`index.html` is Greg's Bring It To Life website, built as a Claude artifact and served as a static site at https://bringittolife.info and https://bringittolife.org. Unlike the other prototypes, it is live and changes whenever Greg wants his latest artifact published. It is not part of the SaveWave app.

## Provenance

| Fact | Value |
|---|---|
| Source | https://claude.ai/artifact/6Pp9aE5NvNvnsLzRYQuooL (public share link to artifact `2bad1cb3-2ac7-4089-9164-450d54c56167`) |
| Imported | 2026-10-29, by Roman, from frame version `1793115625-2792` |
| Author | Greg, who sent the link on 2026-10-29 |
| Film | `bil-film-v3.mp4` (61 s, 1080p, 11.7 MB) and `bil-film-v3-poster.jpg`, which the home page's `<video>` loads from beside `index.html`. The artifact refers to them but doesn't contain them; Greg emailed them on 2026-10-31 and they went live on 2026-11-02 |

The page is the artifact byte for byte, with one change: Claude's frame runtime (everything up to `<!-- /frame-runtime -->`) is replaced by `<!doctype html><html lang="en"><head>`. Outside Claude, `window.claude` is absent, so badge downloads use the page's own browser fallback. Visitors' choices stay in their `localStorage` under `bil:` keys.

## Hosting

| Piece | Setting |
|---|---|
| Vercel | Team `handprinter`, project `bring-it-to-life`, no Git connection; also at https://bring-it-to-life.vercel.app |
| Domains | `bringittolife.info` (2026-10-29) and `bringittolife.org` (2026-10-30, Greg's request), both registered at Network Solutions in Greg's account (the same login as savewave.global). Each apex serves the site; each `www` redirects to its own apex with a 308. Neither redirects to the other, because Greg may move `.info` to science and modeling later |
| DNS | The same for both: A `@` → `216.150.1.1` and `216.150.16.1`, CNAME `www` → `a64b06bc47c50eeb.vercel-dns-016.com`, TTL 1 hour. On `.info`, the parked "Hosting service" had to be unassigned first; until it let go (a few hours), it pinned `@` to the Under Construction page |
| Not connected | `bringittolife.site`, `.online`, `.fun` and `.solutions`, also in Greg's account |

## Publish Greg's latest version

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
