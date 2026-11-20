// Leonida Legend — GTA VI trophy guide & tracker.
// Loads the official 55-trophy list from data/trophies.json (a file of
// this app, so it works offline), renders the checklist, the guide
// panel, the roadmap and the missables view, and keeps the player's
// progress in localStorage with export/import to a JSON file.
import { stageOf, renderRoadmap, renderMissables } from './roadmap.js';

const STORAGE_KEY = 'leonida-legend-progress-v1';
const GRADE_ORDER = ['platinum', 'gold', 'silver', 'bronze'];
const params = new URLSearchParams(location.search);

const els = {
  list: document.getElementById('trophy-list'),
  emptyNote: document.getElementById('empty-note'),
  resultLine: document.getElementById('result-line'),
  guidePane: document.getElementById('guide-pane'),
  search: document.getElementById('search'),
  grade: document.getElementById('filter-grade'),
  kind: document.getElementById('filter-kind'),
  status: document.getElementById('filter-status'),
  spoiler: document.getElementById('spoiler-toggle'),
  earnedCount: document.getElementById('earned-count'),
  earnedPct: document.getElementById('earned-pct'),
  progressBar: document.getElementById('progress-bar'),
  progressFill: document.getElementById('progress-fill'),
  roadmapBody: document.getElementById('roadmap-body'),
  missablesBody: document.getElementById('missables-body'),
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        earned: new Set(Array.isArray(parsed.earned) ? parsed.earned : []),
        spoiler: Boolean(parsed.spoiler),
      };
    }
  } catch { /* a corrupt save falls through to a fresh state */ }
  return { earned: new Set(), spoiler: false };
}

const state = loadState();
if (params.get('spoiler') === '1') state.spoiler = true;

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ earned: [...state.earned], spoiler: state.spoiler }));
}

const data = await (await fetch('data/trophies.json')).json();
const trophies = data.trophies;

// Deterministic demo state for screenshots and first-look visitors:
// ?demo=1 pre-ticks a believable spread of story and strand trophies.
if (params.get('demo') === '1' && state.earned.size === 0) {
  for (const id of [2, 3, 4, 8, 9, 22, 33]) state.earned.add(id);
}

let selectedId = Number(params.get('select')) || (params.get('demo') === '1' ? 37 : 1);
if (!trophies.some((t) => t.id === selectedId)) selectedId = trophies[0].id;

function isSpoilerHidden(trophy) {
  return state.spoiler && trophy.kind === 'story' && !state.earned.has(trophy.id);
}

function renderProgress() {
  const total = trophies.length;
  const done = state.earned.size;
  els.earnedCount.textContent = String(done);
  els.earnedPct.textContent = Math.round((done / total) * 100) + '%';
  els.progressFill.style.width = (done / total) * 100 + '%';
  els.progressBar.setAttribute('aria-valuenow', String(done));
  for (const grade of GRADE_ORDER) {
    const all = trophies.filter((t) => t.grade === grade);
    const got = all.filter((t) => state.earned.has(t.id)).length;
    document.getElementById('gp-' + grade).textContent = got + '/' + all.length;
  }
}

