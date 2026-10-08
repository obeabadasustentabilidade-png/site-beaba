/* =========================================================================
   O BEABÁ DA SUSTENTABILIDADE — script.js
   =========================================================================
   Este arquivo é usado por TODAS as páginas do site. Ele é dividido em:

     1. CONFIGURAÇÃO ............ o que você mais vai editar (chaves, links)
     2. CONTEÚDO ................ categorias, cursos e cores
     3. RECURSOS LIGA/DESLIGA ... esconde/mostra os cursos
     4. FUNÇÕES DE APOIO ........ formatação de texto, datas, links
     5. LEITURA DA PLANILHA ..... busca os episódios no Google Sheets
     6. CARDS DE EPISÓDIO ....... monta o HTML de cada episódio
     7. FILTROS ................. botões de categoria e programa
     8. PLAYER .................. janela que toca YouTube/Spotify
     9. CURSOS .................. monta os cards de curso
    10. CONTATO ............... botão "copiar e-mail"
    11. MENU MOBILE ............. botão "hambúrguer" no celular
    12. INICIALIZAÇÃO ........... liga tudo quando a página carrega

   Dica: use Ctrl+F e procure pelo número da seção (ex.: "5. LEITURA").
   ========================================================================= */


/* =========================================================================
   1. CONFIGURAÇÃO
   ========================================================================= */

/* Liga/desliga partes do site. Para lançar os cursos, troque para true:
   menu, rodapé, destaques e a página cursos.html aparecem sozinhos. */
const FEATURES = {
  cursos: false
};

/* Planilha de episódios: o ID é o trecho da URL entre "/d/" e "/edit".
   Use a planilha PÚBLICA, sem a coluna "Contato" (veja o README). */
const SHEET_ID = '11shKzZzdTTp3XoR5ncbdtu5gJlYFWvS_h4gNG68uFKk';
const SHEET_GID = '0';            // aba da planilha (0 = primeira aba)

/* Quantos episódios aparecem em "Últimos Episódios" na home. */
const HOME_EPISODES_COUNT = 6;


/* =========================================================================
   2. CONTEÚDO
   ========================================================================= */

/* Lista oficial de categorias. Algumas têm vírgula no nome, por isso o site
   procura os nomes inteiros em vez de separar por vírgula.
   CATEGORIA NOVA? Adicione o nome aqui, exatamente como está na planilha. */
const KNOWN_CATEGORIES = [
  'Água, Solo e Recursos Naturais',
  'Alimentação Sustentável',
  'Arte e Cultura para Sustentabilidade',
  'Bioeconomia e Amazônia',
  'Cidades e Infraestrutura Sustentável',
  'Clima e Mudanças Climáticas',
  'Educação e Comunicação para Sustentabilidade',
  'Empresas, ESG e Sustentabilidade Corporativa',
  'Energia e Transição Energética',
  'Finanças Sustentáveis',
  'Fundamentos e Conceitos de Sustentabilidade',
  'Inovação e Tecnologias Sustentáveis',
  'Justiça Social, Diversidade e Direitos Humanos',
  'Juventudes e Ativismo',
  'Natureza, Biodiversidade e Bem-estar',
  'ODS e Agenda 2030',
  'Política e Legislação Ambiental',
  'Resíduos e Economia Circular',
  'Saúde Pública e Meio Ambiente (ex: resíduos invisíveis, contaminação)',
  'Sustentabilidade no Consumo e no Estilo de Vida'
];

/* Cores da marca (as mesmas variáveis do style.css). */
const BRAND = {
  universo: '#003895', planeta: '#0054ED', ceu: '#137CD6',
  verde: '#338F0F', gold: '#D4A017', teal: '#215C69'
};

/* Cor de cada categoria: a primeira regra que bater com o nome vence.
   Categorias que não batem com nenhuma recebem uma cor fixa da paleta. */
