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
    const commonRecipes = jsonData.Categories.flatMap(category => category.Common);

    const duplicateIDs = new Set();
    const uniqueIDs = new Set();

    function checkrecipeId(recipe) {
        if (uniqueIDs.has(recipe.id)) { duplicateIDs.add({ id: recipe.id, recipe: recipe.recipe }); }
        else { uniqueIDs.add(recipe.id); }
    }

    skillRecipes.forEach(recipe => { checkrecipeId(recipe) });
    commonRecipes.forEach(recipe => { checkrecipeId(recipe) });

    if (duplicateIDs.size > 0) { console.warn('Duplicate recipe IDs:', duplicateIDs); }
    return duplicateIDs.size === 0;
}

// Chccks if the provided JSON data spell skill id definitions actualy exist in the vaardigheden
function hasExistingSkillIDs(jsonData) {
    const recipeSkillIds = new Set(jsonData.Categories.flatMap(category => category.Skills.flatMap(skill => skill.id)));
    const faultyIDs = new Set();
    recipeSkillIds.forEach(id => {
        const skill = getSkillById(id)
        if (!skill || skill === null) { faultyIDs.add(id); }
    });

    if (faultyIDs.size > 0) { console.warn('faulty recipe SkillIDs:', faultyIDs); }
    return faultyIDs.size === 0;
}

test('Recepten JSON should have unique IDs per recipe', () => {
    expect(hasUniqueIDs(sourceRecepten)).toBe(true);
});

test('Spreuken JSON should have skill IDs per recipe that exist', () => {
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
