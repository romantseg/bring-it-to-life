# Bring It To Life

Greg Norris's Bring It To Life website, live at https://bringittolife.info and https://bringittolife.org. Greg builds it as a Claude artifact; this repo holds the published copy. Every commit to `main` deploys it.

| File | What it is |
|---|---|
| `index.html` | The whole site, one file. The only file that changes on a normal update |
| `bil-film-v3.mp4`, `bil-film-v3-poster.jpg` | The home page film (61 s, 1080p) and its poster. The page loads them from beside `index.html`, so keep them on every update |

## Update the site

**Greg, in the browser:** open https://github.com/romantseg/bring-it-to-life, choose **Add file → Upload files**, drop in the new `index.html` (the name must stay exactly `index.html`), and click **Commit changes**. The site updates in about a minute. Leave the two film files alone.

**Roman:** the same, or replace `index.html` in a clone and push to `main`.

Before uploading, check the file:

- It starts with `<html lang="en">`. Greg's emailed files have had a bare `<html>`; add `lang="en"` so screen readers and translation tools know the page is English.
- Line endings don't matter. A file saved on Windows has CRLF endings; browsers don't care, and `.gitattributes` turns them into LF when you commit from a clone (a browser upload stores the file as it is).

To undo a mistake, open the commit list on GitHub and revert the commit, or upload the previous `index.html` again. Each deploy also stays in Vercel, where **Promote to Production** on an older one rolls the site back at once.

## Hosting

| Piece | Setting |
|---|---|
| GitHub | `romantseg/bring-it-to-life`, public. Moved here on 2026-11-16 from `prototypes/bring-it-to-life/` in SaveWave, with its history |
| Vercel | Team `handprinter`, project `bring-it-to-life`, connected to this repo: production branch `main`, no build step, files served from the repo root. Also at https://bring-it-to-life.vercel.app |
| Domains | `bringittolife.info` (2026-10-29) and `bringittolife.org` (2026-10-30, Greg's request), both registered at Network Solutions in Greg's account. Each apex serves the site; each `www` redirects to its own apex with a 308. Neither redirects to the other, because Greg may move `.info` to science and modeling later |
| DNS | The same for both: A `@` → `216.150.1.1` and `216.150.16.1`, CNAME `www` → `a64b06bc47c50eeb.vercel-dns-016.com`, TTL 1 hour |
| Not connected | `bringittolife.site`, `.online`, `.fun` and `.solutions`, also in Greg's account |

## What the page does

Visitors' choices stay in their browser's `localStorage` under `bil:` keys. Outside Claude, `window.claude` is absent, so badge downloads use the page's own browser fallback.

Since 2026-11-04 the page also sends anonymous records to Greg's Google Sheet through a Google Apps Script web app (`BITL_API` in the page): constellations joined or left, ways of caring, proposals, a random browser ID and a visit per `?src=` tag. It reads totals back for the Results page (`#results`, or `#results-<tag>`). `?src=mtl` tags a visitor for 7 days as coming from the Montréal talk and shows a welcome banner. When checking the page in a browser, block `script.google.com` so test visits don't count.

## History

| Date | Version |
|---|---|
| 2026-10-29 | Imported from the artifact share link https://claude.ai/artifact/6Pp9aE5NvNvnsLzRYQuooL, frame version `1793115625-2792` |
| 2026-11-02 | Frame version `1793478422-bd1f`, which adds French; film and poster (emailed 2026-10-31) go live |
| 2026-11-04 | Greg's emailed standalone file for his Montréal talk (anonymous counts, Results page, talk banner), then that afternoon his fix for the French diagrams |

If Greg sends a share link instead of a file, rebuild `index.html` from the artifact frame: open the link in a browser, copy the `src` of the artifact iframe (`https://<uuid>.frame.claudeusercontent.com/_f/<version>/…`; claude.ai sits behind a Cloudflare check, so this needs a browser), then:

```bash
curl -s -H 'Sec-Fetch-Dest: iframe' -H 'Referer: https://claude.ai/' '<iframe src>' \
  | python3 -I -c "import sys; s=sys.stdin.read(); m='<!-- /frame-runtime -->'; sys.stdout.write('<!doctype html>\n<html lang=\"en\"><head>' + s[s.index(m)+len(m):])" \
  > index.html
```

That swaps Claude's frame runtime (everything up to `<!-- /frame-runtime -->`) for a plain document head. Preview with `python3 -m http.server 4173`, then commit and push.