const CATEGORY_COLORS = [
  [/esg|empresas|financas|corporativ/,                 BRAND.gold],
  [/natureza|biodiversidade|bioeconomia|amazonia|alimenta/, BRAND.verde],
  [/agua|solo|recursos/,                               BRAND.teal],
  [/clima|mudancas/,                                   BRAND.ceu],
  [/energia/,                                          BRAND.planeta],
  [/residuos|economia circular/,                       BRAND.teal],
  [/ods|agenda/,                                       BRAND.universo]
];

/* Cursos (só aparecem com FEATURES.cursos = true).
   status: 'em-breve' | 'inscricoes' | 'disponivel'
   link:   '#' = ainda sem página de inscrição (o botão leva ao contato)
   image:  coloque a capa em imagens/cursos/ */
const COURSES = [
  { title: 'Introdução à Sustentabilidade na Prática', desc: 'Do conceito à ação: fundamentos para entender e aplicar sustentabilidade no dia a dia e na sua organização.', hours: '8h de conteúdo', level: 'Iniciante', status: 'em-breve', image: 'imagens/cursos/curso_1.jpg', link: '#' },
  { title: 'ESG Descomplicado para Empresas', desc: 'Critérios ambientais, sociais e de governança explicados de forma direta, com casos reais e ferramentas aplicáveis.', hours: '12h de conteúdo', level: 'Intermediário', status: 'em-breve', image: 'imagens/cursos/curso_2.jpg', link: '#' },
  { title: 'Comunicação Ambiental sem Greenwashing', desc: 'Como comunicar iniciativas sustentáveis com transparência, credibilidade e impacto — evitando armadilhas comuns.', hours: '6h de conteúdo', level: 'Todos os níveis', status: 'em-breve', image: 'imagens/cursos/curso_3.jpg', link: '#' }
];
const COURSE_STATUS = {
  'em-breve':   { label: 'Em breve',           cls: 'status-soon' },
  'inscricoes': { label: 'Inscrições abertas', cls: 'status-open' },
  'disponivel': { label: 'Disponível agora',   cls: 'status-live' }
};

/* Episódios de reserva: aparecem só se a planilha não puder ser lida. */
const DEMO_EPISODES = [
  { ordem: 99, num: 81, title: 'Os Desafios da Mobilidade Urbana no Brasil', date: '17/08/2022', duration: '46:10', categories: ['Cidades e Infraestrutura Sustentável', 'Energia e Transição Energética'], program: 'Beabá da Sustentabilidade', tipo: 'Entrevista', guest: 'Luisa Peixoto', company: 'Maas Global', youtube: '', spotify: 'https://open.spotify.com/episode/5OP8NTosdktIUWEqhrxfBI' },
  { ordem: 98, num: 80, title: 'Amazônia Futuro e Presente', date: '11/08/2022', duration: '49:22', categories: ['Natureza, Biodiversidade e Bem-estar', 'Bioeconomia e Amazônia'], program: 'Beabá da Sustentabilidade', tipo: 'Entrevista', guest: 'Valcléia Solidade', company: 'Fundação Amazônia Sustentável', youtube: '', spotify: 'https://open.spotify.com/episode/01dc0spDvIUfGuYJ7jftMQ' },
  { ordem: 79, num: 61, title: 'O Beabá do ESG', date: '30/03/2022', duration: '36:02', categories: ['Empresas, ESG e Sustentabilidade Corporativa', 'Fundamentos e Conceitos de Sustentabilidade'], program: 'Especial ODS', tipo: 'Entrevista', guest: 'Vanessa Pinsky', company: '', youtube: '', spotify: 'https://open.spotify.com/episode/1jhlOjsrF12L98HCPXuXHn' },
  { ordem: 1, num: 1, title: 'O que é essa tal de Sustentabilidade?', date: '18/09/2020', duration: '27:04', categories: ['Fundamentos e Conceitos de Sustentabilidade'], program: 'Beabá da Sustentabilidade', tipo: 'Aula', guest: '', company: '', youtube: 'https://www.youtube.com/watch?v=EOqg-Unx8P0', spotify: 'https://open.spotify.com/episode/0571SeQI67RWZyKCN1H0ZM' },
  { ordem: 23, num: 6, title: 'Aquecimento global, o grande desafio da Sustentabilidade', date: '14/01/2021', duration: '35:09', categories: ['Clima e Mudanças Climáticas', 'Fundamentos e Conceitos de Sustentabilidade'], program: 'Beabá da Sustentabilidade', tipo: 'Aula', guest: '', company: '', youtube: 'https://www.youtube.com/watch?v=YZMpbLvIo2Y', spotify: 'https://open.spotify.com/episode/4EQZNw5JuimPmNr9njsTo2' },
  { ordem: 51, num: 34, title: 'Engolidor dos Sete Mares', date: '15/09/2021', duration: '34:24', categories: ['Natureza, Biodiversidade e Bem-estar', 'Resíduos e Economia Circular'], program: 'Plantão Sustentável', tipo: 'Análise', guest: '', company: '', youtube: '', spotify: 'https://open.spotify.com/episode/7BuMjxXgpjjyN6IFJWqSG8' }
];


