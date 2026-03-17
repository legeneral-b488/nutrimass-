const fs = require('fs');
const path = require('path');

// Générateur basique de data.js (ingrédients + recettes + collations)
// Utilise des objets compacts pour ne pas avoir à retaper toute la structure.

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

const INGREDIENTS_RAW = [
  // [id, nom, cat, qty, prix, rappel_jours, label]
  ['poulet', 'Blancs de poulet', 'Protéines animales', '200-250g', 2.20, null, null],
  ['sg5', 'Steak haché 5%', 'Protéines animales', '200g', 2.50, null, null],
  ['sg10', 'Steak haché 10%', 'Protéines animales', '200g', 2.20, null, null],
  ['bavette', 'Bœuf bavette', 'Protéines animales', '200g', 3.50, null, null],
  ['foie_boeuf', 'Foie de bœuf', 'Protéines animales', '200g', 2.50, 14, 'Foie'],
  ['sardines', 'Sardines à l\'huile', 'Protéines animales', '1 boîte', 1.50, 7, 'Sardines'],
  ['saumon', 'Saumon (pavé)', 'Protéines animales', '200g', 5.00, null, null],
  ['crevettes', 'Crevettes décortiquées', 'Protéines animales', '200g', 6.00, null, null],
  ['moules', 'Moules', 'Protéines animales', '500g', 3.00, 21, 'Moules'],
  ['oeufs', 'Œufs', 'Protéines animales', '12 œufs', 2.50, 3, 'Œufs'],
  ['jambon', 'Jambon blanc', 'Protéines animales', '4 tranches', 2.50, null, null],
  ['lardons', 'Lardons', 'Protéines animales', '200g', 2.00, null, null],
  ['skyr', 'Skyr', 'Protéines animales', '2×500g', 3.50, null, null],
  ['whey', 'Whey protéine', 'Protéines animales', '1 kg', 0.80, null, null],
  
  ['lentilles', 'Lentilles', 'Protéines végétales', '500g', 1.50, 3, 'Lentilles'],
  ['pois_chiches', 'Pois chiches', 'Protéines végétales', '2 boîtes', 2.00, 3, 'Pois chiches'],
  ['haricots_rouges', 'Haricots rouges', 'Protéines végétales', '2 boîtes', 1.80, null, null],
  ['edamame', 'Edamame surgelé', 'Protéines végétales', '400g', 3.50, null, null],
  ['tofu', 'Tofu ferme', 'Protéines végétales', '400g', 2.50, null, null],
  
  ['riz', 'Riz', 'Féculents', '1 kg', 2.00, null, null],
  ['pates', 'Pâtes', 'Féculents', '500g', 1.50, null, null],
  ['avoine', 'Flocons d\'avoine', 'Féculents', '1 kg', 2.00, null, null],
  ['pommes_terre', 'Pommes de terre', 'Féculents', '1 kg', 2.00, null, null],
  ['patate_douce', 'Patates douces', 'Féculents', '1 kg', 2.50, null, null],
  ['semoule', 'Semoule', 'Féculents', '500g', 1.50, null, null],
  ['pain_complet', 'Pain complet', 'Féculents', '1 tranche épaisse', 3.00, null, null],
  ['pain_burger', 'Pains burger', 'Féculents', '4 pains', 2.50, null, null],
  ['tortillas', 'Tortillas (wraps)', 'Féculents', '8 tortillas', 2.50, null, null],
  
  ['brocolis', 'Brocolis', 'Légumes', '500g', 2.00, null, null],
  ['chou_fleur', 'Chou-fleur', 'Légumes', '1 pièce', 2.00, null, null],
  ['haricots_verts', 'Haricots verts', 'Légumes', '400g', 2.00, null, null],
  ['carottes', 'Carottes', 'Légumes', '1 kg', 1.50, null, null],
  ['oignons', 'Oignons', 'Légumes', '1 filet', 1.50, null, null],
  ['ail', 'Ail', 'Légumes', '1 tête', 0.80, null, null],
  ['concombre', 'Concombre', 'Légumes', '2 pièces', 1.80, null, null],
  ['tomates', 'Tomates', 'Légumes', '500g', 2.50, null, null],
  ['tomates_cerise', 'Tomates cerises', 'Légumes', '250g', 2.50, null, null],
  ['avocats', 'Avocats', 'Légumes', '3-4 pièces', 3.00, null, null],
  ['mais', 'Maïs (boîte)', 'Légumes', '1 boîte 400g', 1.20, null, null],
  ['chou_rouge', 'Chou rouge', 'Légumes', '1/2 chou', 1.50, null, null],
  ['courgettes', 'Courgettes', 'Légumes', '2 pièces', 2.00, null, null],
  ['roquette', 'Roquette', 'Légumes', '1 sachet 100g', 2.00, null, null],
  ['salade', 'Salade verte', 'Légumes', '1 sachet', 1.50, null, null],
  
  ['bananes', 'Bananes', 'Fruits', '1 régime', 2.00, null, null],
  ['fruits_rouges', 'Fruits rouges surgelés', 'Fruits', '1 kg', 3.50, null, null],
  ['citrons', 'Citrons', 'Fruits', '4-6 pièces', 1.50, null, null],
  ['pommes', 'Pommes', 'Fruits', '6 pièces', 2.50, null, null],
  ['poire', 'Poires', 'Fruits', '4 pièces', 2.50, null, null],
  ['mangue', 'Mangue', 'Fruits', '1-2 pièces', 2.50, null, null],
  
  ['huile_olive', 'Huile d\'olive', 'Graisses', '1 bouteille', 5.00, null, null],
  ['beurre_cac', 'Beurre de cacahuète', 'Graisses', '1 pot 500g', 4.00, null, null],
  ['noix', 'Noix', 'Graisses', '200g', 3.50, 5, 'Noix'],
  ['amandes', 'Amandes', 'Graisses', '200g', 3.50, 5, 'Amandes'],
  ['pistaches', 'Pistaches', 'Graisses', '150g', 4.00, 5, 'Pistaches'],
  ['graines_courge', 'Graines de courge', 'Graisses', '150g', 2.50, 5, 'Graines de courge'],
  ['graines_chia', 'Graines de chia', 'Graisses', '150g', 3.00, null, null],
  ['feta', 'Feta', 'Graisses', '200g', 2.50, null, null],
  ['fromage_rape', 'Fromage râpé', 'Graisses', '200g', 2.50, null, null],
  ['cheddar', 'Cheddar', 'Graisses', '150g', 3.00, null, null],
  
  ['pesto', 'Pesto', 'Sauces', '1 pot', 3.00, null, null],
  ['sauce_soja', 'Sauce soja', 'Sauces', '1 bouteille', 2.50, null, null],
  ['parmesan', 'Parmesan', 'Sauces', '100g', 2.50, null, null],
  ['coulis_tomate', 'Coulis de tomate', 'Sauces', '1 bocal', 2.00, null, null],
  ['lait_coco', 'Lait de coco', 'Sauces', '1 boîte', 2.00, null, null],
  ['paprika', 'Paprika', 'Sauces', '1 pot', 1.50, 5, 'Paprika'],
  ['curry', 'Curry', 'Sauces', '1 pot', 1.50, 5, 'Curry'],
  ['curcuma', 'Curcuma', 'Sauces', '1 pot', 1.50, null, null],
  ['miel', 'Miel', 'Sauces', '1 pot', 3.00, null, null],
  ['herbes_prov', 'Herbes de Provence', 'Sauces', '1 pot', 1.50, null, null],
  ['sel', 'Sel', 'Sauces', '1 pot', 1.00, null, null],
  
  ['dattes', 'Dattes', 'Encas', '200g', 3.00, null, null],
  ['choco_noir', 'Chocolat noir 85%', 'Encas', '100g', 2.50, 4, 'Choco noir'],
  ['melange_noix', 'Mélange de noix', 'Encas', '200g', 4.00, 5, 'Mélange'],
  ['raisins_secs', 'Raisins secs', 'Encas', '200g', 2.00, null, null]
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
  // Les recettes sont générées automatiquement par compileData();
];

