import { getCurrentLanguage } from './i18n.js';

// jsons
//import vaardigheden_nl from './json/nl/vaardigheden.json';
//import vaardigheden_en from './json/en/vaardigheden.json';
//import spreuken_nl from './json/nl/spreuken.json';
//import spreuken_en from './json/en/spreuken.json';
//import recepten_nl from './json/nl/recepten.json';
//import recepten_en from './json/en/recepten.json';
//import presets_nl from './json/nl/presets.json';
//import presets_en from './json/en/presets.json';
//import releasenotes_nl from './json/nl/releasenotes.json';
//import releasenotes_en from './json/en/releasenotes.json';
//import faq_nl from './json/nl/faq.json';
//import faq_en from './json/en/faq.json';

import loadAllJsons from './json/jsonLoader.js';
const jsonData = await loadAllJsons();


function useSourceByLanguage(optionNL, optionEN) {
    const lang = getCurrentLanguage() || "nl";
    switch (lang) {
        case "nl": return optionNL;
        case "en": return optionEN;
        default: return optionNL;
    }
}

// Presets
export function getPresets() { return useSourceByLanguage(jsonData.presets_nl, jsonData.presets_en); }

// Release Notes
export function getSourceReleaseNotes() { return useSourceByLanguage(jsonData.releasenotes_nl, jsonData.releasenotes_en); }

// FAQ

export function getSourceFAQ() { return useSourceByLanguage(jsonData.faq_nl, jsonData.faq_en); }


// SELECT

// Ophalen van de skills uit vaardigheden/spreuken/recepten
export function generateOptions(source) {
    return source.map((record) => ({
        id: record.id,
        value: record.skill,
        label: `${record.skill} (${record.xp} xp)`
    }));
}

// Ophalen van de skills uit vaardigheden/spreuken/recepten, minus geselecteerde skills
export function regenerateOptions(source, tableData) {
    return source.map((record) => ({
        id: record.id,
        value: record.skill,
        label: `${record.skill} (${record.xp} xp)`
    })).filter((currentSkill) => !tableData?.some((record) => record.id === currentSkill.id));
}

/// --- SKILLS & SELECT PROPERTIES --- ///

// total XP
export let totalXP = 0;
export function setTotalXP(value) { totalXP = value; }
export function resetTotalXP(tableData) { totalXP = tableData.length > 0 ? tableData.reduce((accumulator, skill) => accumulator + skill.xp, 0) : 0 }

// vaardigheden
export function getSourceVaardigheden() { return useSourceByLanguage(jsonData.vaardigheden_nl, jsonData.vaardigheden_en); }
export let sourceBasisVaardigheden = getSourceVaardigheden().BasisVaardigheden;
export let sourceExtraVaardigheden = getSourceVaardigheden().ExtraVaardigheden;
export let optionsBasisVaardigheden = generateOptions(sourceBasisVaardigheden);
export let optionsExtraVaardigheden = generateOptions(sourceExtraVaardigheden);

// spreuken
export function getSpreuken() { return useSourceByLanguage(jsonData.spreuken_nl, jsonData.spreuken_en); }
export let sourceSpreuken = [].concat(...getSpreuken().Categories.map(category => category.Skills));

// recepten
export function getRecepten() { return useSourceByLanguage(jsonData.recepten_nl, jsonData.recepten_en); }
export let sourceSkillRecepten = [].concat(...getRecepten().Categories.map(category => category.Skills));
export let sourceCommonRecepten = [].concat(...getRecepten().Categories.map(category => category.Common).filter(Boolean));

// regeneration
export function regenerateVaardigheden(tableData) {
    sourceBasisVaardigheden = getSourceVaardigheden().BasisVaardigheden;
    sourceExtraVaardigheden = getSourceVaardigheden().ExtraVaardigheden;
    optionsBasisVaardigheden = regenerateOptions(sourceBasisVaardigheden, tableData);
    optionsExtraVaardigheden = regenerateOptions(sourceExtraVaardigheden, tableData);
}

export function regenerateSpreukenAndRecepten() {
    sourceSpreuken = [].concat(...getSpreuken().Categories.map(category => category.Skills));
    sourceSkillRecepten = [].concat(...getRecepten().Categories.map(category => category.Skills));
    sourceCommonRecepten = [].concat(...getRecepten().Categories.map(category => category.Common).filter(Boolean));
}

/// --- TABLE PROPERTIES --- ///
// text wordt opgehaald uit de i18n vertalingen

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