/* =========================================================================
   3. RECURSOS LIGA/DESLIGA
   -------------------------------------------------------------------------
   Coloca na tag <html> a classe "feat-cursos" quando os cursos estão
   ligados. O style.css esconde tudo que tem data-feature="cursos" quando
   essa classe NÃO existe. Roda imediatamente, antes da página aparecer.
   ========================================================================= */
(function applyFeatures() {
  const root = document.documentElement;
  Object.keys(FEATURES).forEach(k => root.classList.toggle('feat-' + k, !!FEATURES[k]));

  // Página inteira de um recurso desligado (ex.: cursos.html) volta para a home
  const page = root.dataset.feature;
  if (page && !FEATURES[page]) location.replace('index.html');
})();


/* =========================================================================
   4. FUNÇÕES DE APOIO
   ========================================================================= */

/* Deixa um texto comparável: minúsculas, sem acentos e sem espaços extras.
   Ex.: "  Água, Solo " → "agua, solo" */
function normalize(str) {
  return (str || '').toString()
    .replace(/[​-‍﻿]/g, '')
    .replace(/\s+/g, ' ').trim().toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/* Protege textos da planilha antes de colocá-los no HTML
   (uma aspa no título quebraria atributos como alt="..."). */
function esc(str) {
  return (str || '').toString().replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* Aceita só links https (evita links quebrados ou inseguros). */
function safeUrl(url) {
  return /^https:\/\//i.test(url || '') ? esc(url) : '';
}

/* Extrai o ID de um link do YouTube (watch, youtu.be, shorts, live...). */
function getYouTubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/|youtube\.com\/live\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

/* Extrai o ID de um link de episódio do Spotify. */
function getSpotifyId(url) {
  if (!url) return null;
  const m = url.match(/open\.spotify\.com\/episode\/([A-Za-z0-9]+)/);
  return m ? m[1] : null;
}

/* Capa do episódio = miniatura do vídeo no YouTube. */
function youTubeThumb(url) {
  const id = getYouTubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

/* Cor de uma categoria (regras em CATEGORY_COLORS, seção 2). */
function categoryColor(cat) {
  const n = normalize(cat);
  const rule = CATEGORY_COLORS.find(([re]) => re.test(n));
  if (rule) return rule[1];
  // Sem regra: escolhe sempre a mesma cor da paleta para o mesmo nome
  const palette = Object.values(BRAND);
  let h = 0;
  for (let i = 0; i < n.length; i++) h = (h * 31 + n.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}

/* Datas: "18/09/2020" → "18 set 2020" (exibição) e número (ordenação). */
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
function formatDate(d) {
  const m = (d || '').match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
  if (!m) return d || '';
  return `${m[1].padStart(2, '0')} ${MESES[(+m[2]) - 1] || ''} ${m[3]}`;
}
function dateKey(d) {
  const m = (d || '').match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
  return m ? new Date(+m[3], +m[2] - 1, +m[1]).getTime() : 0;
}

/* Duração: a planilha guarda "27:04:00"; o site mostra "27:04". */
function formatDuration(s) {
  if (!s) return '';
  const p = s.split(':');
  return p.length >= 2 ? `${p[0].padStart(2, '0')}:${p[1].padStart(2, '0')}` : s;
}


/* =========================================================================
   5. LEITURA DA PLANILHA
   -------------------------------------------------------------------------
   Caminho: planilha → linhas de texto → lista de episódios.
   As colunas são achadas PELO NOME do cabeçalho, então dá para reordenar
   ou inserir colunas sem quebrar o site. Colunas lidas:
     Ordem Publicação · N° · Nome · Data · Duração Spotify · Categoria
     Programa · Tipo · Link Episódio Spotify · Link Episódio YouTube
     Convidado · Empresa
   A coluna "Contato" é IGNORADA de propósito.
   ========================================================================= */

/* 5.1 — Separa as categorias de uma célula. Ex.:
   '"Clima e Mudanças Climáticas", "ODS e Agenda 2030"' → [2 categorias] */
const KNOWN_NORM = KNOWN_CATEGORIES
  .map(c => [normalize(c), c])
  .sort((a, b) => b[0].length - a[0].length);   // nomes longos primeiro

function parseCategories(cell) {
  if (!cell) return [];
  let rest = ' ' + normalize(cell.replace(/["“”]/g, ' ')) + ' ';
  const found = [];

  // Primeiro, as categorias da lista oficial
  for (const [n, label] of KNOWN_NORM) {
    if (rest.includes(n)) { found.push(label); rest = rest.split(n).join(' | '); }
  }

  // O que sobrar (nome fora da lista) também vira categoria
  const raw = cell.replace(/["“”]/g, '');
  rest.split(/[|;,\n]/).map(s => s.trim()).filter(s => s.length > 2).forEach(l => {
    const original = raw.split(/[;,\n]/).map(s => s.trim()).find(s => normalize(s) === l);
    if (original) found.push(original);
  });
  return [...new Set(found)];
}

/* 5.2 — Lê texto CSV (respeita aspas, vírgulas e quebras dentro de campos). */
function parseCSV(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQuotes = false; }
      else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
      else if (c !== '\r') field += c;
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

/* 5.3 — Converte as linhas da planilha em episódios, do mais novo ao mais antigo. */
function rowsToEpisodes(rows) {
  if (!rows.length) return [];

  // Acha a linha de cabeçalho (a que tem "Nome" e "Categoria")
  let hi = 0;
  for (let i = 0; i < Math.min(rows.length, 5); i++) {
    const h = rows[i].map(normalize);
    if (h.some(x => x.includes('nome')) && h.some(x => x.includes('categoria'))) { hi = i; break; }
  }

  // Descobre em que coluna está cada informação
  const header = rows[hi].map(normalize);
  const find = (pred) => header.findIndex(pred);
  const col = {
    ordem:   find(h => h.includes('ordem')),
    num:     find(h => h === 'n°' || h === 'no' || h === 'n' || h.includes('numero')),
    title:   find(h => h.includes('nome') || h.includes('titulo')),
    date:    find(h => h.includes('data')),
    dur:     find(h => h.includes('duracao')),
    cat:     find(h => h.includes('categoria')),
    program: find(h => h.includes('programa')),
    tipo:    find(h => h.includes('tipo')),
    spotify: find(h => h.includes('spotify') && h.includes('link')),
    youtube: find(h => h.includes('youtube')),
    guest:   find(h => h.includes('convidado')),
    company: find(h => h.includes('empresa'))
  };
  const get = (r, i) => (i >= 0 && r[i] != null) ? r[i].trim() : '';

  return rows.slice(hi + 1)
    .filter(r => get(r, col.title))            // ignora linhas sem nome
    .map(r => ({
      ordem:      parseInt(get(r, col.ordem), 10) || 0,
      num:        get(r, col.num),
      title:      get(r, col.title),
      date:       get(r, col.date),
      duration:   formatDuration(get(r, col.dur)),
      categories: parseCategories(get(r, col.cat)),
      program:    get(r, col.program),
      tipo:       get(r, col.tipo),
      spotify:    get(r, col.spotify),
      youtube:    get(r, col.youtube),
      guest:      get(r, col.guest),
      company:    get(r, col.company)
    }))
    .sort((a, b) => (b.ordem - a.ordem) || (dateKey(b.date) - dateKey(a.date)));
}

/* 5.4 — Busca a planilha no Google (formato JSONP: funciona em qualquer
   hospedagem, desde que a planilha esteja "Qualquer pessoa com o link"). */
function loadSheetJSONP() {
  return new Promise((resolve, reject) => {
    const cb = '__beabaSheet' + Date.now();
    const tag = document.createElement('script');
    const timer = setTimeout(() => { done(); reject(new Error('timeout')); }, 10000);
    function done() { clearTimeout(timer); delete window[cb]; tag.remove(); }

    window[cb] = (resp) => {
      done();
      try {
        const t = resp.table;
        const header = t.cols.map(c => c.label || '');
        const rows = t.rows.map(r => (r.c || []).map(cell =>
          cell ? String(cell.f != null ? cell.f : (cell.v != null ? cell.v : '')) : ''));
        resolve([header, ...rows]);
      } catch (e) { reject(e); }
    };
    tag.onerror = () => { done(); reject(new Error('load')); };
    tag.src = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=responseHandler:${cb}&headers=1&gid=${SHEET_GID}`;
    document.head.appendChild(tag);
  });
}

/* 5.5 — Tenta, em ordem: JSONP → CSV → episódios de reserva. */
const SHEET_CSV_URLS = [
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${SHEET_GID}`,
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/pub?output=csv`,
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${SHEET_GID}`
];

async function loadEpisodes() {
  try {
    const eps = rowsToEpisodes(await loadSheetJSONP());
    if (eps.length) return eps;
  } catch (e) { /* segue para o CSV */ }

  for (const url of SHEET_CSV_URLS) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const eps = rowsToEpisodes(parseCSV(await res.text()));
      if (eps.length) return eps;
    } catch (err) { /* tenta o próximo endereço */ }
  }

  console.warn('Planilha indisponível — usando episódios de reserva.');
  return DEMO_EPISODES;
}


/* =========================================================================
   6. CARDS DE EPISÓDIO
   ========================================================================= */

/* 6.1 — HTML de um card: capa (com play), categoria, título, data,
   duração, convidado e atalhos para YouTube/Spotify. */
function episodeCardHTML(ep) {
  const primary  = ep.categories[0] || ep.program || 'Episódio';
  const color    = categoryColor(primary);
  const ytId     = getYouTubeId(ep.youtube);
  const spId     = getSpotifyId(ep.spotify);
  const playable = ytId || spId;
  const thumbSrc = youTubeThumb(ep.youtube);
  const title    = esc(ep.title);
  const meta     = [formatDate(ep.date), ep.duration, ep.guest ? 'com ' + ep.guest : '']
                     .filter(Boolean).join('  ·  ');
  // Dados usados pelos filtros (seção 7)
  const dataCats = ep.categories.map(normalize).join('|');
  // O nome do programa principal não aparece no card (só os especiais)
  const showProgram = ep.program && normalize(ep.program) !== 'beaba da sustentabilidade';

  return `
    <article class="ep-card" data-categories="${esc(dataCats)}" data-program="${esc(normalize(ep.program))}">
      <div class="ep-thumb ${thumbSrc ? '' : 'thumb-fallback'}"
           style="${thumbSrc ? '' : `--cat:${color}`}"
           ${playable ? `data-type="${ytId ? 'youtube' : 'spotify'}" data-id="${ytId || spId}"` : ''}
           data-title="${encodeURIComponent(ep.title)}"
           ${playable ? 'role="button" tabindex="0"' : ''} aria-label="${title}">
        ${thumbSrc
          ? `<img src="${thumbSrc}" alt="${title}" loading="lazy" onerror="this.parentNode.classList.add('thumb-fallback'); this.parentNode.style.setProperty('--cat','${color}'); this.remove();">`
          : '<span class="ep-thumb-mark">▶</span>'}
        ${ep.tipo ? `<span class="ep-type-badge" style="background:${color}">${esc(ep.tipo)}</span>` : ''}
        ${playable ? '<span class="ep-play"><svg viewBox="0 0 24 24" width="26" height="26"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span>' : ''}
      </div>
      <div class="ep-card-body">
        <span class="ep-card-cat" style="color:${color}">${esc(primary)}</span>
        <h3 class="ep-card-title">${title}</h3>
        <div class="ep-card-meta">${esc(meta)}</div>
        <div class="ep-card-foot">
          ${showProgram ? `<span class="ep-program">${esc(ep.program)}</span>` : '<span></span>'}
          <span class="ep-card-actions">
            ${ytId ? `<a class="ep-mini-link" href="${safeUrl(ep.youtube)}" target="_blank" rel="noopener" aria-label="Ver no YouTube"><img src="https://cdn.simpleicons.org/youtube/FF0000" width="20" alt="YouTube"></a>` : ''}
            ${safeUrl(ep.spotify) ? `<a class="ep-mini-link" href="${safeUrl(ep.spotify)}" target="_blank" rel="noopener" aria-label="Ouvir no Spotify"><img src="https://cdn.simpleicons.org/spotify/1DB954" width="20" alt="Spotify"></a>` : ''}
          </span>
        </div>
      </div>
    </article>`;
}

/* 6.2 — Coloca os cards na página. Com "limit", mostra só os N primeiros
   (home). Com "filterEls", cria também os filtros (página Episódios). */
function renderEpisodes(grid, episodes, limit, filterEls) {
  const list = limit ? episodes.slice(0, limit) : episodes;
  grid.innerHTML = list.map(episodeCardHTML).join('');
  bindCardPlayers(grid);

  if (filterEls && (filterEls.catEl || filterEls.progEl)) {
    renderFilters({
      ...filterEls,
      gridEl: grid,
      categories: [...new Set(episodes.flatMap(e => e.categories))].filter(Boolean),
      programs:   [...new Set(episodes.map(e => e.program))].filter(Boolean)
    });
  }
}


/* =========================================================================
   7. FILTROS (página Episódios)
   -------------------------------------------------------------------------
   Cria um botão por categoria e por programa, com a contagem de episódios.
   O filtro escolhido vai para a URL (?categoria=...&programa=...), então
   dá para compartilhar o link já filtrado — os "Eixos" da home usam isso.
   ========================================================================= */
function renderFilters({ catEl, progEl, gridEl, counterEl, categories, programs }) {
  // 7.1 — Estado inicial (lido da URL, se houver)
  const params  = new URLSearchParams(location.search);
  const catMap  = new Map(categories.map(c => [normalize(c), c]));
  const progMap = new Map(programs.map(p => [normalize(p), p]));
  const fromUrl = (map, key) => map.has(normalize(params.get(key))) ? normalize(params.get(key)) : 'todos';
  const state   = { cat: fromUrl(catMap, 'categoria'), prog: fromUrl(progMap, 'programa') };

  const cards = [...gridEl.querySelectorAll('.ep-card')].map(el => ({
    el,
    cats: (el.dataset.categories || '').split('|').filter(Boolean),
    prog: el.dataset.program || ''
  }));

  // 7.2 — Desenha os botões (em ordem alfabética)
  const chip = (label, value, color) =>
    `<button type="button" class="ep-chip" data-filter="${esc(value)}"${color ? ` style="--chip-color:${color}"` : ''}>${esc(label)}<span class="ep-chip-count"></span></button>`;
  const sorted = (map) => [...map].sort((a, b) => a[1].localeCompare(b[1], 'pt'));

  if (catEl)  catEl.innerHTML  = chip('Todas', 'todos') + sorted(catMap).map(([k, v]) => chip(v, k, categoryColor(v))).join('');
  if (progEl) progEl.innerHTML = chip('Todos', 'todos') + sorted(progMap).map(([k, v]) => chip(v, k, 'var(--universo)')).join('');

  // Mensagem para quando nenhum episódio combina com os filtros
  const empty = document.createElement('div');
  empty.className = 'episodes-state';
  empty.innerHTML = 'Nenhum episódio com essa combinação. <button type="button" class="ep-reset">Limpar filtros</button>';
  gridEl.appendChild(empty);

  // 7.3 — Aplica os filtros: mostra/esconde cards, atualiza contagens e URL
  const matchCat  = (c, v) => v === 'todos' || c.cats.includes(v);
  const matchProg = (c, v) => v === 'todos' || c.prog === v;

  const apply = () => {
    let shown = 0;
    cards.forEach(c => {
      const ok = matchCat(c, state.cat) && matchProg(c, state.prog);
      c.el.style.display = ok ? '' : 'none';
      if (ok) shown++;
    });

    // Cada botão mostra quantos episódios teria; botões com 0 ficam desativados
    const paint = (el, key, countFn) => {
      if (!el) return;
      el.querySelectorAll('.ep-chip').forEach(b => {
        const v = b.dataset.filter;
        const n = countFn(v);
        b.classList.toggle('active', v === state[key]);
        b.querySelector('.ep-chip-count').textContent = n;
        b.disabled = n === 0 && v !== state[key];
      });
      // No celular os botões ficam numa faixa deslizante: traz o ativo para a vista
      const active = el.querySelector('.ep-chip.active');
      if (active && el.scrollWidth > el.clientWidth) el.scrollLeft += active.getBoundingClientRect().left - el.getBoundingClientRect().left - 16;
    };
    paint(catEl,  'cat',  v => cards.filter(c => matchProg(c, state.prog) && matchCat(c, v)).length);
    paint(progEl, 'prog', v => cards.filter(c => matchCat(c, state.cat) && matchProg(c, v)).length);

    empty.style.display = shown ? 'none' : '';
    if (counterEl) counterEl.textContent = `${shown} episódio${shown === 1 ? '' : 's'}`;

    const q = new URLSearchParams();
    if (state.cat !== 'todos')  q.set('categoria', catMap.get(state.cat));
    if (state.prog !== 'todos') q.set('programa', progMap.get(state.prog));
    history.replaceState(null, '', location.pathname + (q.toString() ? '?' + q : ''));
  };

  // 7.4 — Cliques nos botões
  const wire = (el, key) => el && el.addEventListener('click', e => {
    const b = e.target.closest('.ep-chip');
    if (!b || b.disabled) return;
    state[key] = b.dataset.filter;
    apply();
  });
  wire(catEl, 'cat');
  wire(progEl, 'prog');
  empty.querySelector('.ep-reset').addEventListener('click', () => {
    state.cat = 'todos'; state.prog = 'todos'; apply();
  });

  apply();
}


/* =========================================================================
   8. PLAYER (janela que toca o episódio sem sair do site)
   ========================================================================= */

/* 8.1 — Clique (ou Enter) na capa abre o player. */
function bindCardPlayers(scope) {
  scope.querySelectorAll('.ep-thumb[data-id]').forEach(el => {
    const open = () => openPlayer(el.dataset.type, el.dataset.id, decodeURIComponent(el.dataset.title));
    el.addEventListener('click', open);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  });
}

/* 8.2 — Abre a janela com o vídeo do YouTube ou o player do Spotify. */
function openPlayer(type, id, title) {
  let modal = document.getElementById('ep-modal');

  // Cria a janela na primeira vez
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'ep-modal';
    modal.className = 'ep-modal';
    modal.innerHTML = `
      <div class="ep-modal-backdrop"></div>
      <div class="ep-modal-box" role="dialog" aria-modal="true">
        <button class="ep-modal-close" aria-label="Fechar">&times;</button>
        <div class="ep-modal-media"></div>
        <div class="ep-modal-foot"></div>
      </div>`;
    document.body.appendChild(modal);
    modal.querySelector('.ep-modal-backdrop').addEventListener('click', closePlayer);
    modal.querySelector('.ep-modal-close').addEventListener('click', closePlayer);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePlayer(); });
  }

  const media = modal.querySelector('.ep-modal-media');
  title = esc(title);
  if (type === 'youtube') {
    media.className = 'ep-modal-media is-video';
    media.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0" title="${title}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
  } else {
    media.className = 'ep-modal-media is-audio';
    media.innerHTML = `<iframe src="https://open.spotify.com/embed/episode/${id}?utm_source=generator" title="${title}" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture" loading="lazy"></iframe>`;
  }
  modal.querySelector('.ep-modal-foot').innerHTML = `<span class="ep-modal-title">${title}</span>`;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';   // trava a rolagem do fundo
}

/* 8.3 — Fecha a janela e para o áudio/vídeo. */
function closePlayer() {
  const modal = document.getElementById('ep-modal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.querySelector('.ep-modal-media').innerHTML = '';
  document.body.style.overflow = '';
}


/* =========================================================================
   9. CURSOS (página cursos.html — só com FEATURES.cursos = true)
   ========================================================================= */
function renderCourses(grid) {
  if (!grid) return;

  grid.innerHTML = COURSES.map(c => {
    const st = COURSE_STATUS[c.status] || COURSE_STATUS['em-breve'];
    const hasLink = c.link && c.link !== '#';
    const button = hasLink
      ? `<a class="btn-primary w-100" href="${esc(c.link)}" target="_blank" rel="noopener">${c.status === 'em-breve' ? 'Saiba mais' : 'Quero me inscrever'}</a>`
      : `<a class="btn-outline w-100 disabled" href="index.html#contato">Avise-me no lançamento</a>`;

    return `
      <article class="course-card">
        <div class="course-cover">
          <img src="${esc(c.image)}" alt="${esc(c.title)}" loading="lazy" onerror="this.parentNode.classList.add('cover-fallback'); this.remove();">
          <span class="course-status ${st.cls}">${st.label}</span>
        </div>
        <div class="course-body">
          <div class="course-meta"><span>${esc(c.level)}</span><span>${esc(c.hours)}</span></div>
          <h3 class="course-title">${esc(c.title)}</h3>
          <p class="course-desc">${esc(c.desc)}</p>
          ${button}
        </div>
      </article>`;
  }).join('');
}


/* =========================================================================
   10. CONTATO
   -------------------------------------------------------------------------
   Os botões de e-mail e WhatsApp são links comuns no index.html.
   Aqui fica só o botão "Copiar endereço de e-mail", útil para quem não
   tem um programa de e-mail configurado no computador.
   ========================================================================= */
function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach(btn => {
    const label = btn.textContent;
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        btn.textContent = 'E-mail copiado!';
      } catch (err) {
        btn.textContent = btn.dataset.copy;   // sem permissão: mostra o endereço
      }
      btn.classList.add('copied');
      setTimeout(() => { btn.textContent = label; btn.classList.remove('copied'); }, 2500);
    });
  });
}


/* =========================================================================
   11. MENU MOBILE
   ========================================================================= */
function initMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');
  if (!toggle || !links) return;

  const setOpen = (open) => {
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  };
  toggle.addEventListener('click', () => setOpen(!links.classList.contains('open')));
  // Fecha o menu ao escolher um link
  links.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
}


/* =========================================================================
   12. INICIALIZAÇÃO
   -------------------------------------------------------------------------
   Cada função só age se a página tiver o elemento correspondente, então o
   mesmo arquivo serve para todas as páginas.
   ========================================================================= */
document.addEventListener('DOMContentLoaded', async () => {
  initMobileMenu();
  initCopyButtons();
  if (FEATURES.cursos) renderCourses(document.getElementById('courses-grid'));

  // Episódios: home (últimos N) e página Episódios (todos + filtros)
  const homeGrid = document.getElementById('home-episodes-list');
  const fullGrid = document.getElementById('full-episodes-list');
  if (!homeGrid && !fullGrid) return;

  const episodes = await loadEpisodes();
  if (homeGrid) renderEpisodes(homeGrid, episodes, HOME_EPISODES_COUNT, null);
  if (fullGrid) renderEpisodes(fullGrid, episodes, null, {
    catEl:     document.getElementById('episode-filters'),
    progEl:    document.getElementById('program-filters'),
    counterEl: document.getElementById('episode-counter')
  });
});
