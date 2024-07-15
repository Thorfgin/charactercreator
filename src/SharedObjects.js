// jsons
import vaardigheden from './json/vaardigheden.json';
import spreuken from './json/spreuken.json';
import recepten from './json/recepten.json';
import presets from './json/presets.json';
import releasenotes from './json/releasenotes.json';
import faq from './json/faq.json';

// functions
import {
    generateOptions,
    regenerateOptions
} from './SharedActions.js';

// --- PRESETS --- ///
export const getPresets = () => { return presets; }

// releasenotes
export const getSourceReleaseNotes = () => { return releasenotes; }

// FAQ
export const getSourceFAQ = () => { return faq; }


/// --- SKILLS & SELECT PROPERTIES --- ///

// total XP
export let totalXP = 0;
export function setTotalXP(value) { totalXP = value; }
export function resetTotalXP(tableData) { totalXP = tableData.length > 0 ? tableData.reduce((accumulator, skill) => accumulator + skill.xp, 0) : 0 }

// vaardigheden
export const getSourceVaardigheden = () => { return vaardigheden; }
export const sourceBasisVaardigheden = vaardigheden.BasisVaardigheden;
export let optionsBasisVaardigheden = generateOptions(sourceBasisVaardigheden);
export function regeneratedBasisVaardigheden(tableData) { optionsBasisVaardigheden = regenerateOptions(sourceBasisVaardigheden, tableData); }

export const sourceExtraVaardigheden = vaardigheden.ExtraVaardigheden;
export let optionsExtraVaardigheden = generateOptions(sourceExtraVaardigheden);
export function regeneratedExtraVaardigheden(tableData) { optionsExtraVaardigheden = regenerateOptions(sourceExtraVaardigheden, tableData); }

// spreuken
export const getSpreuken = () => { return spreuken; }
export const sourceSpreuken = [].concat(...spreuken.Categories.map(category => category.Skills));

// recepten
export const getRecepten = () => { return recepten; }
export const sourceSkillRecepten = [].concat(...recepten.Categories.map(category => category.Skills));
export const sourceCommonRecepten = [].concat(...recepten.Categories.map(category => category.Common).filter(Boolean));


/// --- TABLE PROPERTIES --- ///
export const defaultProperties = [
    { id: 1, name: "hitpoints", image: "./images/image_hp.png", text: 'shared_objects.hitpoints', value: 1 },
    { id: 2, name: "armourpoints", image: "./images/image_ap.png", text: 'shared_objects.armourpoints', value: 0 },
    { id: 3, name: "elemental_mana", image: "./images/image_em.png", text: 'shared_objects.elemental_mana', value: 0 },
    { id: 4, name: "elemental_ritual_mana", image: "./images/image_erm.png", text: 'shared_objects.elemental_ritual_mana', value: 0 },
    { id: 5, name: "spiritual_mana", image: "./images/image_sm.png", text: 'shared_objects.spiritual_mana', value: 0 },
    { id: 6, name: "spiritual_ritual_mana", image: "./images/image_srm.png", text: 'shared_objects.spiritual_ritual_mana', value: 0 },
    { id: 7, name: "inspiration", image: "./images/image_ins.png", text: 'shared_objects.inspiration', value: 0 },
    { id: 8, name: "willpower", image: "./images/image_wil.png", text: 'shared_objects.willpower', value: 0 },
    { id: 9, name: "glyph_craft_cap", image: "./images/image_glp_cra.png", text: 'shared_objects.glyph_craft_cap', value: 0 },
    { id: 10, name: "glyph_imbue_cap", image: "./images/image_glp_imb.png", text: 'shared_objects.glyph_imbue_cap', value: 0 },
    { id: 11, name: "rune_craft_cap", image: "./images/image_run_cra.png", text: 'shared_objects.rune_craft_cap', value: 0 },
    { id: 12, name: "rune_imbue_cap", image: "./images/image_run_imb.png", text: 'shared_objects.rune_imbue_cap', value: 0 }
];