function matchesFilters(t) {
  const q = els.search.value.trim().toLowerCase();
  if (els.grade.value !== 'all' && t.grade !== els.grade.value) return false;
  if (els.kind.value !== 'all' && t.kind !== els.kind.value) return false;
  if (els.status.value === 'earned' && !state.earned.has(t.id)) return false;
  if (els.status.value === 'unearned' && state.earned.has(t.id)) return false;
  if (q) {
    const hay = (t.name + ' ' + t.description + ' ' + t.guide + ' ' + t.kind).toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

function renderList() {
  els.list.replaceChildren();
  let shown = 0;
  for (const t of trophies) {
    if (!matchesFilters(t)) continue;
    shown += 1;
    const hidden = isSpoilerHidden(t);
    const li = document.createElement('li');
    li.className = 'trophy-row' + (state.earned.has(t.id) ? ' is-earned' : '') + (t.id === selectedId ? ' is-selected' : '');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.className = 'earn-box';
    box.checked = state.earned.has(t.id);
    box.setAttribute('aria-label', 'Mark ' + t.name + ' as earned');
    box.addEventListener('change', () => toggleEarned(t.id, box.checked));
    const text = document.createElement('button');
    text.type = 'button';
    text.className = 'trophy-text';
    const name = document.createElement('span');
    name.className = 'trophy-name';
    name.textContent = hidden ? 'Hidden story trophy' : t.name;
    const desc = document.createElement('span');
    desc.className = 'trophy-desc';
    desc.textContent = hidden ? 'Spoiler shield is on: earn this story trophy to reveal it.' : t.description;
    text.append(name, desc);
    text.addEventListener('click', () => selectTrophy(t.id));
    const badges = document.createElement('span');
    badges.className = 'row-badges';
    const grade = document.createElement('span');
    grade.className = 'badge badge-' + t.grade;
    grade.textContent = t.grade;
    badges.append(grade);
    if (t.missable) {
      const flag = document.createElement('span');
      flag.className = 'missable-flag';
      flag.textContent = 'MISSABLE';
      badges.append(flag);
    }
    li.append(box, text, badges);
    els.list.append(li);
  }
  els.emptyNote.hidden = shown !== 0;
  els.resultLine.textContent = 'Showing ' + shown + ' of ' + trophies.length + ' trophies · ' + state.earned.size + ' earned · progress saves automatically in this browser';
}

function renderGuide() {
  const t = trophies.find((x) => x.id === selectedId) || trophies[0];
  const pane = els.guidePane;
  pane.replaceChildren();
  const hidden = isSpoilerHidden(t);
  const card = document.createElement('article');
  card.className = 'guide-card';
  const title = document.createElement('h2');
  title.textContent = hidden ? 'Hidden story trophy' : t.name;
  const badgeRow = document.createElement('p');
  badgeRow.className = 'badge-row';
  const grade = document.createElement('span');
  grade.className = 'badge badge-' + t.grade;
  grade.textContent = t.grade;
  const kind = document.createElement('span');
  kind.className = 'badge badge-kind';
  kind.textContent = t.kind;
  const stage = document.createElement('span');
  stage.className = 'badge badge-stage';
  stage.textContent = stageOf(t).title.split('—')[0].trim();
  badgeRow.append(grade, kind, stage);
  const official = document.createElement('p');
  official.className = 'official-desc';
  official.textContent = hidden
    ? 'Spoiler shield is on. This story trophy\'s name and description stay hidden until you earn it — or turn the shield off above.'
    : 'Official description: “' + t.description + '”';
  card.append(title, badgeRow, official);
  if (t.missable) {
    const warn = document.createElement('div');
    warn.className = 'missable-box';
    const warnTitle = document.createElement('p');
    warnTitle.className = 'missable-title';
    warnTitle.textContent = '⚠ MISSABLE — read before you play past it';
    const warnNote = document.createElement('p');
    warnNote.textContent = t.missableNote || '';
    warn.append(warnTitle, warnNote);
    card.append(warn);
  }
  if (!hidden) {
    // Sources sit directly under the official description, before the
    // guide itself, so a reader always sees where the facts come from.
    const srcHead = document.createElement('h3');
    srcHead.className = 'source-head';
    srcHead.textContent = 'Sources for this guide';
    const srcList = document.createElement('ul');
    srcList.className = 'source-list';
    for (const s of t.sources || []) {
      const item = document.createElement('li');
      item.textContent = s;
      srcList.append(item);
    }
    card.append(srcHead, srcList);
    const guide = document.createElement('p');
    guide.className = 'guide-text';
    guide.textContent = t.guide;
    card.append(guide);
    if (t.target) {
      const target = document.createElement('p');
      target.className = 'target-line';
      target.textContent = 'Tracked target: ' + t.target.toLocaleString('en-US') + ' — tick the box on the left when the in-game counter completes.';
      card.append(target);
    }
  }
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'earn-toggle';
  toggle.textContent = state.earned.has(t.id) ? '✓ Earned — tap to undo' : 'Mark as earned';
  toggle.addEventListener('click', () => toggleEarned(t.id, !state.earned.has(t.id)));
  card.append(toggle);
  pane.append(card);
}

function renderAll() {
  renderProgress();
  renderList();
  renderGuide();
  renderRoadmap(els.roadmapBody, trophies, state.earned);
  renderMissables(els.missablesBody, trophies, state.earned, (id) => {
    selectTrophy(id);
    switchView('checklist');
  });
}

function toggleEarned(id, on) {
  if (on) state.earned.add(id);
  else state.earned.delete(id);
  saveState();
  renderAll();
}

function selectTrophy(id) {
  selectedId = id;
  renderList();
  renderGuide();
}

function switchView(name) {
  for (const tab of document.querySelectorAll('.tab')) {
    tab.classList.toggle('is-active', tab.dataset.view === name);
  }
  for (const view of document.querySelectorAll('.view')) {
    const active = view.id === 'view-' + name;
    view.classList.toggle('is-active', active);
    view.hidden = !active;
  }
}

for (const tab of document.querySelectorAll('.tab')) {
  tab.addEventListener('click', () => switchView(tab.dataset.view));
}
for (const input of [els.search, els.grade, els.kind, els.status]) {
  input.addEventListener('input', renderList);
  input.addEventListener('change', renderList);
}
els.spoiler.checked = state.spoiler;
els.spoiler.addEventListener('change', () => {
  state.spoiler = els.spoiler.checked;
  saveState();
  renderList();
  renderGuide();
});

document.getElementById('export-btn').addEventListener('click', () => {
  const payload = {
    game: 'Grand Theft Auto VI',
    tracker: 'Leonida Legend',
    earnedIds: [...state.earned],
    earnedNames: trophies.filter((t) => state.earned.has(t.id)).map((t) => t.name),
  };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});

document.getElementById('import-input').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    const raw = Array.isArray(parsed) ? parsed : (parsed.earnedIds || parsed.earnedNames || parsed.earned || []);
    const next = new Set();
    for (const entry of raw) {
      const byId = trophies.find((t) => t.id === entry);
      const byName = trophies.find((t) => t.name === entry);
      if (byId) next.add(byId.id);
      else if (byName) next.add(byName.id);
    }
    state.earned = next;
    saveState();
    renderAll();
  } catch {
    els.resultLine.textContent = 'That file could not be read as trophy progress — import a JSON file exported from this tracker.';
  }
  event.target.value = '';
});

document.getElementById('reset-btn').addEventListener('click', () => {
  state.earned.clear();
  saveState();
  renderAll();
});

renderAll();
if (params.get('view') === 'roadmap' || params.get('view') === 'missables') switchView(params.get('view'));
