import Ajv from 'ajv';
import ajvKeywords from 'ajv-keywords';
import ajvErrors from 'ajv-errors';

import {
    test,
    expect
} from '@jest/globals';

// shared
import { getRecepten } from '../src/SharedObjects.js';
import { getSkillById } from '../src/SharedActions.js';

// json
import recepten_schema from './schemas/recepten-schema.json';

// globals
const sourceRecepten = getRecepten();

/// --- UNIQUE SPELL ID'S --- ///
function hasUniqueIDs(jsonData) {
    const skillRecipes = new Set(jsonData.Categories.flatMap(category =>
        category.Skills.flatMap(skill => skill.Recipes)
    ));
    const commonRecipies = jsonData.Categories.flatMap(category => category.Common);

    const duplicateIDs = new Set();
    const uniqueIDs = new Set();

    function checkRecipyId(recipy) {
        if (uniqueIDs.has(recipy.id)) { duplicateIDs.add({ id: recipy.id, recipy: recipy.recipy }); }
        else { uniqueIDs.add(recipy.id); }
    }

    skillRecipes.forEach(recipy => { checkRecipyId(recipy) });
    commonRecipies.forEach(recipy => { checkRecipyId(recipy) });

    if (duplicateIDs.size > 0) { console.warn('Duplicate Recipy IDs:', duplicateIDs); }
    return duplicateIDs.size === 0;
}

// Chccks if the provided JSON data spell skill id definitions actualy exist in the vaardigheden
function hasExistingSkillIDs(jsonData) {
    const recipySkillIds = new Set(jsonData.Categories.flatMap(category => category.Skills.flatMap(skill => skill.id)));
    const faultyIDs = new Set();
    recipySkillIds.forEach(id => {
        const skill = getSkillById(id)
        if (!skill || skill === null) { faultyIDs.add(id); }
    });

    if (faultyIDs.size > 0) { console.warn('faulty Recipy SkillIDs:', faultyIDs); }
    return faultyIDs.size === 0;
}

test('Recepten JSON should have unique IDs per Recipy', () => {
    expect(hasUniqueIDs(sourceRecepten)).toBe(true);
});

test('Spreuken JSON should have skill IDs per Recipy that exist', () => {
    expect(hasExistingSkillIDs(sourceRecepten)).toBe(true);
});

/// --- FORMATTING --- ///
function hasCorrectFormat(jsonData, schema) {
    const ajv = new Ajv({ allErrors: true });
    ajvKeywords(ajv);
    ajvErrors(ajv);
    const validate = ajv.compile(schema);
    const result = validate(jsonData)

    if (result === true) { return true; }
    else
    {
        console.warn("Recepten JSON is not valid:", validate.errors);
        return false;
    }
}

test('Skills in Recepten JSON should have the correct format', () => {
    expect(hasCorrectFormat(sourceRecepten, recepten_schema)).toBe(true);
});
