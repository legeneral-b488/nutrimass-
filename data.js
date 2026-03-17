/* NutriMass - données ingrédients, recettes, collations */

const TARGETS = {
  kcal: 3000,
  pro: 175,
  car: 360,
  fat: 85,
  veg: 5
};

const VEG_IDS = [
  'brocolis','choux_brux','chou_fleur','haricots_verts','poireaux','carottes','tomates','concombre','salade','mais','chou_rouge','betteraves','avocats','oignons','ail','courgettes','roquette','tomates_cerise'
];

const INGREDIENTS = [
  { id: 'poulet', n: 'Blancs de poulet', cat: 'Protéines animales', s: 'dispo', qty: '200-250g', p: 2.20, r: null },
  { id: 'sg5', n: 'Steak haché 5%', cat: 'Protéines animales', s: 'dispo', qty: '200g', p: 2.50, r: null },
  { id: 'sg10', n: 'Steak haché 10%', cat: 'Protéines animales', s: 'dispo', qty: '200g', p: 2.20, r: null },
  { id: 'bavette', n: 'Bœuf bavette', cat: 'Protéines animales', s: 'dispo', qty: '200g', p: 3.50, r: null },
  { id: 'foie_boeuf', n: 'Foie de bœuf', cat: 'Protéines animales', s: 'dispo', qty: '200g', p: 2.50, r: { d: 14, l: 'Foie' } },
  { id: 'sardines', n: 'Sardines à l\'huile', cat: 'Protéines animales', s: 'dispo', qty: '1 boîte', p: 1.50, r: { d: 7, l: 'Sardines' } },
  { id: 'saumon', n: 'Saumon (pavé)', cat: 'Protéines animales', s: 'dispo', qty: '200g', p: 5.00, r: null },
  { id: 'crevettes', n: 'Crevettes décortiquées', cat: 'Protéines animales', s: 'dispo', qty: '200g', p: 6.00, r: null },
  { id: 'moules', n: 'Moules', cat: 'Protéines animales', s: 'dispo', qty: '500g', p: 3.00, r: { d: 21, l: 'Moules' } },
  { id: 'oeufs', n: 'Œufs', cat: 'Protéines animales', s: 'dispo', qty: '12 œufs', p: 2.50, r: { d: 3, l: 'Œufs' } },
  { id: 'jambon', n: 'Jambon blanc', cat: 'Protéines animales', s: 'dispo', qty: '4 tranches', p: 2.50, r: null },
  { id: 'lardons', n: 'Lardons', cat: 'Protéines animales', s: 'dispo', qty: '200g', p: 2.00, r: null },
  { id: 'skyr', n: 'Skyr', cat: 'Protéines animales', s: 'dispo', qty: '2×500g', p: 3.50, r: null },
  { id: 'whey', n: 'Whey protéine', cat: 'Protéines animales', s: 'dispo', qty: '1 kg', p: 0.80, r: null },

  { id: 'lentilles', n: 'Lentilles', cat: 'Protéines végétales', s: 'dispo', qty: '500g', p: 1.50, r: { d: 3, l: 'Lentilles' } },
  { id: 'pois_chiches', n: 'Pois chiches', cat: 'Protéines végétales', s: 'dispo', qty: '2 boîtes', p: 2.00, r: { d: 3, l: 'Pois chiches' } },
  { id: 'haricots_rouges', n: 'Haricots rouges', cat: 'Protéines végétales', s: 'dispo', qty: '2 boîtes', p: 1.80, r: null },
  { id: 'edamame', n: 'Edamame surgelé', cat: 'Protéines végétales', s: 'dispo', qty: '400g', p: 3.50, r: null },
  { id: 'tofu', n: 'Tofu ferme', cat: 'Protéines végétales', s: 'dispo', qty: '400g', p: 2.50, r: null },

  { id: 'riz', n: 'Riz', cat: 'Féculents', s: 'dispo', qty: '1 kg', p: 2.00, r: null },
  { id: 'pates', n: 'Pâtes', cat: 'Féculents', s: 'dispo', qty: '500g', p: 1.50, r: null },
  { id: 'avoine', n: 'Flocons d\'avoine', cat: 'Féculents', s: 'dispo', qty: '1 kg', p: 2.00, r: null },
  { id: 'pommes_terre', n: 'Pommes de terre', cat: 'Féculents', s: 'dispo', qty: '1 kg', p: 2.00, r: null },
  { id: 'patate_douce', n: 'Patates douces', cat: 'Féculents', s: 'dispo', qty: '1 kg', p: 2.50, r: null },
  { id: 'semoule', n: 'Semoule', cat: 'Féculents', s: 'dispo', qty: '500g', p: 1.50, r: null },
  { id: 'pain_complet', n: 'Pain complet', cat: 'Féculents', s: 'dispo', qty: '1 tranche épaisse', p: 3.00, r: null },
  { id: 'pain_burger', n: 'Pains burger', cat: 'Féculents', s: 'dispo', qty: '4 pains', p: 2.50, r: null },
  { id: 'tortillas', n: 'Tortillas (wraps)', cat: 'Féculents', s: 'dispo', qty: '8 tortillas', p: 2.50, r: null },

  { id: 'brocolis', n: 'Brocolis', cat: 'Légumes', s: 'dispo', qty: '500g', p: 2.00, r: null },
  { id: 'chou_fleur', n: 'Chou-fleur', cat: 'Légumes', s: 'dispo', qty: '1 pièce', p: 2.00, r: null },
  { id: 'haricots_verts', n: 'Haricots verts', cat: 'Légumes', s: 'dispo', qty: '400g', p: 2.00, r: null },
  { id: 'carottes', n: 'Carottes', cat: 'Légumes', s: 'dispo', qty: '1 kg', p: 1.50, r: null },
  { id: 'oignons', n: 'Oignons', cat: 'Légumes', s: 'dispo', qty: '1 filet', p: 1.50, r: null },
  { id: 'ail', n: 'Ail', cat: 'Légumes', s: 'dispo', qty: '1 tête', p: 0.80, r: null },
  { id: 'concombre', n: 'Concombre', cat: 'Légumes', s: 'dispo', qty: '2 pièces', p: 1.80, r: null },
  { id: 'tomates', n: 'Tomates', cat: 'Légumes', s: 'dispo', qty: '500g', p: 2.50, r: null },
  { id: 'tomates_cerise', n: 'Tomates cerises', cat: 'Légumes', s: 'dispo', qty: '250g', p: 2.50, r: null },
  { id: 'avocats', n: 'Avocats', cat: 'Légumes', s: 'dispo', qty: '3-4 pièces', p: 3.00, r: null },
  { id: 'mais', n: 'Maïs (boîte)', cat: 'Légumes', s: 'dispo', qty: '1 boîte 400g', p: 1.20, r: null },
  { id: 'chou_rouge', n: 'Chou rouge', cat: 'Légumes', s: 'dispo', qty: '1/2 chou', p: 1.50, r: null },
  { id: 'courgettes', n: 'Courgettes', cat: 'Légumes', s: 'dispo', qty: '2 pièces', p: 2.00, r: null },
  { id: 'roquette', n: 'Roquette', cat: 'Légumes', s: 'dispo', qty: '1 sachet 100g', p: 2.00, r: null },
  { id: 'salade', n: 'Salade verte', cat: 'Légumes', s: 'dispo', qty: '1 sachet', p: 1.50, r: null },

  { id: 'bananes', n: 'Bananes', cat: 'Fruits', s: 'dispo', qty: '1 régime', p: 2.00, r: null },
  { id: 'fruits_rouges', n: 'Fruits rouges surgelés', cat: 'Fruits', s: 'dispo', qty: '1 kg', p: 3.50, r: null },
  { id: 'citrons', n: 'Citrons', cat: 'Fruits', s: 'dispo', qty: '4-6 pièces', p: 1.50, r: null },
  { id: 'pommes', n: 'Pommes', cat: 'Fruits', s: 'dispo', qty: '6 pièces', p: 2.50, r: null },
  { id: 'poire', n: 'Poires', cat: 'Fruits', s: 'dispo', qty: '4 pièces', p: 2.50, r: null },
  { id: 'mangue', n: 'Mangue', cat: 'Fruits', s: 'dispo', qty: '1-2 pièces', p: 2.50, r: null },

  { id: 'huile_olive', n: 'Huile d\'olive', cat: 'Graisses', s: 'dispo', qty: '1 bouteille', p: 5.00, r: null },
  { id: 'beurre_cac', n: 'Beurre de cacahuète', cat: 'Graisses', s: 'dispo', qty: '1 pot 500g', p: 4.00, r: null },
  { id: 'noix', n: 'Noix', cat: 'Graisses', s: 'dispo', qty: '200g', p: 3.50, r: { d: 5, l: 'Noix' } },
  { id: 'amandes', n: 'Amandes', cat: 'Graisses', s: 'dispo', qty: '200g', p: 3.50, r: { d: 5, l: 'Amandes' } },
  { id: 'pistaches', n: 'Pistaches', cat: 'Graisses', s: 'dispo', qty: '150g', p: 4.00, r: { d: 5, l: 'Pistaches' } },
  { id: 'graines_courge', n: 'Graines de courge', cat: 'Graisses', s: 'dispo', qty: '150g', p: 2.50, r: { d: 5, l: 'Graines de courge' } },
  { id: 'graines_chia', n: 'Graines de chia', cat: 'Graisses', s: 'dispo', qty: '150g', p: 3.00, r: null },
  { id: 'feta', n: 'Feta', cat: 'Graisses', s: 'dispo', qty: '200g', p: 2.50, r: null },
  { id: 'fromage_rape', n: 'Fromage râpé', cat: 'Graisses', s: 'dispo', qty: '200g', p: 2.50, r: null },
  { id: 'cheddar', n: 'Cheddar', cat: 'Graisses', s: 'dispo', qty: '150g', p: 3.00, r: null },

  { id: 'pesto', n: 'Pesto', cat: 'Sauces', s: 'dispo', qty: '1 pot', p: 3.00, r: null },
  { id: 'sauce_soja', n: 'Sauce soja', cat: 'Sauces', s: 'dispo', qty: '1 bouteille', p: 2.50, r: null },
  { id: 'parmesan', n: 'Parmesan', cat: 'Sauces', s: 'dispo', qty: '100g', p: 2.50, r: null },
  { id: 'coulis_tomate', n: 'Coulis de tomate', cat: 'Sauces', s: 'dispo', qty: '1 bocal', p: 2.00, r: null },
  { id: 'lait_coco', n: 'Lait de coco', cat: 'Sauces', s: 'dispo', qty: '1 boîte', p: 2.00, r: null },
  { id: 'paprika', n: 'Paprika', cat: 'Sauces', s: 'dispo', qty: '1 pot', p: 1.50, r: { d: 5, l: 'Paprika' } },
  { id: 'curry', n: 'Curry', cat: 'Sauces', s: 'dispo', qty: '1 pot', p: 1.50, r: { d: 5, l: 'Curry' } },
  { id: 'curcuma', n: 'Curcuma', cat: 'Sauces', s: 'dispo', qty: '1 pot', p: 1.50, r: null },
  { id: 'miel', n: 'Miel', cat: 'Sauces', s: 'dispo', qty: '1 pot', p: 3.00, r: null },
  { id: 'herbes_prov', n: 'Herbes de Provence', cat: 'Sauces', s: 'dispo', qty: '1 pot', p: 1.50, r: null },
  { id: 'sel', n: 'Sel', cat: 'Sauces', s: 'dispo', qty: '1 pot', p: 1.00, r: null },

  { id: 'dattes', n: 'Dattes', cat: 'Encas', s: 'dispo', qty: '200g', p: 3.00, r: null },
  { id: 'choco_noir', n: 'Chocolat noir 85%', cat: 'Encas', s: 'dispo', qty: '100g', p: 2.50, r: { d: 4, l: 'Choco noir' } },
  { id: 'melange_noix', n: 'Mélange de noix', cat: 'Encas', s: 'dispo', qty: '200g', p: 4.00, r: { d: 5, l: 'Mélange' } },
  { id: 'raisins_secs', n: 'Raisins secs', cat: 'Encas', s: 'dispo', qty: '200g', p: 2.00, r: null }
];

