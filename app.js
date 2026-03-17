/* NutriMass - application principale */

const LS_KEY = 'nm7';
const MS_DAY = 24 * 60 * 60 * 1000;

const STATE = {
  i: [],   // [{id, s}]
  l: {},   // mealLog { 'YYYY-MM-DD': [{id, mom, ts}] }
  lc: {},  // lastConsumed { ingId: 'YYYY-MM-DD' }
  rd: {},  // remindersDone { key: 'YYYY-MM-DD' }
  c: {},   // cart { ingId: { active, qty, have } }
  cr: []   // recettes custom
};

let activePage = 'p-dash';
let notifTimer = null;
let remsVisible = false;
let deferredInstallPrompt = null;

function todayStr(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

function load() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    Object.assign(STATE, {
      i: [],
      l: {},
      lc: {},
      rd: {},
      c: {},
      cr: []
    }, data);
  } catch (err) {
    console.warn('LocalStorage blocked ou invalide', err);
  }
}

function save() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(STATE));
  } catch (err) {
    console.warn('LocalStorage bloqué', err);
  }
}

function getIngredient(id) {
  return INGREDIENTS.find(i => i.id === id);
}

function getRecipe(id) {
  return RECIPES.concat(STATE.cr).find(r => r.id === id);
}

function ingredientStatus(id) {
  const custom = STATE.i.find(x => x.id === id);
  if (custom) return custom.s;
  const ing = getIngredient(id);
  return ing ? ing.s : 'racheter';
}

function setIngredientStatus(id, status) {
  const existing = STATE.i.find(x => x.id === id);
  if (existing) {
    existing.s = status;
  } else {
    STATE.i.push({ id, s: status });
  }
  save();
}

function mOn(date) {
  return STATE.l[date] || [];
}

function dmac(date) {
  const meals = mOn(date);
  const tot = { k: 0, pr: 0, ca: 0, f: 0 };
  meals.forEach(m => {
    const r = getRecipe(m.id);
    if (!r || !r.mac) return;
    tot.k += r.mac.k;
    tot.pr += r.mac.pr;
    tot.ca += r.mac.ca;
    tot.f += r.mac.f;
  });
  return tot;
}

function tmac() {
  return dmac(todayStr());
}

function eToday(id) {
  return mOn(todayStr()).some(m => m.id === id);
}

function eWeek(id) {
  const today = new Date();
  const first = new Date(today.getTime() - 6 * MS_DAY);
  for (let d = first; d <= today; d = new Date(d.getTime() + MS_DAY)) {
    const key = todayStr(d);
    if (mOn(key).some(m => m.id === id)) return true;
  }
  return false;
}

function feas(rec) {
  const missing = [];
  const essentialMissing = [];
  rec.ings.forEach(i => {
    const status = ingredientStatus(i.id);
    if (status === 'racheter') {
      missing.push(i);
      if (i.k) essentialMissing.push(i);
    }
  });
  if (essentialMissing.length > 0 || missing.length > 2) {
    return { s: 'no', n: missing.length };
  }
  if (missing.length === 0) {
    return { s: 'ok', n: 0 };
  }
  return { s: 'al', n: missing.length };
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('show'), 2500);
}

function updateInstallBtn() {
  const btn = document.getElementById('btnInstall');
  if (!btn) return;
  btn.style.display = deferredInstallPrompt ? 'inline-flex' : 'none';
}

function tryInstall() {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  deferredInstallPrompt.userChoice.then(choice => {
    if (choice.outcome === 'accepted') {
      showToast('Installation acceptée ✅');
    } else {
      showToast('Installation annulée');
    }
    deferredInstallPrompt = null;
    updateInstallBtn();
  });
}

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredInstallPrompt = e;
  updateInstallBtn();
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  updateInstallBtn();
  showToast('Application installée ✅');
});

function renderHbar() {
  const mac = tmac();
  const keys = ['kcal', 'pro', 'car', 'fat', 'veg'];
  keys.forEach(key => {
    const el = document.querySelector(`.bar-fill[data-key="${key}"]`);
    const val = document.querySelector(`.bar-value[data-key="${key}"]`);
    const target = TARGETS[key] || 1;
    const percent = Math.min(100, Math.round((mac[key] || 0) / target * 100));
    if (el) el.style.width = `${percent}%`;
    if (val) val.textContent = `${percent}%`;
    if (key === 'kcal') {
      if (val) val.textContent = `${(mac[key]||0)}/${target} kcal`;
    }
  });

  const badge = document.getElementById('remBadge');
  const count = reminders().length;
  badge.textContent = count ? count : '';
}

