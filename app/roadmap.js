// Roadmap data and renderers for Leonida Legend.
// The six stages are derived from the official trophy descriptions:
// chapter and named-mission trophies form the story spine, the five
// description-flagged missables must be watched while the story runs,
// and everything else is cleanup that stays available after the credits.

export const STAGES = [
  {
    id: 1,
    title: 'Stage 1 — Story playthrough: chapters & missions',
    blurb: 'Play the campaign straight through: Gone Fishing, Chapters 1–4, the named missions (Breakfast Run, The Cartel Heist, Child\'s Play, Headliners, VCIA Takedown, Operation Savage Glory) and the final mission. Nothing here can be missed, so just play — but keep a manual save at the start of every chapter as insurance for Stage 2.',
  },
  {
    id: 2,
    title: 'Stage 2 — While the story runs: strands, partner & the 5 missables',
    blurb: 'The only stage with a clock on it. Finish the five contact strands (Andy, Kenton, Billy, Randy, Tyrone) toward Strangers & Freaks, do the two partner trophies while your partner is at your side, and watch the missables: the VCIA departure, the showroom smash-out, the partnership moment, the 500-choice counter and the fail-then-succeed trophy.',
  },
  {
    id: 3,
    title: 'Stage 3 — Cleanup I: activities, challenges & crime',
    blurb: 'Everything repeatable: 250 stunts, all 42 Shooting Range golds, drone races at 14 locations, 20 race wins, 50 challenges, the robbery set (jewelry store, 5 bank vaults, an armoured truck, one illegal operation per gang) and the Combat Focus five-in-one.',
  },
  {
    id: 4,
    title: 'Stage 4 — Cleanup II: collectibles & exploration',
    blurb: 'Sweep Leonida region by region: all 52 areas, 18 meditation spots, 3 complete card sets, WAiNK It at 100 locations, 100 vehicles discovered and 10 registered on the Scooter Bros app — plus a quiet cocktail on Ocean Beach.',
  },
  {
    id: 5,
    title: 'Stage 5 — The money game & the 100% audit',
    blurb: 'Turn crime into counters: launder $250,000 of Marked Bills through your contacts, spend $100,000 across shops, buy all 8 garage properties, and then audit the in-game completion screen category by category until A Long Road (100%) pops.',
  },
  {
    id: 6,
    title: 'Stage 6 — Platinum',
    blurb: 'Vice Got a Price! unlocks by itself the moment the other 54 are earned. If it has not popped, one counter is short — compare the checklist grade by grade and finish that trophy first.',
  },
];

export function stageOf(trophy) {
  return STAGES.find((s) => s.id === trophy.stage) || STAGES[0];
}

function trophyLine(trophy, isEarned) {
  const li = document.createElement('li');
  li.className = 'road-line' + (isEarned ? ' is-earned' : '');
  const mark = document.createElement('span');
  mark.className = 'road-mark';
  mark.textContent = isEarned ? '✓' : '·';
  const name = document.createElement('span');
  name.className = 'road-name';
  name.textContent = trophy.name;
  const grade = document.createElement('span');
  grade.className = 'badge badge-' + trophy.grade;
  grade.textContent = trophy.grade;
  li.append(mark, name, grade);
  if (trophy.missable) {
    const flag = document.createElement('span');
    flag.className = 'missable-flag';
    flag.textContent = 'MISSABLE';
    li.append(flag);
  }
  return li;
}

export function renderRoadmap(container, trophies, earnedIds) {
  container.replaceChildren();
  for (const stage of STAGES) {
    const inStage = trophies.filter((t) => t.stage === stage.id);
    if (!inStage.length) continue;
    const block = document.createElement('section');
    block.className = 'stage-block';
    const done = inStage.filter((t) => earnedIds.has(t.id)).length;
    const head = document.createElement('h3');
    head.textContent = stage.title;
    const count = document.createElement('span');
    count.className = 'stage-count';
    count.textContent = ' ' + done + '/' + inStage.length + ' earned';
    head.append(count);
    const blurb = document.createElement('p');
    blurb.className = 'stage-blurb';
    blurb.textContent = stage.blurb;
    const list = document.createElement('ul');
    list.className = 'road-list';
    for (const t of inStage) list.append(trophyLine(t, earnedIds.has(t.id)));
    block.append(head, blurb, list);
    container.append(block);
  }
}

// The Missables view: every trophy whose missable flag is set, with the
// note that explains why its official description makes it one-time.
export function renderMissables(container, trophies, earnedIds, onSelect) {
  container.replaceChildren();
  const flagged = trophies.filter((t) => t.missable);
  if (!flagged.length) {
    const p = document.createElement('p');
    p.textContent = 'No missable trophies on the official list.';
    container.append(p);
    return;
  }
  for (const t of flagged) {
    const card = document.createElement('article');
    card.className = 'missable-card';
    const head = document.createElement('h3');
    head.textContent = (earnedIds.has(t.id) ? '✓ ' : '⚠ ') + t.name;
    const desc = document.createElement('p');
    desc.className = 'missable-desc';
    desc.textContent = 'Official description: “' + t.description + '”';
    const note = document.createElement('p');
    note.className = 'missable-note';
    note.textContent = t.missableNote || '';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'open-guide-btn';
    btn.textContent = 'Open the full guide';
    btn.addEventListener('click', () => onSelect(t.id));
    card.append(head, desc, note, btn);
    container.append(card);
  }
}