const COLLATIONS = [
  { id:'col_amandes', n:'Amandes', ico:'🥜', ing:'amandes', kcal:160, pro:6, desc:'20-25g • Graisses saines' },
  { id:'col_noix', n:'Noix', ico:'🌰', ing:'noix', kcal:130, pro:3, desc:'15-20g • Oméga-3' },
  { id:'col_choco', n:'Chocolat noir 85%', ico:'🍫', ing:'choco_noir', kcal:120, pro:2, desc:'2 carrés • Antioxydants' },
  { id:'col_pistaches', n:'Pistaches', ico:'🟢', ing:'pistaches', kcal:140, pro:5, desc:'25-30g • Protéines + fibres' },
  { id:'col_pomme', n:'Pomme ou poire', ico:'🍎', ing:'pommes', kcal:80, pro:0, desc:'1 fruit • Fibres naturelles' },
  { id:'col_pain_beurre', n:'Pain complet + beurre cac.', ico:'🍞', ing:'pain_complet', kcal:280, pro:9, desc:'1 tranche + 1 c.à.s.' }
];

const SNACKS = [
  { id:'snack_1', title:'Omelette rapide', desc:'4 œufs + pain complet + légumes', tags:['rapide','prot'], kcal:720 },
  { id:'snack_2', title:'Shake avoine whey', desc:'Avoine + whey + lait', tags:['rapide','prot'], kcal:550 },
  { id:'snack_3', title:'Bowl fruits rouges', desc:'Fruits rouges + yaourt + graines', tags:['vege','insta'], kcal:420 },
  { id:'snack_4', title:'Wrap avocat poulet', desc:'Tortilla + poulet + avocat', tags:['prot','mass'], kcal:760 },
  { id:'snack_5', title:'Salade lentilles feta', desc:'Lentilles + feta + tomates', tags:['vege','bat'], kcal:580 },
  { id:'snack_6', title:'Pâtes au pesto', desc:'Pâtes + poulet + pesto', tags:['rapide','prot'], kcal:750 }
];