function nav(page) {
  activePage = page;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('on'));
  document.getElementById(page).classList.add('on');
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.page === page));

  switch (page) {
    case 'p-dash': return rDash();
    case 'p-coll': return rColl();
    case 'p-stock': return rStock();
    case 'p-shop': return rShop();
    case 'p-reps': return rReps();
    case 'p-week': return rWeek();
  }
}

function openModal(title, bodyHtml) {
  const modal = document.getElementById('modal');
  document.getElementById('modalTitle').textContent = title;
  const body = document.getElementById('modalBody');
  body.innerHTML = '';
  if (typeof bodyHtml === 'string') {
    body.innerHTML = bodyHtml;
  } else if (bodyHtml instanceof Node) {
    body.appendChild(bodyHtml);
  }
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
}

function rtnTimestamp() {
  return Date.now();
}

function logMeal(id, mom) {
  const day = todayStr();
  if (!STATE.l[day]) STATE.l[day] = [];
  STATE.l[day].push({ id, mom, ts: rtnTimestamp() });
  const rec = getRecipe(id);
  if (rec) {
    rec.ings.forEach(ing => {
      STATE.lc[ing.id] = day;
    });
  }
  save();
  renderHbar();
  showToast('Repas enregistré ✔️');
  closeModal();
  if (activePage === 'p-reps') rReps();
  if (activePage === 'p-week') rWeek();
}

function rcCard(rec) {
  const f = feas(rec);
  const eaten = eToday(rec.id);
  const div = document.createElement('div');
  div.className = 'card';
  if (f.s === 'no') div.classList.add('disabled');
  if (eaten) div.style.border = '1px solid rgba(34,197,94,.6)';
  div.innerHTML = `
    <h3 class="card-title">${rec.n}</h3>
    <div class="card-meta">
      ${rec.tags.map(t => `<span>${t}</span>`).join('')}
    </div>
    <p class="card-desc">${rec.desc}</p>
    <div class="card-footer">
      <span class="pill pill-${f.s}">${f.s === 'ok' ? '✓ Faisable' : f.s === 'al' ? '-'+f.n : '✕'}</span>
      <span>${rec.p + rec.c} min</span>
    </div>
  `;
  div.addEventListener('click', () => {
    if (f.s === 'no') return;
    openRec(rec.id);
  });
  return div;
}

