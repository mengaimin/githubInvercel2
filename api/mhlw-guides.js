const MHLW_BASE_URL = 'https://www.mhlw.go.jp';
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const MHLW_PROGRAMS = [
  {
    id: 'careerup',
    name: 'キャリアアップ助成金',
    description: '非正規雇用労働者の正社員化・処遇改善を支援',
    source_url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/part_haken/jigyounushi/career.html',
    grant_prefix: 'キャリアアップ助成金',
    mode: 'auto',
  },
  {
    id: 'ryoritsu',
    name: '両立支援等助成金',
    description: '仕事と育児・介護等の両立支援に取り組む事業主を支援',
    source_url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kodomo/shokuba_kosodate/ryouritsu01/index.html',
    grant_prefix: '両立支援等助成金',
    mode: 'auto',
  },
  {
    id: 'jinzai',
    name: '人材開発支援助成金',
    description: '従業員の職業訓練・能力開発のための研修・訓練を支援',
    source_url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/d01-1.html',
    grant_prefix: '人材開発支援助成金',
    mode: 'specs',
    courses: [
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
    ],
  },
  {
    id: '65plus',
    name: '65歳超雇用推進助成金',
    description: '65歳以上への定年引上げや高年齢者の雇用管理制度の整備を支援',
    source_url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000139692.html',
    grant_prefix: '65歳超雇用推進助成金',
    mode: 'auto',
  },
  {
    id: 'trial',
    name: 'トライアル雇用助成金',
    description: '就職困難な求職者の試行雇用（トライアル雇用）を支援',
    source_url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/trial_koyou.html',
    grant_prefix: 'トライアル雇用助成金',
    mode: 'auto',
  },
  {
    id: 'hatarakikata',
    name: '働き方改革推進支援助成金',
    description: '労働時間短縮や有給休暇取得促進など働き方改革の取組を支援',
    source_url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000120692.html',
    grant_prefix: '働き方改革推進支援助成金',
    mode: 'auto',
  },
  {
    id: 'gyomu',
    name: '業務改善助成金',
    description: '最低賃金の引上げと生産性向上のための設備投資等を支援',
    source_url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/roudoukijun/zigyonushi/shienjigyou/03.html',
    grant_prefix: '業務改善助成金',
    mode: 'auto',
  },
];

function normalizeDigits(text) {
  return String(text).replace(/[０-９]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0));
}

function normalizeText(text) {
  return normalizeDigits(
    String(text).replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
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
    collectPdfAnchors(chunk.slice(headingEnd), section, baseUrl, links, seen);
  }
  collectPdfAnchors(html, '', baseUrl, links, seen);
  return links;
}

function collectPdfAnchors(html, section, baseUrl, links, seen) {
  const anchorRe = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = anchorRe.exec(html)) !== null) {
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

function isIntroDoc(title) {
  if (/様式|届出|チェックリスト|実績報告|Word|Excel|xlsx|通知文|記入例/i.test(title)) return false;
  return /パンフレット|リーフレット|Q.?＆?A|ご案内|手引き|概要|活用事例|案内/i.test(title);
}

function guessDocLabel(title) {
  if (/Q.?＆?A/i.test(title)) return 'Q&A';
  if (/リーフレット/i.test(title)) return 'リーフレット';
  if (/パンフレット|手引き/i.test(title)) return 'パンフレット';
  if (/活用事例/i.test(title)) return '活用事例集';
  return '紹介資料';
}

function linkMatchesSpec(link, spec) {
  const haystack = normalizeText(`${link.section} ${link.title}`);
  if (spec.must_include.length && !spec.must_include.every((kw) => haystack.includes(normalizeDigits(kw)))) return false;
  if (spec.must_exclude.length && spec.must_exclude.some((kw) => haystack.includes(normalizeDigits(kw)))) return false;
  return true;
}

function belongsToCourse(link, course) {
  const haystack = normalizeText(`${link.section} ${link.title}`);
  return haystack.includes(normalizeDigits(course.section_keyword));
}

function pickGuideLink(links, course, spec) {
  return links.find((link) => belongsToCourse(link, course) && linkMatchesSpec(link, spec)) || null;
}

function buildSpecsCatalog(links, program) {
  const checkedAt = new Date().toISOString();
  const catalog = [];
  for (const course of program.courses || []) {
    for (const spec of course.specs) {
      const link = pickGuideLink(links, course, spec);
      catalog.push({
        program_id: program.id,
        program_name: program.name,
        course_id: course.id,
        course_name: course.name,
        course_description: course.description,
        label: spec.label,
        url: link ? link.url : '',
        source_title: link ? link.title : '',
        status: link ? 'ready' : 'unavailable',
        error: link ? '' : '厚労省ページに該当資料がありません',
        checked_at: checkedAt,
      });
    }
  }
  return catalog;
}

function buildAutoCatalog(links, program) {
  const checkedAt = new Date().toISOString();
  const introLinks = links.filter((link) => isIntroDoc(link.title));
  const seen = new Set();
  const catalog = [];
  for (const link of introLinks) {
    if (seen.has(link.url)) continue;
    seen.add(link.url);
    catalog.push({
      program_id: program.id,
      program_name: program.name,
      course_id: program.id,
      course_name: program.name,
      course_description: program.description,
      label: guessDocLabel(link.title),
      url: link.url,
      source_title: link.title,
      status: 'ready',
      checked_at: checkedAt,
    });
  }
  return catalog;
}

async function fetchProgramCatalog(program) {
  const response = await fetch(program.source_url, { headers: { 'User-Agent': USER_AGENT } });
  if (!response.ok) {
    throw new Error(`${program.name}の取得に失敗 (${response.status})`);
  }
  const html = await response.text();
  const links = parsePortalLinks(html, MHLW_BASE_URL);
  if (program.mode === 'specs') return buildSpecsCatalog(links, program);
  return buildAutoCatalog(links, program);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });

  try {
    const results = await Promise.all(
      MHLW_PROGRAMS.map(async (program) => {
        try {
          return await fetchProgramCatalog(program);
        } catch (e) {
          return [{
            program_id: program.id,
            program_name: program.name,
            course_id: program.id,
            course_name: program.name,
            course_description: program.description,
            label: '取得エラー',
            url: '',
            source_title: '',
            status: 'unavailable',
            error: e.message,
            checked_at: new Date().toISOString(),
          }];
        }
      })
    );

    return res.status(200).json({
      programs: MHLW_PROGRAMS.map((p) => ({ id: p.id, name: p.name, source_url: p.source_url })),
      fetched_at: new Date().toISOString(),
      catalog: results.flat(),
    });
  } catch (e) {
    return res.status(500).json({ error: e.message || '取得に失敗しました' });
  }
}
