const SOURCE_URL =
  'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/d01-1.html';
const MHLW_BASE_URL = 'https://www.mhlw.go.jp';
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const SUBSIDY_COURSES = [
  {
    id: 'jinzai',
    name: '人材育成支援コース',
    description: '社員の職業訓練・定額制訓練などの経費・賃金助成',
    section_keyword: '人材育成支援コース',
    specs: [
      { label: '概要リーフレット', must_include: ['人材育成支援コース', '4月8日'], must_exclude: ['5月14日', 'Q', 'A'] },
      { label: '詳細版パンフレット', must_include: ['人材育成支援コース', '5月14日'], must_exclude: ['Q', 'A'] },
      { label: '事業主Q&A', must_include: ['人材育成支援コース', 'Q', 'A'], must_exclude: ['賃金要件'] },
    ],
  },
  {
    id: 'kyuka',
    name: '教育訓練休暇等付与コース',
    description: '教育訓練休暇制度の導入・運用に関する助成',
    section_keyword: '教育訓練休暇等付与コース',
    specs: [
      { label: '詳細版パンフレット', must_include: ['教育訓練休暇等付与コース', 'ご案内', '4月8日'], must_exclude: [] },
      { label: '支給要領', must_include: ['支給要領'], must_exclude: [] },
      { label: '事業主Q&A', must_include: ['教育訓練休暇等付与コース', 'Q', 'A'], must_exclude: ['賃金要件'] },
    ],
  },
  {
    id: 'toushi',
    name: '人への投資促進コース',
    description: '長時間労働の改善と能力開発を両立する訓練助成',
    section_keyword: '人への投資促進コース',
    specs: [
      { label: '概要リーフレット', must_include: ['人への投資促進コース', '4月8日'], must_exclude: ['5月14日', 'Q', 'A', '教育訓練休暇等付与'] },
      { label: '詳細版パンフレット', must_include: ['人への投資促進コース', '5月14日'], must_exclude: ['Q', 'A'] },
      { label: '事業主Q&A', must_include: ['人への投資促進コース', 'Q', 'A'], must_exclude: ['賃金要件'] },
    ],
  },
  {
    id: 'reskilling',
    name: '事業展開等リスキリング支援コース',
    description: '新規事業展開に伴うリスキリング訓練の助成',
    section_keyword: '事業展開等リスキリング支援コース',
    specs: [
      { label: '概要リーフレット', must_include: ['事業展開等リスキリング支援コース', '4月8日'], must_exclude: ['5月14日', 'Q', 'A', '活用'] },
      { label: '詳細版パンフレット', must_include: ['事業展開等リスキリング支援コース', '5月14日'], must_exclude: ['Q', 'A', '活用'] },
      { label: '活用事例集', must_include: ['活用事例'], must_exclude: [] },
    ],
  },
];

function normalizeDigits(text) {
  return String(text).replace(/[０-９]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0));
}

function normalizeText(text) {
  return normalizeDigits(
    String(text)
      .replace(/<[^>]+>/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

function parsePortalLinks(html, baseUrl) {
  const links = [];
  const seen = new Set();
  const parts = html.split(/<h3\b[^>]*>/i);

  for (let i = 1; i < parts.length; i++) {
    const chunk = parts[i];
    const headingEnd = chunk.search(/<\/h3>/i);
    if (headingEnd < 0) continue;

    const section = normalizeText(chunk.slice(0, headingEnd));
    const rest = chunk.slice(headingEnd);
    const anchorRe = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
    let match;

    while ((match = anchorRe.exec(rest)) !== null) {
      const href = match[1];
      const title = normalizeText(match[2]);
      const lower = href.toLowerCase();
      if (!lower.includes('/content/') || !lower.endsWith('.pdf')) continue;

      let absoluteUrl;
      try {
        absoluteUrl = new URL(href, baseUrl).href;
      } catch {
        continue;
      }
      if (seen.has(absoluteUrl)) continue;
      seen.add(absoluteUrl);
      links.push({ section, title, url: absoluteUrl });
    }
  }

  return links;
}

function linkMatchesSpec(link, spec) {
  const haystack = normalizeText(`${link.section} ${link.title}`);
  if (spec.must_include.length && !spec.must_include.every((kw) => haystack.includes(normalizeDigits(kw)))) {
    return false;
  }
  if (spec.must_exclude.length && spec.must_exclude.some((kw) => haystack.includes(normalizeDigits(kw)))) {
    return false;
  }
  return true;
}

function belongsToCourse(link, course) {
  const haystack = normalizeText(`${link.section} ${link.title}`);
  return haystack.includes(normalizeDigits(course.section_keyword));
}

function pickGuideLink(links, course, spec) {
  const candidates = links.filter((link) => belongsToCourse(link, course) && linkMatchesSpec(link, spec));
  return candidates[0] || null;
}

function buildCatalog(links) {
  const checkedAt = new Date().toISOString();
  const catalog = [];

  for (const course of SUBSIDY_COURSES) {
    for (const spec of course.specs) {
      const link = pickGuideLink(links, course, spec);
      if (!link) {
        catalog.push({
          course_id: course.id,
          course_name: course.name,
          course_description: course.description,
          label: spec.label,
          url: '',
          source_title: '',
          status: 'unavailable',
          error: '厚労省ページに該当資料がありません',
          checked_at: checkedAt,
        });
        continue;
      }

      catalog.push({
        course_id: course.id,
        course_name: course.name,
        course_description: course.description,
        label: spec.label,
        url: link.url,
        source_title: link.title,
        status: 'ready',
        checked_at: checkedAt,
      });
    }
  }

  return catalog;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });

  try {
    const response = await fetch(SOURCE_URL, {
      headers: { 'User-Agent': USER_AGENT },
    });
    if (!response.ok) {
      return res.status(502).json({ error: `厚労省ページの取得に失敗しました (${response.status})` });
    }

    const html = await response.text();
    const links = parsePortalLinks(html, MHLW_BASE_URL);
    const catalog = buildCatalog(links);

    return res.status(200).json({
      source_url: SOURCE_URL,
      fetched_at: new Date().toISOString(),
      catalog,
    });
  } catch (e) {
    return res.status(500).json({ error: e.message || '取得に失敗しました' });
  }
}