function compileData() {
  const toIng = (arr) => ({
    id: arr[0],
    n: arr[1],
    cat: arr[2],
    s: 'dispo',
    qty: arr[3],
    p: arr[4],
    r: arr[5] ? { d: arr[5], l: arr[6] || arr[1] } : null
  });

  const ingredients = INGREDIENTS_RAW.map(toIng);

  // Exemple de génération de recettes (simplifiée, à étendre selon besoin)
  const recipes = [
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
    }
  ];

  return { TARGETS, VEG_IDS, INGREDIENTS: ingredients, RECIPES: recipes, COLLATIONS, SNACKS };
}

function build() {
  const data = compileData();
  const output = `/* AUTOGENERATED - exécuter node generate-data.js */\n\n` +
    `const TARGETS = ${JSON.stringify(data.TARGETS, null, 2)};\n\n` +
    `const VEG_IDS = ${JSON.stringify(data.VEG_IDS, null, 2)};\n\n` +
    `const INGREDIENTS = ${JSON.stringify(data.INGREDIENTS, null, 2)};\n\n` +
    `const COLLATIONS = ${JSON.stringify(data.COLLATIONS, null, 2)};\n\n` +
    `const SNACKS = ${JSON.stringify(data.SNACKS, null, 2)};\n\n` +
    `const RECIPES = ${JSON.stringify(data.RECIPES, null, 2)};\n`;
  fs.writeFileSync(path.join(__dirname, 'data.js'), output, 'utf-8');
  console.log('data.js généré avec', data.INGREDIENTS.length, 'ingrédients et', data.RECIPES.length, 'recettes');
}

if (require.main === module) {
  build();
}