const RECIPES = [
  {
    id: 'poulet_riz',
    n: 'Poulet riz brocolis',
    cat: 'Déj / Dîner',
    tags: ['chaud','prot','mass'],
    desc: 'Poulet grillé, riz complet et brocolis vapeur.',
    p: 15,
    c: 20,
    mac: { k: 680, pr: 58, ca: 70, f: 18 },
    custom: false,
    ings: [
      { id: 'poulet', q: '200g', k: true },
      { id: 'riz', q: '120g', k: true },
      { id: 'brocolis', q: '150g', k: true },
      { id: 'huile_olive', q: '1 c.à.s', k: false }
    ],
    steps: [
      'Cuire le riz selon les indications.',
      'Saisir les blancs de poulet à la poêle avec un peu d\'huile.',
      'Cuire les brocolis à la vapeur.',
      'Assembler dans une assiette et assaisonner.'
    ]
  },
  {
    id: 'pates_sardines',
    n: 'Pâtes sardines parmesan',
    cat: 'Déj / Dîner',
    tags: ['chaud','prot','rapide'],
    desc: 'Pâtes + sardines + parmesan, simple et protéiné.',
    p: 10,
    c: 15,
    mac: { k: 720, pr: 48, ca: 80, f: 22 },
    custom: false,
    ings: [
      { id: 'pates', q: '120g', k: true },
      { id: 'sardines', q: '1 boîte', k: true },
      { id: 'parmesan', q: '30g', k: false },
      { id: 'ail', q: '1 gousse', k: false }
    ],
    steps: [
      'Cuire les pâtes al dente.',
      'Faire revenir de l\'ail dans un peu d\'huile.',
      'Ajouter les sardines et mélanger aux pâtes.',
      'Ajouter du parmesan et poivre.'
    ]
  },
  {
    id: 'boeuf_pddt',
    n: 'Bœuf légumes pommes de terre',
    cat: 'Déj / Dîner',
    tags: ['chaud','prot','mass'],
    desc: 'Bœuf, pommes de terre et légumes grillés.',
    p: 15,
    c: 25,
    mac: { k: 710, pr: 55, ca: 65, f: 24 },
    custom: false,
    ings: [
      { id: 'bavette', q: '200g', k: true },
      { id: 'pommes_terre', q: '250g', k: true },
      { id: 'carottes', q: '100g', k: true },
      { id: 'huile_olive', q: '1 c.à.s', k: false }
    ],
    steps: [
      'Préchauffer le four à 200°C.',
      'Couper les pommes de terre et les carottes en morceaux.',
      'Assaisonner et rôtir 20 min.',
      'Saisir le bœuf à la poêle et servir ensemble.'
    ]
  },
  {
    id: 'lentilles_oeufs',
    n: 'Lentilles œufs carottes',
    cat: 'Déj / Dîner',
    tags: ['chaud','vege','prot'],
    desc: 'Lentilles aux carottes et œufs durs.',
    p: 10,
    c: 20,
    mac: { k: 620, pr: 42, ca: 60, f: 18 },
    custom: false,
    ings: [
      { id: 'lentilles', q: '150g', k: true },
      { id: 'oeufs', q: '2', k: true },
      { id: 'carottes', q: '100g', k: true },
      { id: 'oignons', q: '1', k: false }
    ],
    steps: [
      'Cuire les lentilles 20 min.',
      'Faire bouillir les œufs 10 min.',
      'Cuire les carottes en dés avec l\'oignon.',
      'Mélanger le tout et assaisonner.'
    ]
  },
  {
    id: 'moules_riz',
    n: 'Moules riz persil',
    cat: 'Déj / Dîner',
    tags: ['chaud','prot'],
    desc: 'Moules crémeuses et riz parfumé.',
    p: 12,
    c: 18,
    mac: { k: 590, pr: 48, ca: 60, f: 17 },
    custom: false,
    ings: [
      { id: 'moules', q: '500g', k: true },
      { id: 'riz', q: '120g', k: true },
      { id: 'ail', q: '1 gousse', k: false },
      { id: 'persil', q: '10g', k: false }
    ],
    steps: [
      'Cuire le riz.',
      'Faire ouvrir les moules avec de l\'ail et un peu d\'eau.',
      'Servir avec du riz et du persil frais.'
    ]
  },
  {
    id: 'poke_poulet',
    n: 'Poké bowl poulet avocat',
    cat: 'Déj / Dîner',
    tags: ['froid','prot','mass'],
    desc: 'Bol frais poulet, avocat et riz.',
    p: 15,
    c: 0,
    mac: { k: 740, pr: 56, ca: 80, f: 24 },
    custom: false,
    ings: [
      { id: 'poulet', q: '200g', k: true },
      { id: 'riz', q: '120g', k: true },
      { id: 'avocats', q: '1/2', k: true },
      { id: 'concombre', q: '80g', k: false },
      { id: 'sauce_soja', q: '1 c.à.s', k: false }
    ],
    steps: [
      'Cuire le riz et laisser refroidir.',
      'Poêler le poulet et couper en morceaux.',
      'Assembler riz, poulet, avocat, concombre.',
      'Ajouter un filet de sauce soja.'
    ]
  },
  {
    id: 'pates_pesto',
    n: 'Pâtes pesto poulet',
    cat: 'Déj / Dîner',
    tags: ['chaud','rapide','prot','mass'],
    desc: 'Pâtes au pesto et poulet grillé.',
    p: 12,
    c: 10,
    mac: { k: 750, pr: 56, ca: 85, f: 22 },
    custom: false,
    ings: [
      { id: 'pates', q: '120g', k: true },
      { id: 'poulet', q: '200g', k: true },
      { id: 'pesto', q: '2 c.à.s', k: false },
      { id: 'parmesan', q: '20g', k: false }
    ],
    steps: [
      'Cuire les pâtes.',
      'Saisir le poulet en cubes.',
      'Mélanger pâtes, pesto et poulet.',
      'Servir avec du parmesan.'
    ]
  },
  {
    id: 'steak_oeuf_riz',
    n: 'Steak haché œuf riz',
    cat: 'Déj / Dîner',
    tags: ['chaud','prot','mass','rapide'],
    desc: 'Steak haché, œuf et riz complet.',
    p: 10,
    c: 12,
    mac: { k: 680, pr: 60, ca: 70, f: 20 },
    custom: false,
    ings: [
      { id: 'sg5', q: '200g', k: true },
      { id: 'oeufs', q: '1', k: true },
      { id: 'riz', q: '110g', k: true },
      { id: 'huile_olive', q: '1 c.à.s', k: false }
    ],
    steps: [
      'Cuire le riz.',
      'Faire cuire le steak haché.',
      'Faire un œuf au plat.',
      'Servir avec du riz.'
    ]
  },
  {
    id: 'pates_boeuf',
    n: 'Pâtes bolognaise maison',
    cat: 'Déj / Dîner',
    tags: ['chaud','prot','mass'],
    desc: 'Pâtes à la sauce bolognaise maison.',
    p: 15,
    c: 25,
    mac: { k: 780, pr: 60, ca: 85, f: 25 },
    custom: false,
    ings: [
      { id: 'pates', q: '130g', k: true },
      { id: 'sg10', q: '200g', k: true },
      { id: 'coulis_tomate', q: '150g', k: true },
      { id: 'oignons', q: '1', k: false }
    ],
    steps: [
      'Cuire les pâtes.',
      'Faire revenir l\'oignon et la viande.',
      'Ajouter le coulis et mijoter 10 min.',
      'Servir sur les pâtes.'
    ]
  },
  {
    id: 'foie_boeuf_riz',
    n: 'Foie de bœuf oignons riz',
    cat: 'Déj / Dîner',
    tags: ['chaud','prot','mass'],
    desc: 'Foie de bœuf poêlé avec riz et oignons.',
    p: 12,
    c: 15,
    mac: { k: 620, pr: 58, ca: 65, f: 18 },
    custom: false,
    ings: [
      { id: 'foie_boeuf', q: '200g', k: true },
      { id: 'riz', q: '120g', k: true },
      { id: 'oignons', q: '1', k: true },
      { id: 'huile_olive', q: '1 c.à.s', k: false }
    ],
    steps: [
      'Cuire le riz.',
      'Faire revenir l\'oignon.',
      'Saisir le foie en tranches.',
      'Servir avec le riz.'
    ]
  },
  {
    id: 'salade_lentilles',
    n: 'Salade lentilles feta',
    cat: 'Déj / Dîner',
    tags: ['froid','vege','bat'],
    desc: 'Salade fraîche lentilles, feta et tomates cerises.',
    p: 12,
    c: 0,
    mac: { k: 580, pr: 28, ca: 55, f: 21 },
    custom: false,
    ings: [
      { id: 'lentilles', q: '150g', k: true },
      { id: 'feta', q: '80g', k: true },
      { id: 'tomates_cerise', q: '100g', k: true },
      { id: 'roquette', q: '50g', k: false }
    ],
    steps: [
      'Cuire les lentilles et laisser refroidir.',
      'Mélanger avec tomates, roquette et feta.',
      'Assaisonner avec huile d\'olive et citron.'
    ]
  },
  {
    id: 'sardines_bowl',
    n: 'Sardines avocat riz brocolis',
    cat: 'Déj / Dîner',
    tags: ['froid','prot','rapide'],
    desc: 'Bol express aux sardines, avocat et riz.',
    p: 10,
    c: 0,
    mac: { k: 640, pr: 44, ca: 70, f: 22 },
    custom: false,
    ings: [
      { id: 'sardines', q: '1 boîte', k: true },
      { id: 'avocats', q: '1/2', k: true },
      { id: 'riz', q: '120g', k: true },
      { id: 'brocolis', q: '100g', k: false }
    ],
    steps: [
      'Cuire le riz.',
      'Réchauffer légèrement les sardines.',
      'Assembler riz, brocolis, avocat et sardines.',
      'Assaisonner avec citron.'
    ]
  },
  {
    id: 'chili_sin',
    n: 'Chili sin carne',
    cat: 'Déj / Dîner',
    tags: ['chaud','vege','mass','bat'],
    desc: 'Chili végétarien riche en protéines.',
    p: 15,
    c: 30,
    mac: { k: 620, pr: 30, ca: 80, f: 18 },
    custom: false,
    ings: [
      { id: 'haricots_rouges', q: '1 boîte', k: true },
      { id: 'pois_chiches', q: '1 boîte', k: true },
      { id: 'coulis_tomate', q: '200g', k: true },
      { id: 'oignons', q: '1', k: false },
      { id: 'paprika', q: '1 c.à.c', k: false }
    ],
    steps: [
      'Faire revenir l\'oignon.',
      'Ajouter les épices et la tomate.',
      'Ajouter les légumineuses et mijoter 20 min.',
      'Servir avec du riz ou du pain.'
    ]
  },
  {
    id: 'omelette_musc',
    n: 'Omelette musculation',
    cat: 'Déj / Dîner',
    tags: ['chaud','prot','rapide'],
    desc: 'Omelette riche en protéines avec pommes de terre.',
    p: 10,
    c: 10,
    mac: { k: 700, pr: 35, ca: 55, f: 35 },
    custom: false,
    ings: [
      { id: 'oeufs', q: '4', k: true },
      { id: 'pommes_terre', q: '150g', k: true },
      { id: 'fromage_rape', q: '30g', k: false }
    ],
    steps: [
      'Cuire les pommes de terre en cubes.',
      'Battre les œufs et ajouter le fromage.',
      'Cuire l\'omelette avec les pommes de terre.',
      'Plier et servir chaud.'
    ]
  },
  {
    id: 'riz_lentilles_oeufs',
    n: 'Riz lentilles œufs',
    cat: 'Déj / Dîner',
    tags: ['chaud','vege','prot','mass'],
    desc: 'Bowl riz, lentilles et œufs pour la masse.',
    p: 15,
    c: 20,
    mac: { k: 700, pr: 32, ca: 90, f: 18 },
    custom: false,
    ings: [
      { id: 'riz', q: '120g', k: true },
      { id: 'lentilles', q: '100g', k: true },
      { id: 'oeufs', q: '2', k: true },
      { id: 'carottes', q: '80g', k: false }
    ],
    steps: [
      'Cuire riz et lentilles.',
      'Cuire les œufs durs.',
      'Assembler et ajouter des légumes.'
    ]
  },
  {
    id: 'wrap_poulet',
    n: 'Wrap poulet musculation',
    cat: 'Déj / Dîner',
    tags: ['chaud','prot','mass','rapide'],
    desc: 'Wraps riches en protéines et gras sains.',
    p: 12,
    c: 0,
    mac: { k: 750, pr: 40, ca: 65, f: 30 },
    custom: false,
    ings: [
      { id: 'tortillas', q: '2', k: true },
      { id: 'poulet', q: '150g', k: true },
      { id: 'avocats', q: '1/2', k: true },
      { id: 'fromage_rape', q: '30g', k: false }
    ],
    steps: [
      'Chauffer les tortillas.',
      'Saisir le poulet et couper en lanières.',
      'Garnir les tortillas avec poulet, avocat et fromage.',
      'Rouler et déguster.'
    ]
  },
  {
    id: 'chili_viande',
    n: 'Chili prise de masse',
    cat: 'Déj / Dîner',
    tags: ['chaud','prot','mass'],
    desc: 'Chili avec viande, haricots et riz.',
    p: 15,
    c: 30,
    mac: { k: 800, pr: 45, ca: 90, f: 24 },
    custom: false,
    ings: [
      { id: 'sg10', q: '250g', k: true },
      { id: 'haricots_rouges', q: '1 boîte', k: true },
      { id: 'riz', q: '120g', k: true },
      { id: 'coulis_tomate', q: '150g', k: false },
      { id: 'paprika', q: '1 c.à.c', k: false }
    ],
    steps: [
      'Cuire le riz.',
      'Faire revenir la viande.',
      'Ajouter les haricots et la tomate.',
      'Laisser mijoter 15 min.'
    ]
  },
  {
    id: 'pates_oeufs_fromage',
    n: 'Pâtes œufs parmesan',
    cat: 'Déj / Dîner',
    tags: ['chaud','rapide','prot'],
    desc: 'Version simple de carbonara saine.',
    p: 10,
    c: 10,
    mac: { k: 700, pr: 35, ca: 85, f: 20 },
    custom: false,
    ings: [
      { id: 'pates', q: '130g', k: true },
      { id: 'oeufs', q: '2', k: true },
      { id: 'parmesan', q: '30g', k: true },
      { id: 'lardons', q: '80g', k: false }
    ],
    steps: [
      'Cuire les pâtes.',
      'Battre les œufs avec le parmesan.',
      'Mélanger aux pâtes chaudes hors du feu.',
      'Ajouter les lardons cuits.'
    ]
  },
  {
    id: 'burger_maison',
    n: 'Burger maison musculation',
    cat: 'Déj / Dîner',
    tags: ['chaud','prot','mass'],
    desc: 'Burger riche en protéines, maison.',
    p: 15,
    c: 20,
    mac: { k: 870, pr: 55, ca: 70, f: 45 },
    custom: false,
    ings: [
      { id: 'pain_burger', q: '2', k: true },
      { id: 'sg10', q: '2 steaks', k: true },
      { id: 'cheddar', q: '40g', k: true },
      { id: 'pates', q: '50g', k: false }
    ],
    steps: [
      'Cuire les steaks.',
      'Assembler les burgers avec pain, fromage et steak.',
      'Ajouter salade ou tomates si disponible.'
    ]
  },
  {
    id: 'carbonara',
    n: 'Pâtes carbonara sportif',
    cat: 'Déj / Dîner',
    tags: ['chaud','prot','mass'],
    desc: 'Version rapide de carbonara riche en protéines.',
    p: 12,
    c: 12,
    mac: { k: 800, pr: 42, ca: 90, f: 28 },
    custom: false,
    ings: [
      { id: 'pates', q: '130g', k: true },
      { id: 'oeufs', q: '2', k: true },
      { id: 'lardons', q: '100g', k: true },
      { id: 'parmesan', q: '40g', k: false }
    ],
    steps: [
      'Cuire les pâtes.',
      'Faire revenir les lardons.',
      'Mélanger œufs et parmesan.',
      'Ajouter aux pâtes hors du feu.'
    ]
  },
  {
    id: 'croque_sportif',
    n: 'Croque-monsieur sportif',
    cat: 'Déj / Dîner',
    tags: ['chaud','prot','mass','rapide'],
    desc: 'Croque complet riche en protéines.',
    p: 10,
    c: 10,
    mac: { k: 700, pr: 38, ca: 45, f: 35 },
    custom: false,
    ings: [
      { id: 'pain_complet', q: '2 tranches', k: true },
      { id: 'jambon', q: '2 tranches', k: true },
      { id: 'cheddar', q: '30g', k: true },
      { id: 'oeufs', q: '1', k: false }
    ],
    steps: [
      'Monter le croque avec pain, jambon et fromage.',
      'Griller au four ou à la poêle.',
      'Ajouter un œuf au plat sur le dessus.'
    ]
  },
  {
    id: 'riz_coco_poulet',
    n: 'Riz coco poulet curry',
    cat: 'Déj / Dîner',
    tags: ['chaud','prot','mass'],
    desc: 'Riz coco avec poulet au curry doux.',
    p: 15,
    c: 20,
    mac: { k: 800, pr: 50, ca: 90, f: 28 },
    custom: false,
    ings: [
      { id: 'riz', q: '120g', k: true },
      { id: 'poulet', q: '200g', k: true },
      { id: 'lait_coco', q: '150ml', k: true },
      { id: 'curry', q: '1 c.à.c', k: false }
    ],
    steps: [
      'Cuire le riz.',
      'Faire cuire le poulet avec le curry.',
      'Ajouter le lait de coco et mijoter.',
      'Servir sur le riz.'
    ]
  },
  {
    id: 'moules_creme',
    n: 'Moules marinières crème',
    cat: 'Déj / Dîner',
    tags: ['chaud','prot'],
    desc: 'Moules crémeuses à l\'ail.',
    p: 12,
    c: 15,
    mac: { k: 640, pr: 46, ca: 45, f: 24 },
    custom: false,
    ings: [
      { id: 'moules', q: '500g', k: true },
      { id: 'ail', q: '2 gousses', k: true },
      { id: 'lait_coco', q: '80ml', k: false },
      { id: 'persil', q: '10g', k: false }
    ],
    steps: [
      'Faire revenir l\'ail.',
      'Ajouter les moules et couvrir.',
      'Ajouter la crème ou le lait de coco.',
      'Servir avec du pain ou du riz.'
    ]
  },
  {
    id: 'moules_curry_coco',
    n: 'Moules curry lait de coco',
    cat: 'Déj / Dîner',
    tags: ['chaud','prot','mass'],
    desc: 'Moules épicées au lait de coco.',
    p: 12,
    c: 15,
    mac: { k: 690, pr: 48, ca: 50, f: 28 },
    custom: false,
    ings: [
      { id: 'moules', q: '500g', k: true },
      { id: 'lait_coco', q: '150ml', k: true },
      { id: 'curry', q: '1 c.à.s', k: true },
      { id: 'ail', q: '1 gousse', k: false }
    ],
    steps: [
      'Faire revenir l\'ail et le curry.',
      'Ajouter les moules puis le lait de coco.',
      'Couvrir et cuire 10 min.',
      'Servir avec du riz.'
    ]
  },
  {
    id: 'poke_saumon',
    n: 'Poké bowl saumon avocat',
    cat: 'Déj / Dîner',
    tags: ['froid','prot','mass'],
    desc: 'Skillet saumon et avocat sur lit de riz.',
    p: 15,
    c: 0,
    mac: { k: 720, pr: 46, ca: 80, f: 30 },
    custom: false,
    ings: [
      { id: 'saumon', q: '150g', k: true },
      { id: 'riz', q: '120g', k: true },
      { id: 'avocats', q: '1/2', k: true },
      { id: 'concombre', q: '80g', k: false }
    ],
    steps: [
      'Cuire le riz.',
      'Poêler le saumon.',
      'Assembler avec avocat et concombre.',
      'Ajouter un filet de soja.'
    ]
  },
  {
    id: 'poke_crevettes',
    n: 'Poké bowl crevettes mangue',
    cat: 'Déj / Dîner',
    tags: ['froid','prot'],
    desc: 'Poké frais crevettes et mangue.',
    p: 12,
    c: 0,
    mac: { k: 680, pr: 42, ca: 70, f: 22 },
    custom: false,
    ings: [
      { id: 'crevettes', q: '150g', k: true },
      { id: 'riz', q: '120g', k: true },
      { id: 'mangue', q: '1/2', k: true },
      { id: 'avocats', q: '1/2', k: false }
    ],
    steps: [
      'Cuire le riz.',
      'Décortiquer les crevettes.',
      'Assembler riz, mangue, avocat et crevettes.',
      'Ajouter un filet de citron.'
    ]
  },
  {
    id: 'poke_edamame',
    n: 'Poké bowl édamame feta',
    cat: 'Déj / Dîner',
    tags: ['froid','vege','prot'],
    desc: 'Bol végétarien avec édamame, feta et riz.',
    p: 10,
    c: 0,
    mac: { k: 660, pr: 30, ca: 70, f: 28 },
    custom: false,
    ings: [
      { id: 'edamame', q: '120g', k: true },
      { id: 'riz', q: '120g', k: true },
      { id: 'feta', q: '80g', k: true },
      { id: 'tomates_cerise', q: '80g', k: false }
    ],
    steps: [
      'Cuire le riz.',
      'Cuire l\'édamame.',
      'Assembler avec feta et tomates cerises.',
      'Ajouter un filet d\'huile d\'olive.'
    ]
  },
  {
    id: 'riz_poulet_cerise',
    n: 'Riz poulet tomate cerise',
    cat: 'Déj / Dîner',
    tags: ['froid','prot','insta'],
    desc: 'Bowl coloré poulet, tomates cerises et roquette.',
    p: 15,
    c: 0,
    mac: { k: 680, pr: 50, ca: 70, f: 22 },
    custom: false,
    ings: [
      { id: 'poulet', q: '200g', k: true },
      { id: 'riz', q: '120g', k: true },
      { id: 'tomates_cerise', q: '100g', k: true },
      { id: 'roquette', q: '50g', k: false }
    ],
    steps: [
      'Cuire le riz.',
      'Saisir le poulet.',
      'Assembler et ajouter la roquette.',
      'Assaisonner à l\'huile d\'olive.'
    ]
  },
  {
    id: 'riz_boeuf_cheddar',
    n: 'Riz bœuf cheddar maïs',
    cat: 'Déj / Dîner',
    tags: ['chaud','prot','mass','insta'],
    desc: 'Bowl complet bœuf, cheddar et maïs.',
    p: 15,
    c: 20,
    mac: { k: 780, pr: 50, ca: 80, f: 30 },
    custom: false,
    ings: [
      { id: 'bavette', q: '200g', k: true },
      { id: 'riz', q: '120g', k: true },
      { id: 'maïs', q: '1 boîte', k: true },
      { id: 'cheddar', q: '40g', k: false },
      { id: 'courgettes', q: '80g', k: false }
    ],
    steps: [
      'Cuire le riz.',
      'Saisir le bœuf.',
      'Ajouter le maïs et la courgette.',
      'Servir avec cheddar fondu.'
    ]
  },
  {
    id: 'riz_sardine_pomme',
    n: 'Riz sardine haricots pomme',
    cat: 'Déj / Dîner',
    tags: ['froid','prot','insta','rapide'],
    desc: 'Bol frais sardine, pommes et haricots verts.',
    p: 10,
    c: 0,
    mac: { k: 620, pr: 40, ca: 70, f: 20 },
    custom: false,
    ings: [
      { id: 'sardines', q: '1 boîte', k: true },
      { id: 'riz', q: '120g', k: true },
      { id: 'pommes', q: '1', k: true },
      { id: 'haricots_verts', q: '100g', k: false }
    ],
    steps: [
      'Cuire le riz.',
      'Couper la pomme en dés.',
      'Assembler riz, sardines, haricots et pomme.',
      'Ajouter un filet de citron.'
    ]
  },
  {
    id: 'pates_crevettes_moules',
    n: 'Pâtes crevettes moules feta',
    cat: 'Déj / Dîner',
    tags: ['chaud','prot','insta'],
    desc: 'Pâtes saveur mer avec crevettes et moules.',
    p: 15,
    c: 15,
    mac: { k: 720, pr: 52, ca: 80, f: 24 },
    custom: false,
    ings: [
      { id: 'pates', q: '120g', k: true },
      { id: 'crevettes', q: '150g', k: true },
      { id: 'moules', q: '200g', k: true },
      { id: 'feta', q: '30g', k: false },
      { id: 'tomates_cerise', q: '60g', k: false }
    ],
    steps: [
      'Cuire les pâtes.',
      'Cuire les crevettes et moules rapidement.',
      'Mélanger avec les pâtes et ajouter la feta.',
      'Servir chaud.'
    ]
  }
];
