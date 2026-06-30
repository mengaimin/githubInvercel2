const MHLW_BASE_URL = 'https://www.mhlw.go.jp';
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const MHLW_PROGRAMS = [
  {
    id: 'careerup', name: 'キャリアアップ助成金',
    source_url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/part_haken/jigyounushi/career.html',
    overall_specs: [
      { label: '全体パンフレット', must_include: ['キャリアアップ助成金', 'パンフレット'], must_exclude: ['正社員化コース', '短時間労働者'] },
      { label: '全体リーフレット', must_include: ['キャリアアップ助成金', 'リーフレット'], must_exclude: ['正社員化コース', '短時間'] },
      { label: 'Q&A', must_include: ['キャリアアップ助成金', 'Q'], must_exclude: ['正社員化'] },
    ],
    courses: [
      { id: 'seishain', name: '正社員化コース', pick_specs: [{ label: 'リーフレット', must_include: ['正社員化コース'], must_exclude: ['障害者'] }] },
      { id: 'tanjikan', name: '短時間労働者労働時間延長支援コース', pick_specs: [{ label: 'リーフレット', must_include: ['短時間労働者'], must_exclude: [] }] },
    ],
  },
  {
    id: 'ryoritsu', name: '両立支援等助成金',
    source_url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kodomo/shokuba_kosodate/ryouritsu01/index.html',
    overall_specs: [
      { label: '全体リーフレット', must_include: ['両立支援', 'リーフレット'], must_exclude: ['柔軟な働き方', '業務代替'] },
      { label: '全体パンフレット', must_include: ['手引き', 'パンフレット'], must_exclude: ['業務代替'] },
    ],
    courses: [
      { id: 'yugyo', name: '柔軟な働き方選択制度等支援コース', pick_specs: [{ label: '手引き', must_include: ['柔軟な働き方'], must_exclude: [] }] },
    ],
  },
  {
    id: 'jinzai', name: '人材開発支援助成金',
    source_url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/d01-1.html',
    overall_specs: [],
    courses: [
      { id: 'jinzai', name: '人材育成支援コース', section_keyword: '人材育成支援コース', pick_specs: [
        { label: '概要リーフレット', must_include: ['人材育成支援コース', '4月8日'], must_exclude: ['5月14日', 'Q', 'A'] },
        { label: '詳細版パンフレット', must_include: ['人材育成支援コース', '5月14日'], must_exclude: ['Q', 'A'] },
      ]},
      { id: 'kyuka', name: '教育訓練休暇等付与コース', section_keyword: '教育訓練休暇等付与コース', pick_specs: [
        { label: '詳細版パンフレット', must_include: ['教育訓練休暇等付与コース', 'ご案内', '4月8日'], must_exclude: [] },
        { label: '事業主Q&A', must_include: ['教育訓練休暇等付与コース', 'Q', 'A'], must_exclude: ['賃金要件'] },
      ]},
      { id: 'toushi', name: '人への投資促進コース', section_keyword: '人への投資促進コース', pick_specs: [
        { label: '概要リーフレット', must_include: ['人への投資促進コース', '4月8日'], must_exclude: ['5月14日', 'Q', 'A', '教育訓練休暇等付与'] },
        { label: '詳細版パンフレット', must_include: ['人への投資促進コース', '5月14日'], must_exclude: ['Q', 'A'] },
      ]},
      { id: 'reskilling', name: '事業展開等リスキリング支援コース', section_keyword: '事業展開等リスキリング支援コース', pick_specs: [
        { label: '概要リーフレット', must_include: ['事業展開等リスキリング支援コース', '4月8日'], must_exclude: ['5月14日', 'Q', 'A', '活用'] },
        { label: '詳細版パンフレット', must_include: ['事業展開等リスキリング支援コース', '5月14日'], must_exclude: ['Q', 'A', '活用'] },
      ]},
    ],
  },
  { id: '65plus', name: '65歳超雇用推進助成金', source_url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000139692.html', overall_specs: [{ label: 'パンフレット', must_include: ['65歳超', 'パンフレット'], must_exclude: [] }, { label: 'リーフレット', must_include: ['65歳超', 'リーフレット'], must_exclude: [] }], courses: [] },
  { id: 'trial', name: 'トライアル雇用助成金', source_url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/trial_koyou.html', overall_specs: [{ label: 'リーフレット', must_include: ['トライアル', 'リーフレット'], must_exclude: [] }], courses: [] },
  { id: 'hatarakikata', name: '働き方改革推進支援助成金', source_url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000120692.html', overall_specs: [{ label: '公式ページ', must_include: ['働き方改革'], must_exclude: [], allow_html: true }], courses: [] },
  { id: 'gyomu', name: '業務改善助成金', source_url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/roudoukijun/zigyonushi/shienjigyou/03.html', overall_specs: [{ label: 'パンフレット', must_include: ['業務改善', 'パンフレット'], must_exclude: [] }, { label: 'リーフレット', must_include: ['業務改善', 'ご案内'], must_exclude: [] }], courses: [] },
];

function normalizeDigits(text) {
  return String(text).replace(/[０-９]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0));
}

function normalizeText(text) {
  return normalizeDigits(String(text).replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim());
}

function collectPdfAnchors(html, section, links, seen) {
  const anchorRe = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = anchorRe.exec(html)) !== null) {
    const href = match[1];
    const title = normalizeText(match[2]);
    const lower = href.toLowerCase();
    const isPdf = lower.includes('/content/') && lower.endsWith('.pdf');
    if (!isPdf && !lower.startsWith('http') && !lower.startsWith('/')) continue;
    let absoluteUrl;
    try { absoluteUrl = new URL(href, MHLW_BASE_URL).href; } catch { continue; }
    if (seen.has(absoluteUrl)) continue;
    seen.add(absoluteUrl);
    links.push({ section, title, url: absoluteUrl, is_pdf: isPdf });
  }
}

function parsePortalLinks(html) {
  const links = [];
  const seen = new Set();
  const parts = html.split(/<h3\b[^>]*>/i);
  for (let i = 1; i < parts.length; i++) {
    const chunk = parts[i];
    const headingEnd = chunk.search(/<\/h3>/i);
    if (headingEnd < 0) continue;
    collectPdfAnchors(chunk.slice(headingEnd), normalizeText(chunk.slice(0, headingEnd)), links, seen);
  }
  collectPdfAnchors(html, '', links, seen);
  return links;
}

function isIntroDoc(title) {
  if (/様式|届出|チェックリスト|実績報告|Word|Excel|xlsx|通知文|記入例/i.test(title)) return false;
  return /パンフレット|リーフレット|Q.?＆?A|ご案内|手引き|概要|活用事例|案内/i.test(title);
}

function linkMatchesSpec(link, spec) {
  const haystack = normalizeText(`${link.section} ${link.title}`);
  if (spec.must_include.length && !spec.must_include.every((kw) => haystack.includes(normalizeDigits(kw)))) return false;
  if (spec.must_exclude.length && spec.must_exclude.some((kw) => haystack.includes(normalizeDigits(kw)))) return false;
  return true;
}

function belongsToCourse(link, course) {
  return normalizeText(`${link.section} ${link.title}`).includes(normalizeDigits(course.section_keyword));
}

function pickByTitleSpec(links, spec) {
  return links.find((link) => {
    if (!spec.allow_html && !link.is_pdf) return false;
    if (link.is_pdf && !isIntroDoc(link.title)) return false;
    const haystack = normalizeText(link.title);
    if (spec.must_include.length && !spec.must_include.every((kw) => haystack.includes(normalizeDigits(kw)))) return false;
    if (spec.must_exclude.length && spec.must_exclude.some((kw) => haystack.includes(normalizeDigits(kw)))) return false;
    return true;
  }) || null;
}

function pickPortalSpec(links, course, spec) {
  return links.find((link) => link.is_pdf && isIntroDoc(link.title) && belongsToCourse(link, course) && linkMatchesSpec(link, spec)) || null;
}

function buildStructuredCatalog(links, program) {
  const checkedAt = new Date().toISOString();
  const catalog = [];
  const usedUrls = new Set();

  const push = (scope, courseId, courseName, spec, link) => {
    if (!link || usedUrls.has(link.url)) return;
    usedUrls.add(link.url);
    catalog.push({
      program_id: program.id, program_name: program.name,
      doc_scope: scope, course_id: courseId, course_name: courseName,
      label: spec.label, url: link.url, source_title: link.title,
      status: 'ready', checked_at: checkedAt,
    });
  };

  for (const spec of program.overall_specs || []) {
    const pool = links.filter((l) => !usedUrls.has(l.url));
    let link = pickByTitleSpec(pool, spec);
    if (!link && spec.allow_html) {
      link = { url: program.source_url, title: `${program.name} 公式ページ`, is_pdf: false };
    }
    push('overall', `${program.id}_all`, '全体', spec, link);
  }

  for (const course of program.courses || []) {
    for (const spec of course.pick_specs || []) {
      const pool = links.filter((l) => !usedUrls.has(l.url));
      const link = course.section_keyword ? pickPortalSpec(pool, course, spec) : pickByTitleSpec(pool, spec);
      push('course', course.id, course.name, spec, link);
    }
  }
  return catalog;
}

async function fetchProgramCatalog(program) {
  const response = await fetch(program.source_url, { headers: { 'User-Agent': USER_AGENT } });
  if (!response.ok) throw new Error(`${program.name}の取得に失敗 (${response.status})`);
  return buildStructuredCatalog(parsePortalLinks(await response.text()), program);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });

  try {
    const results = await Promise.all(MHLW_PROGRAMS.map((p) => fetchProgramCatalog(p).catch(() => [])));
    return res.status(200).json({
      fetched_at: new Date().toISOString(),
      catalog: results.flat(),
    });
  } catch (e) {
    return res.status(500).json({ error: e.message || '取得に失敗しました' });
  }
}
