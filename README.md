# Bring It To Life

Greg Norris's Bring It To Life website, live at https://bringittolife.info and https://bringittolife.org. Greg builds it as a Claude artifact; this repo holds the published copy. Every commit to `main` deploys it.

| File | What it is |
|---|---|
| `index.html` | The whole site, one file. The only file that changes on a normal update |
| `publish/index.html`, `api/publish.mjs` | The upload page Greg uses to publish a new `index.html`, and the function behind it |
| `bil-film-v3.mp4`, `bil-film-v3-poster.jpg` | The home page film (61 s, 1080p) and its poster. The page loads them from beside `index.html`, so keep them on every update |

## Update the site

**Greg:** open https://bringittolife.org/publish, enter the password Roman gave you, paste the page's code from Claude (or choose the downloaded `index.html`) and click **Publish**. The site updates in about a minute; the film stays as it is.

**Roman:** the same page, or replace `index.html` in a clone and push to `main`.

The upload page (`publish/index.html`) sends the file to `api/publish.mjs`, a Vercel function that checks the password, makes sure the file is a whole page, converts CRLF line endings to LF, adds `lang="en"` to `<html>` if it's missing, and commits the file to `main` through the GitHub API. If the file matches what's live, it changes nothing. It only ever replaces `index.html`. Commits from the page are made as Roman and say "Publish index.html from the upload page".

| Vercel env var (production) | What it is |
|---|---|
| `PUBLISH_PASSWORD` | The password Greg types. Roman keeps a copy. To change it, replace it in Vercel and redeploy |
| `GITHUB_PUBLISH_TOKEN` | A fine-grained GitHub token of Roman's, created 2026-11-16 with no expiry: only this repo, Contents read and write. If it's revoked, make a new one the same way, replace it in Vercel and redeploy |

`.gitattributes` also keeps line endings LF for commits from a clone.

To undo a mistake, upload the previous `index.html`, or revert the commit on GitHub. Each deploy also stays in Vercel, where **Promote to Production** on an older one rolls the site back at once.

## Hosting

| Piece | Setting |
|---|---|
| GitHub | `romantseg/bring-it-to-life`, public. Moved here on 2026-11-16 from `prototypes/bring-it-to-life/` in SaveWave, with its history |
| Vercel | Team `handprinter`, project `bring-it-to-life`, connected to this repo: production branch `main`, no build step, files served from the repo root. Also at https://bring-it-to-life.vercel.app |
| Who can deploy | Anyone with the upload page's password, or who can commit to `main`. Vercel blocks commits by non-members of the team only on private repos; this repo is public, so a GitHub collaborator would need no Vercel seat either. Checked 2026-11-16: a commit by an author with no GitHub or Vercel account deployed without approval. Pushes to other branches make preview deploys |
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