function openRec(id) {
  const rec = getRecipe(id);
  if (!rec) return;
  const f = feas(rec);
  const eaten = eToday(id);
  const container = document.createElement('div');

  const header = document.createElement('div');
  header.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;">
      <div>
        <h3 style="margin:0;">${rec.n}</h3>
        <div style="display:flex;gap:6px;margin-top:4px;flex-wrap:wrap;">
          ${rec.tags.map(t => `<span style="background:rgba(255,255,255,.08);padding:4px 8px;border-radius:999px;font-size:12px;">${t}</span>`).join('')}
        </div>
      </div>
      <div style="text-align:right;">
        <span class="pill pill-${f.s}">${f.s === 'ok' ? '✓ Faisable' : f.s === 'al' ? '-'+f.n : '✕'}</span>
        ${eaten ? '<div style="font-size:12px;color:var(--grn);margin-top:4px;">Déjà aujourd\'hui</div>' : ''}
      </div>
    </div>
  `;
  container.appendChild(header);

  const meta = document.createElement('div');
  meta.style.display = 'grid';
  meta.style.gridTemplateColumns = 'repeat(4,1fr)';
  meta.style.gap = '8px';
  meta.style.margin = '12px 0';
  meta.innerHTML = [`
    <div style="text-align:center;">
      <div style="font-size:12px;color:var(--t2);">Prep</div>
      <div style="font-weight:700;">${rec.p}m</div>
    </div>
    <div style="text-align:center;">
      <div style="font-size:12px;color:var(--t2);">Cuisson</div>
      <div style="font-weight:700;">${rec.c}m</div>
    </div>
    <div style="text-align:center;">
      <div style="font-size:12px;color:var(--t2);">Kcal</div>
      <div style="font-weight:700;">${rec.mac.k}</div>
    </div>
    <div style="text-align:center;">
      <div style="font-size:12px;color:var(--t2);">Prot</div>
      <div style="font-weight:700;">${rec.mac.pr}g</div>
    </div>
  `].join('');
  container.appendChild(meta);

  const desc = document.createElement('p');
  desc.style.margin = '0 0 12px';
  desc.textContent = rec.desc;
  container.appendChild(desc);

  const ingTitle = document.createElement('h4');
  ingTitle.textContent = 'Ingrédients';
  ingTitle.style.margin = '12px 0 6px';
  container.appendChild(ingTitle);

  const ul = document.createElement('ul');
  ul.style.paddingLeft = '18px';
  ul.style.margin = '0 0 12px';
  rec.ings.forEach(i => {
    const status = ingredientStatus(i.id);
    const ing = getIngredient(i.id) || { n: i.id };
    const li = document.createElement('li');
    li.style.marginBottom = '6px';
    li.style.color = status === 'racheter' ? 'rgba(239,68,68,.9)' : 'inherit';
    li.style.textDecoration = status === 'racheter' ? 'line-through' : 'none';
    li.innerHTML = `${i.k ? '⭐ ' : ''}${ing.n || i.id} • ${i.q}`;
    ul.appendChild(li);
  });
  container.appendChild(ul);

  const stepsTitle = document.createElement('h4');
  stepsTitle.textContent = 'Étapes';
  stepsTitle.style.margin = '0 0 6px';
  container.appendChild(stepsTitle);

  const ol = document.createElement('ol');
  ol.style.paddingLeft = '18px';
  rec.steps.forEach(step => {
    const li = document.createElement('li');
    li.style.marginBottom = '6px';
    li.textContent = step;
    ol.appendChild(li);
  });
  container.appendChild(ol);

  const logger = document.createElement('div');
  logger.style.marginTop = '14px';
  logger.innerHTML = `
    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
      <label style="font-size:12px;color:var(--t2);">Moment</label>
      <select id="logMoment" class="select" style="flex:1;">
        <option value="Déjeuner">Déjeuner</option>
        <option value="Dîner">Dîner</option>
      </select>
      <button class="btn primary" id="logMealBtn">Logger ce repas</button>
    </div>
  `;
  container.appendChild(logger);

  openModal(rec.n, container);
  document.getElementById('logMealBtn').addEventListener('click', () => {
    const mom = document.getElementById('logMoment').value;
    logMeal(id, mom);
  });
}

function sugererSoir() {
  const candidates = RECIPES.concat(STATE.cr).filter(r => {
    const f = feas(r);
    return f.s === 'ok' && !eToday(r.id) && !eWeek(r.id);
  });
  return candidates[0] || RECIPES[0];
}

function rDash() {
  const page = document.getElementById('p-dash');
  page.innerHTML = '';
  const suggested = sugererSoir();

  const hero = document.createElement('div');
  hero.className = 'card';
  hero.style.marginBottom = '14px';
  hero.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;">
      <div>
        <div style="font-size:12px;color:var(--t2);">💡 Suggestion du soir</div>
        <h3 style="margin:6px 0 8px;">${suggested.n}</h3>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;text-align:right;">
        <div style="font-size:12px;color:var(--t2);">${suggested.p+suggested.c}m</div>
        <div style="font-size:12px;color:var(--t2);">${suggested.mac.k} kcal</div>
      </div>
    </div>
    <p style="margin:10px 0 12px;color:var(--t2);">${suggested.desc}</p>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:6px;">
      <div style="font-size:12px;color:var(--t2);">Kcal</div>
      <div style="font-size:12px;color:var(--t2);">Prot</div>
      <div style="font-size:12px;color:var(--t2);">Gluc</div>
      <div style="font-size:12px;color:var(--t2);">Lip</div>
      <div style="font-weight:700;">${suggested.mac.k}</div>
      <div style="font-weight:700;color:var(--grn);">${suggested.mac.pr}g</div>
      <div style="font-weight:700;color:var(--blu);">${suggested.mac.ca}g</div>
      <div style="font-weight:700;color:var(--yel);">${suggested.mac.f}g</div>
    </div>
  `;
  hero.addEventListener('click', () => openRec(suggested.id));
  page.appendChild(hero);

  const sectionA = document.createElement('div');
  sectionA.innerHTML = '<h3 class="section-title">Faisable maintenant</h3>';
  const gridA = document.createElement('div');
  gridA.className = 'cards';
  RECIPES.concat(STATE.cr).forEach(r => {
    if (feas(r).s === 'ok') gridA.appendChild(rcCard(r));
  });
  if (!gridA.children.length) {
    const msg = document.createElement('p');
    msg.textContent = 'Aucune recette entièrement faisable. Ajuste ton stock.';
    sectionA.appendChild(msg);
  } else {
    sectionA.appendChild(gridA);
  }
  page.appendChild(sectionA);

  const sectionB = document.createElement('div');
  sectionB.innerHTML = '<h3 class="section-title">Il manque 1-2 ingrédients</h3>';
  const gridB = document.createElement('div');
  gridB.className = 'cards';
  RECIPES.concat(STATE.cr).forEach(r => {
    if (feas(r).s === 'al') gridB.appendChild(rcCard(r));
  });
  if (!gridB.children.length) {
    const msg = document.createElement('p');
    msg.textContent = 'Tu as tout ou il manque beaucoup. Mise à jour ton stock.';
    sectionB.appendChild(msg);
  } else {
    sectionB.appendChild(gridB);
  }
  page.appendChild(sectionB);

  renderHbar();
}

