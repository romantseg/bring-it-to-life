// Upload page backend: checks the password, tidies Greg's index.html and commits it
// to main, which makes Vercel deploy the site. Env: PUBLISH_PASSWORD, GITHUB_PUBLISH_TOKEN.
import { createHash, timingSafeEqual } from "node:crypto";

const FILE_URL = "https://api.github.com/repos/romantseg/bring-it-to-life/contents/index.html";
const MAX_BYTES = 4_000_000; // Vercel caps request bodies at 4.5 MB

const sha256 = (s) => createHash("sha256").update(s).digest();
const gitBlobSha = (buf) =>
  createHash("sha1").update(`blob ${buf.length}\0`).update(buf).digest("hex");

function tidy(html) {
  let out = html.replace(/^﻿/, "").replace(/\r\n?/g, "\n");
  // Tell browsers and screen readers the page is English, unless the file already says.
  out = out.replace(/<html(?![^>]*\blang\s*=)([^>]*)>/i, '<html lang="en"$1>');
  return out;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Use the upload page." });

  const { password, html } = req.body ?? {};
  const expected = process.env.PUBLISH_PASSWORD ?? "";
  if (
    typeof password !== "string" ||
    !expected ||
    !timingSafeEqual(sha256(password), sha256(expected))
  ) {
    return res.status(401).json({ error: "That password isn't right." });
  }

  if (typeof html !== "string" || !/<html[\s>]/i.test(html) || !/<\/html>/i.test(html)) {
    return res.status(400).json({ error: "That doesn't look like a full web page (index.html)." });
  }
  const content = Buffer.from(tidy(html), "utf8");
  if (content.length > MAX_BYTES) {
    return res.status(413).json({ error: "That file is too big (over 4 MB)." });
  }

  const headers = {
    Authorization: `Bearer ${process.env.GITHUB_PUBLISH_TOKEN}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "bring-it-to-life-publish",
  };
  const current = await fetch(`${FILE_URL}?ref=main`, { headers });
  if (!current.ok) {
    console.error("read index.html", current.status, await current.text());
    return res.status(502).json({ error: "Couldn't reach GitHub. Try again in a minute." });
  }
  const { sha } = await current.json();
  if (sha === gitBlobSha(content)) {
    return res.json({ unchanged: true });
  }

  const put = await fetch(FILE_URL, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      message: "Publish index.html from the upload page",
      content: content.toString("base64"),
      sha,
      branch: "main",
    }),
  });
  if (!put.ok) {
    console.error("write index.html", put.status, await put.text());
    return res.status(502).json({ error: "GitHub didn't accept the file. Try again in a minute." });
  }
  const { commit } = await put.json();
  return res.json({ commit: commit.html_url });
}