function rColl() {
  const page = document.getElementById('p-coll');
  page.innerHTML = '';
  const title = document.createElement('h3');
  title.className = 'section-title';
  title.textContent = 'Collations';
  page.appendChild(title);

  const reminderBlock = document.createElement('div');
  reminderBlock.style.background = 'rgba(255,255,255,.05)';
  reminderBlock.style.border = '1px solid rgba(255,255,255,.08)';
  reminderBlock.style.borderRadius = '14px';
  reminderBlock.style.padding = '12px';
  reminderBlock.style.marginBottom = '14px';
  reminderBlock.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <div>
        <div style="font-weight:700;">Rappels</div>
        <div style="font-size:12px;color:var(--t2);">10h30 🍎 Collation · 14h30 🍎 Collation</div>
      </div>
      <button class="btn primary" id="btnNotif">Activer</button>
    </div>
  `;
  page.appendChild(reminderBlock);

  document.getElementById('btnNotif').addEventListener('click', () => {
    reqNotif();
  });

  const grid = document.createElement('div');
  grid.className = 'cards';
  COLLATIONS.forEach(col => {
    const ingStatus = ingredientStatus(col.ing);
    const card = document.createElement('div');
    card.className = 'card';
    if (ingStatus === 'racheter') card.classList.add('disabled');
    card.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="font-size:22px;">${col.ico}</div>
        <div>
          <div style="font-weight:700;">${col.n}</div>
          <div style="font-size:12px;color:var(--t2);">${col.desc}</div>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;font-size:12px;">
        <span>${col.kcal} kcal • ${col.pro}g</span>
        <span style="color:${ingStatus==='racheter'? 'var(--red)' : 'var(--grn)'};">${ingStatus==='racheter'? 'Manque' : 'Dispo'}</span>
      </div>
    `;
    grid.appendChild(card);
  });
  page.appendChild(grid);

  const quick = document.createElement('div');
  quick.style.marginTop = '18px';
  quick.innerHTML = '<h3 class="section-title">Encas rapides</h3>';
  const grid2 = document.createElement('div');
  grid2.className = 'cards';
  SNACKS.forEach(sn => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-title">${sn.title}</div>
      <p class="card-desc">${sn.desc}</p>
      <div class="card-footer">
        <span>${sn.kcal} kcal</span>
        <span>${sn.tags.join(' · ')}</span>
      </div>
    `;
    grid2.appendChild(card);
  });
  quick.appendChild(grid2);
  page.appendChild(quick);

  renderHbar();
}

function rStock() {
  const page = document.getElementById('p-stock');
  page.innerHTML = '';
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.style.marginBottom = '16px';
  header.innerHTML = `
    <h3 class="section-title" style="margin:0;">Stock</h3>
    <div style="display:flex;gap:8px;">
      <button class="btn primary" id="btnAddIng">+ Ajouter</button>
      <button class="btn" id="btnAllOk">Tout ✓</button>
    </div>
  `;
  page.appendChild(header);

  document.getElementById('btnAddIng').addEventListener('click', openAddIngForm);
  document.getElementById('btnAllOk').addEventListener('click', () => {
    INGREDIENTS.forEach(i => setIngredientStatus(i.id, 'dispo'));
    showToast('Stock mis à jour');
    rStock();
  });

  const hint = document.createElement('p');
  hint.style.fontSize = '13px';
  hint.style.color = 'var(--t2)';
  hint.textContent = '🛒 = ajouter à la liste · 🗑 = supprimer';
  page.appendChild(hint);

  const groups = {};
  INGREDIENTS.forEach(i => {
    groups[i.cat] = groups[i.cat] || [];
    groups[i.cat].push(i);
  });

  Object.keys(groups).forEach(cat => {
    const section = document.createElement('div');
    section.style.marginTop = '14px';
    section.innerHTML = `<h4 style="margin:0 0 10px;">${cat}</h4>`;
    groups[cat].forEach(i => {
      const status = ingredientStatus(i.id);
      const inCart = STATE.c[i.id] && STATE.c[i.id].active;
      const line = document.createElement('div');
      line.style.display = 'flex';
      line.style.alignItems = 'center';
      line.style.justifyContent = 'space-between';
      line.style.padding = '10px 12px';
      line.style.borderRadius = '14px';
      line.style.marginBottom = '8px';
      line.style.background = 'rgba(255,255,255,.05)';
      if (inCart) {
        line.style.opacity = '.6';
        line.style.textDecoration = 'line-through';
      }
      line.innerHTML = `
        <div style="flex:1;">
          <div style="font-weight:700;">${i.n}</div>
          <div style="font-size:12px;color:var(--t2);">${i.qty} ${i.p ? '• ' + i.p.toFixed(2) + '€' : ''}</div>
          ${i.r ? `<div style="font-size:12px;color:var(--t2);">Rappel: ${i.r.d}j</div>` : ''}
        </div>
        <div style="display:flex;gap:6px;">
          <button class="btn" data-action="cart" data-id="${i.id}">🛒</button>
          <button class="btn danger" data-action="del" data-id="${i.id}">🗑</button>
        </div>
      `;
      section.appendChild(line);
    });
    page.appendChild(section);
  });

  page.querySelectorAll('button[data-action="cart"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      togCart(id);
      rStock();
      rShop();
    });
  });
  page.querySelectorAll('button[data-action="del"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      if (confirm('Supprimer cet ingrédient du stock ?')) {
        setIngredientStatus(id, 'racheter');
        save();
        rStock();
      }
    });
  });

  renderHbar();
}

function togCart(id) {
  const item = STATE.c[id] || { active: false, qty: 1, have: false };
  item.active = !item.active;
  STATE.c[id] = item;
  save();
}

function openAddIngForm() {
  const form = document.createElement('div');
  form.innerHTML = `
    <p style="font-size:13px;color:var(--t2);margin:0 0 12px;">Ajouter un ingrédient personnalisé au stock.</p>
    <input class="input" id="newIngName" placeholder="Nom (ex: Brocoli)" />
    <input class="input" id="newIngQty" placeholder="Quantité recommandée" />
    <input class="input" id="newIngPrice" placeholder="Prix estimé (€)" type="number" step="0.1" />
    <input class="input" id="newIngRecall" placeholder="Rappel (jours)" type="number" />
    <button class="btn primary" id="saveNewIng">Enregistrer</button>
  `;
  openModal('Ajouter un ingrédient', form);
  document.getElementById('saveNewIng').addEventListener('click', () => {
    const name = document.getElementById('newIngName').value.trim();
    const qty = document.getElementById('newIngQty').value.trim();
    const price = parseFloat(document.getElementById('newIngPrice').value);
    const recall = parseInt(document.getElementById('newIngRecall').value, 10);
    if (!name) return showToast('Nom requis');
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const existing = INGREDIENTS.find(i => i.id === id);
    if (existing) return showToast('Ingrédient existe déjà');
    const ing = {
      id,
      n: name,
      cat: 'Custom',
      s: 'dispo',
      qty: qty || '',
      p: isNaN(price) ? 0 : price,
      r: isNaN(recall) ? null : { d: recall, l: name }
    };
    INGREDIENTS.push(ing);
    setIngredientStatus(id, 'dispo');
    showToast('Ingrédient ajouté');
    closeModal();
    rStock();
  });
}

function rShop() {
  const page = document.getElementById('p-shop');
  page.innerHTML = '';
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.style.marginBottom = '16px';
  header.innerHTML = `<h3 class="section-title" style="margin:0;">Courses</h3>`;
  page.appendChild(header);

  const items = Object.entries(STATE.c).filter(([_, v]) => v.active);
  const total = items.reduce((sum, [id, v]) => {
    const ing = getIngredient(id);
    return sum + (ing ? ing.p * (v.qty || 1) : 0);
  }, 0);

  const totalBlock = document.createElement('div');
  totalBlock.style.display = 'flex';
  totalBlock.style.justifyContent = 'space-between';
  totalBlock.style.alignItems = 'center';
  totalBlock.style.marginBottom = '12px';
  totalBlock.innerHTML = `
    <div>Estimation: <strong>${total.toFixed(2)} €</strong></div>
    <div style="display:flex;gap:8px;">
      <button class="btn" id="btnClearGot">Retirer ✓</button>
      <button class="btn" id="btnClearAll">Tout eu ✓</button>
    </div>
  `;
  page.appendChild(totalBlock);

  document.getElementById('btnClearGot').addEventListener('click', clearGot);
  document.getElementById('btnClearAll').addEventListener('click', () => {
    items.forEach(([id]) => setHave(id, true));
    save();
    rShop();
  });

  const progress = document.createElement('div');
  const found = items.filter(([_, v]) => v.have).length;
  const ratio = items.length ? Math.round(found / items.length * 100) : 0;
  progress.style.marginBottom = '12px';
  progress.innerHTML = `
    <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--t2);">
      <span>${found}/${items.length} trouvés</span>
      <span>${ratio}%</span>
    </div>
    <div style="height:10px;border-radius:999px;background:rgba(255,255,255,.1);overflow:hidden;">
      <div style="width:${ratio}%;height:100%;background:var(--grn);"></div>
    </div>
  `;
  page.appendChild(progress);

  items.forEach(([id, v]) => {
    const ing = getIngredient(id);
    const line = document.createElement('div');
    line.style.display = 'flex';
    line.style.alignItems = 'center';
    line.style.justifyContent = 'space-between';
    line.style.padding = '10px 12px';
    line.style.borderRadius = '14px';
    line.style.marginBottom = '10px';
    line.style.background = 'rgba(255,255,255,.05)';
    if (v.have) line.style.opacity = '.6';

    line.innerHTML = `
      <div style="flex:1;">
        <div style="font-weight:700;">${ing?.n || id}</div>
        <div style="font-size:12px;color:var(--t2);">${ing?.qty || ''} ${ing?.p ? '• ' + ing.p.toFixed(2) + '€' : ''}</div>
      </div>
      <div style="display:flex;gap:8px;align-items:center;">
        <button class="btn" data-action="setHave" data-id="${id}" data-val="${v.have ? '0' : '1'}">${v.have ? '✕' : '✓'}</button>
        <button class="btn danger" data-action="remove" data-id="${id}">🗑</button>
      </div>
    `;
    page.appendChild(line);
  });

  page.querySelectorAll('button[data-action="setHave"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const val = btn.dataset.val === '1';
      setHave(id, val);
      rShop();
    });
  });

  page.querySelectorAll('button[data-action="remove"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      if (confirm('Supprimer de la liste ?')) {
        delete STATE.c[id];
        save();
        rShop();
      }
    });
  });

  document.getElementById('shopBadge').textContent = items.length ? items.length : '';
}

function setHave(id, val) {
  if (!STATE.c[id]) return;
  STATE.c[id].have = val;
  save();
}

function clearGot() {
  Object.keys(STATE.c).forEach(id => {
    if (STATE.c[id].have) delete STATE.c[id];
  });
  save();
  rShop();
}

function rReps() {
  const page = document.getElementById('p-reps');
  page.innerHTML = '';
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.style.marginBottom = '16px';
  header.innerHTML = `
    <h3 class="section-title" style="margin:0;">Repas</h3>
    <button class="btn primary" id="btnAddRec">+ Ajouter</button>
  `;
  page.appendChild(header);

  document.getElementById('btnAddRec').addEventListener('click', openAddRecipeForm);

  const filters = document.createElement('div');
  filters.style.display = 'flex';
  filters.style.gap = '8px';
  filters.style.overflowX = 'auto';
  filters.style.paddingBottom = '10px';
  filters.style.marginBottom = '14px';
  const tags = ['Tous','⚡ Rapide','❄️ Froid','🔥 Chaud','🥦 Végé','💪 Prot','📈 Masse','📦 Batch','📸 Insta','✅ Faisable'];
  tags.forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.style.flex = '0 0 auto';
    btn.textContent = t;
    btn.dataset.tag = t;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderRecipes(t);
    });
    btn.classList.add('filter-btn');
    if (t === 'Tous') btn.classList.add('active');
    filters.appendChild(btn);
  });
  page.appendChild(filters);

  const container = document.createElement('div');
  container.id = 'recipesGrid';
  container.className = 'cards';
  page.appendChild(container);

  function renderRecipes(filter) {
    const all = RECIPES.concat(STATE.cr);
    let list = all.slice();
    if (filter && filter !== 'Tous') {
      if (filter === '✅ Faisable') {
        list = list.filter(r => feas(r).s === 'ok');
      } else {
        const tag = filter.split(' ').pop().toLowerCase();
        list = list.filter(r => r.tags.includes(tag));
      }
    }
    list.sort((a, b) => {
      const fa = feas(a).s;
      const fb = feas(b).s;
      if (fa !== fb) return fa === 'ok' ? -1 : 1;
      const ta = eToday(a.id) ? 1 : 0;
      const tb = eToday(b.id) ? 1 : 0;
      return ta - tb;
    });
    container.innerHTML = '';
    list.forEach(r => container.appendChild(rcCard(r)));
  }

  renderRecipes('Tous');

  renderHbar();
}

function openAddRecipeForm() {
  const form = document.createElement('div');
  form.innerHTML = `
    <p style="font-size:13px;color:var(--t2);margin:0 0 12px;">Ajoute ta propre recette.</p>
    <input class="input" id="newRecName" placeholder="Nom de la recette" />
    <input class="input" id="newRecDesc" placeholder="Description courte" />
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
      <input class="input" id="newRecPrep" placeholder="Prépa (min)" type="number" />
      <input class="input" id="newRecCook" placeholder="Cuisson (min)" type="number" />
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
      <input class="input" id="newRecKcal" placeholder="Kcal" type="number" />
      <input class="input" id="newRecProt" placeholder="Prot (g)" type="number" />
    </div>
    <input class="input" id="newRecTags" placeholder="Tags (virgule)" />
    <textarea class="textarea" id="newRecIngs" placeholder="Ingrédients (id:quantité:essentiel) une par ligne"></textarea>
    <textarea class="textarea" id="newRecSteps" placeholder="Étapes (une par ligne)"></textarea>
    <button class="btn primary" id="saveNewRec">Sauvegarder</button>
  `;
  openModal('Ajouter une recette', form);
  document.getElementById('saveNewRec').addEventListener('click', () => {
    const name = document.getElementById('newRecName').value.trim();
    if (!name) return showToast('Nom requis');
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const desc = document.getElementById('newRecDesc').value.trim();
    const p = parseInt(document.getElementById('newRecPrep').value, 10) || 0;
    const c = parseInt(document.getElementById('newRecCook').value, 10) || 0;
    const k = parseInt(document.getElementById('newRecKcal').value, 10) || 0;
    const pr = parseInt(document.getElementById('newRecProt').value, 10) || 0;
    const tags = document.getElementById('newRecTags').value.split(',').map(t => t.trim()).filter(Boolean);
    const ings = document.getElementById('newRecIngs').value.split('\n').map(line => line.trim()).filter(Boolean).map(line => {
      const [id, q, kf] = line.split(':');
      return { id: id.trim(), q: q?.trim() || '', k: !!kf };
    });
    const steps = document.getElementById('newRecSteps').value.split('\n').map(s => s.trim()).filter(Boolean);
    STATE.cr.push({ id, n: name, cat: 'Déj / Dîner', tags, desc, p, c, mac: { k, pr, ca: 0, f: 0 }, custom: true, ings, steps });
    save();
    showToast('Recette ajoutée');
    closeModal();
    rReps();
  });
}

function rWeek() {
  const page = document.getElementById('p-week');
  page.innerHTML = '';
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.style.marginBottom = '14px';
  header.innerHTML = `<h3 class="section-title" style="margin:0;">Semaine</h3>`;
  page.appendChild(header);

  const today = new Date();
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today.getTime() - ((6 - i) * MS_DAY));
    days.push(d);
  }

  const grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(7, 1fr)';
  grid.style.gap = '10px';
  grid.style.marginBottom = '16px';

  days.forEach(d => {
    const key = todayStr(d);
    const mac = dmac(key);
    const dayName = d.toLocaleDateString('fr-FR', { weekday: 'short' });
    const card = document.createElement('div');
    card.style.background = 'rgba(255,255,255,.05)';
    card.style.padding = '10px';
    card.style.borderRadius = '14px';
    card.style.cursor = 'pointer';
    card.innerHTML = `
      <div style="font-size:12px;color:var(--t2);">${dayName}</div>
      <div style="font-weight:700;">${d.getDate()}</div>
      <div style="font-size:12px;color:var(--t2);margin-top:6px;">${mac.k} kcal</div>
    `;
    card.addEventListener('click', () => {
      openDayDetails(key);
    });
    grid.appendChild(card);
  });
  page.appendChild(grid);

  const cum = { k: 0, pr: 0, ca: 0, f: 0, veg: 0 };
  days.forEach(d => {
    const mac = dmac(todayStr(d));
    cum.k += mac.k;
    cum.pr += mac.pr;
    cum.ca += mac.ca;
    cum.f += mac.f;
  });

  const chipRow = document.createElement('div');
  chipRow.style.display = 'flex';
  chipRow.style.gap = '10px';
  chipRow.style.flexWrap = 'wrap';
  chipRow.style.marginBottom = '16px';
  const chips = [
    { label: 'Kcal', value: cum.k, col: 'var(--ora)' },
    { label: 'Prot', value: cum.pr, col: 'var(--grn)' },
    { label: 'Gluc', value: cum.ca, col: 'var(--blu)' },
    { label: 'Lip', value: cum.f, col: 'var(--yel)' }
  ];
  chips.forEach(ch => {
    const chip = document.createElement('div');
    chip.style.padding = '8px 12px';
    chip.style.borderRadius = '999px';
    chip.style.background = 'rgba(255,255,255,.06)';
    chip.style.color = ch.col;
    chip.style.fontWeight = '700';
    chip.textContent = `${ch.label}: ${ch.value}`;
    chipRow.appendChild(chip);
  });
  page.appendChild(chipRow);

  const detail = document.createElement('div');
  detail.id = 'weekDetail';
  page.appendChild(detail);

  function openDayDetails(day) {
    const meals = mOn(day);
    const container = document.createElement('div');
    container.innerHTML = `<h4 style="margin:0 0 10px;">${day}</h4>`;
    if (!meals.length) {
      const p = document.createElement('p');
      p.textContent = 'Aucun repas enregistré.';
      container.appendChild(p);
    } else {
      meals.forEach(meal => {
        const rec = getRecipe(meal.id);
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.alignItems = 'center';
        row.style.padding = '10px 12px';
        row.style.borderRadius = '14px';
        row.style.marginBottom = '10px';
        row.style.background = 'rgba(255,255,255,.05)';
        row.innerHTML = `
          <div>
            <div style="font-weight:700;">${rec?.n || meal.id}</div>
            <div style="font-size:12px;color:var(--t2);">${meal.mom} • ${new Date(meal.ts).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div>
          </div>
          <button class="btn danger" data-id="${meal.ts}">✕</button>
        `;
        row.querySelector('button').addEventListener('click', () => {
          STATE.l[day] = STATE.l[day].filter(m => m.ts !== meal.ts);
          save();
          openDayDetails(day);
          if (activePage === 'p-week') rWeek();
        });
        container.appendChild(row);
      });
    }
    const detail = document.getElementById('weekDetail');
    detail.innerHTML = '';
    detail.appendChild(container);
  }

  renderHbar();
}

function reminders() {
  const today = todayStr();
  const list = [];
  INGREDIENTS.forEach(ing => {
    const status = ingredientStatus(ing.id);
    if (!ing.r && status !== 'racheter') return;
    const key = `rem_${ing.id}`;
    if (STATE.rd[key] === today) return;
    const last = STATE.lc[ing.id];
    const diffDays = last ? Math.floor((new Date(today) - new Date(last)) / MS_DAY) : null;
    const needed = status === 'racheter' ? true : (!last || diffDays >= ing.r.d);
    const urgent = status === 'racheter' || (last && ing.r && diffDays >= ing.r.d * 1.5);
    if (!needed) return;
    list.push({ id: ing.id, label: ing.r?.l || ing.n, urgent, status, last, diffDays });
  });
  return list;
}

function showRems() {
  const container = document.getElementById('rems');
  container.innerHTML = '';
  const list = reminders();
  list.forEach(r => {
    const card = document.createElement('div');
    card.className = 'rem-card';
    if (r.urgent) card.classList.add('urgent');
    card.innerHTML = `
      <div class="rem-title">${r.label}</div>
      <div class="rem-meta">${r.urgent ? 'Urgent' : 'À consommer'}</div>
      <div class="rem-actions">
        <button class="btn" data-id="${r.id}">✅ OK</button>
      </div>
    `;
    container.appendChild(card);
    setTimeout(() => card.classList.add('show'), 50);
  });
  container.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => dimR(btn.dataset.id));
  });
}

function togRems() {
  remsVisible = !remsVisible;
  const container = document.getElementById('rems');
  if (remsVisible) {
    showRems();
  } else {
    container.innerHTML = '';
  }
}

function dimR(id) {
  const key = `rem_${id}`;
  STATE.rd[key] = todayStr();
  save();
  showRems();
  renderHbar();
}

function reqNotif() {
  if (!('Notification' in window)) {
    showToast('Notifications non supportées');
    return;
  }
  Notification.requestPermission().then(p => {
    showToast(p === 'granted' ? 'Notifications activées' : 'Permission refusée');
  });
}

function checkNotifTime() {
  if (Notification.permission !== 'granted') return;
  const now = new Date();
  const hhmm = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  const key = `notif_${todayStr()}_${hhmm}`;
  if (STATE.rd[key]) return;
  if (hhmm === '10:30') {
    new Notification('Heure de ta collation ! 🍎', { body: 'Amandes, noix ou fruit.' });
    STATE.rd[key] = true;
    save();
  }
  if (hhmm === '14:30') {
    new Notification('Collation de l\'après-midi ! 🥜', { body: 'Pistaches, choco noir ou pain.' });
    STATE.rd[key] = true;
    save();
  }
}

function init() {
  load();
  renderHbar();
  document.getElementById('tabbar').addEventListener('click', e => {
    const btn = e.target.closest('button[data-page]');
    if (!btn) return;
    nav(btn.dataset.page);
  });

  document.getElementById('modal').addEventListener('click', e => {
    if (e.target.dataset.action === 'close' || e.target.classList.contains('modal-overlay')) {
      closeModal();
    }
  });

  document.getElementById('btnRem').addEventListener('click', () => {
    togRems();
  });

  const installBtn = document.getElementById('btnInstall');
  if (installBtn) {
    installBtn.addEventListener('click', () => {
      tryInstall();
    });
  }

  updateInstallBtn();
  nav(activePage);

  if (notifTimer) clearInterval(notifTimer);
  notifTimer = setInterval(checkNotifTime, 30_000);
  checkNotifTime();
}

init();
