import PropTypes from 'prop-types';
import { T } from './i18n.js';

// Shared
import {
    defaultProperties,
    sourceSpreuken,
    sourceSkillRecepten,
    sourceCommonRecepten,
    sourceBasisVaardigheden,
    sourceExtraVaardigheden,
} from './SharedObjects.js';

import {
    teacherSkill_Id,
    ritualismSkills_Ids
} from './SharedConstants.js';

/// --- SKILLS --- ///

getSkillById.propTypes = { id: PropTypes.number.isRequired };

// Ophalen van een vaardigheid op id
export function getSkillById(id) {
    let sourceSkill = null;
    sourceSkill = sourceBasisVaardigheden.find((record) => record.id === id);
    if (!sourceSkill) { sourceSkill = sourceExtraVaardigheden.find((record) => record.id === id); }
    return sourceSkill;
}

getSkillsByIds.propTypes = { ids: PropTypes.array.isRequired };

// Helper function om skills uit de array op te halen
export function getSkillsByIds(ids) {
    const skills = [];
    for (const id of ids) {
        const skill = getSkillById(id);
        skills.push(skill.skill);
    }
    return skills;
}

getBasicSkillsFromTable.propTypes = { tableData: PropTypes.array.isRequired };

// Ophalen van alle vaardigheden uit de basis vaardigheden die aanwezig zijn in de tabel
export function getBasicSkillsFromTable(tableData) {
    const basicSkills = []
    tableData.forEach((tableSkill) => {
        if (sourceBasisVaardigheden.some((record) => record.id === tableSkill.id)) { basicSkills.push(tableSkill) }
    });
    return basicSkills;
}

getExtraSkillsFromTable.propTypes = { tableData: PropTypes.array.isRequired };

// Ophalen van alle vaardigheden uit de extra vaardigheden die aanwezig zijn in de tabel
export function getExtraSkillsFromTable(tableData) {
    if (!tableData || !tableData.length === 0) { return []; }
    const extraSkills = []
    tableData.forEach((tableSkill) => {
        if (sourceExtraVaardigheden.some((record) =>
            record.id === tableSkill.id)) { extraSkills.push(tableSkill) }
    });
    return extraSkills;
}

/// --- SPELLS & RECIPE --- ///
// Ophalen van een spreuk op basis van de skill
export function getSpellBySkill(skillId, spellId) {
    if (!skillId || !spellId) { return; }
    const sourceSpells = getSpellsBySkill(skillId);
    return sourceSpells?.find((item) => item.id === spellId);
}

// Ophalen van alle spreuken op basis van de skill
export function getSpellsBySkill(skillId) {
    if (!skillId) { return; }
    const sourceSpell = sourceSpreuken.find((item) => item.id.includes(skillId)); // let op. dit is een array.
    return sourceSpell?.Spells;
}

// Ophalen van een recept op basis van de skill
// Algemene recepten ophalen uit de Commoon
export function getRecipeBySkill(skillId, recipeId) {
    if (!skillId || !recipeId) { return; }
    const sourceRecipes = getRecipesBySkill(skillId);
    const recipeResult = sourceRecipes?.find((item) => item.id === recipeId) || getRecipeFromCommon(recipeId);
    return recipeResult
}

// Ophalen van alle recepten op basis van de skill
export function getRecipesBySkill(skillId) {
    if (!skillId) { return; }
    const skillResult = sourceSkillRecepten.find(item => item.id === skillId);
    return skillResult?.Recipes;
}

// Ophalen van recept uit de algemene recepten
export function getRecipeFromCommon(recipeId) {
    if (!recipeId) { return; }
    return sourceCommonRecepten?.find(item => item.id === recipeId);
}

getPropertyByName.propTypes = { name: PropTypes.string.isRequired };

// Ophalen van een default propertie value
export function getPropertyByName(name) {
    return defaultProperties.find((item) => item.name.toLowerCase() === name.toLowerCase());
}


/// --- VEREISTEN --- ///

// Check of de Skill aan de vereisten voldoet
export function meetsAllPrerequisites(selectedSkill, tableData) {
    let meetsPrerequisite = true;
    if (selectedSkill) {
        const reqSkill = selectedSkill.Requirements.skill;
        const reqAny = selectedSkill.Requirements.any_list;
        const reqCategory = selectedSkill.Requirements.Category;
        const reqException = selectedSkill.Requirements.exception;

        // exit early
        if (reqSkill.length === 0 &&
            reqAny.length === 0 &&
            (!reqCategory || (reqCategory && reqCategory.name.length === 0)) &&
            selectedSkill.id !== teacherSkill_Id) {
            return meetsPrerequisite;
        }
        else {
            // uitzondering eerst
            if (selectedSkill.id === teacherSkill_Id) {
                meetsPrerequisite = verifyTableContainsExtraSkill(tableData);
            }

            // skill
            if (reqSkill.length > 0 && meetsPrerequisite === true) {
                meetsPrerequisite = verifyTableContainsRequiredSkills(reqSkill, tableData);
            }

            // any_list
            if (reqAny.length > 0 && meetsPrerequisite === true) {
                meetsPrerequisite = verifyTableContainsOneofAnyList(reqAny, tableData);
            }

            // category
            if (reqCategory && meetsPrerequisite === true) {
                meetsPrerequisite = verifyTableMeetsPrerequisiteCategoryXP(reqCategory, tableData);
            }

            // exception
            if (reqException && meetsPrerequisite === false) {
                const isValidException = verifyTableMeetsPrerequisiteException(reqException, tableData);
                if (isValidException === true) { meetsPrerequisite = true }
            }
        }
    }
    else {
        console.warn("This skill should have been found, but was undefined");
    }
    return meetsPrerequisite;
}

// Check of er minimaal 1 vaardigheid uit de extra vaardigheden aanwezig is in de tabel
export function verifyTableContainsExtraSkill(tableData) {
    let meetsPrerequisite = false;
    for (const tableDataSkill of tableData) {
        meetsPrerequisite = sourceExtraVaardigheden.some((record) => record.id === tableDataSkill.id);
        if (meetsPrerequisite === true) { break; }
    }
    return meetsPrerequisite;
}

// Check of de skills in Requirements.skill aanwezig zijn in de tabel
function verifyTableContainsRequiredSkills(reqSkills, tableData) {
    let meetsPrerequisite = false;
    for (const reqSkill of reqSkills) {
        meetsPrerequisite = tableData.some((record) => record.id === reqSkill);
        if (meetsPrerequisite === false) { break; }
    }
    return meetsPrerequisite;
}

// Check of tenminste een van de skills in Requirements.any_list aanwezig zijn in de tabel
function verifyTableContainsOneofAnyList(reqAnyIds, tableData) {
    let meetsAnyListPrerequisite = false;
    for (const reqId of reqAnyIds) {
        meetsAnyListPrerequisite = tableData.some((record) => record.id === reqId);
        if (meetsAnyListPrerequisite === true) { break; }
    }
    return meetsAnyListPrerequisite;
}

// Check of het minimum totaal aan XP van de Requirements.Category aanwezig is in de tabel 
function verifyTableMeetsPrerequisiteCategoryXP(reqCategory, tableData) {
    let meetsPrerequisite = false;
    const categories = reqCategory.name;
    const totalReqXP = reqCategory.value;

    // Afhandelen uitzondering
    if (categories.length === 1 &&
        categories.includes("Ritualisme")) {
        const tableDataSkills = tableData.filter(tableItem => categories.includes(tableItem.category));
        // let op: deze vaardigheid kijkt in vereisten alleen naar de Ritualisme vaardigheid (zie extra skills)
        for (const skill of tableDataSkills) {
            if (skill.xp >= totalReqXP) {
                meetsPrerequisite = true;
                break;
            }
        }
    }
    // Standaard werking categorie
    else {
        let selectedSkillsXP = 0;
        const selectedSkills = tableData.filter(skillTableData =>
            categories.includes(skillTableData.category) &&                                 // van de juiste categorie
            (skillTableData.Spreuken.length > 0 || skillTableData.Recepten.length > 0));    // alleen skills met recepten of spreuken zijn doorgaans relevant
        selectedSkills.forEach(item => selectedSkillsXP += item.xp);                        // optellen totaal XP
        if (selectedSkillsXP >= totalReqXP) { meetsPrerequisite = true; }
    }
    return meetsPrerequisite;
}

// Als er een vaardigheid is (Druid/Necro) die prerequisite mag negeren
function verifyTableMeetsPrerequisiteException(reqExceptions, tableData) {
    let meetsException = false;
    for (const reqException of reqExceptions) {
        const matchingSkills = tableData.filter(skillTableData => skillTableData.id === reqException);
        if (matchingSkills.length > 0) {
            meetsException = true;
            break;
        }
    }
    return meetsException;
}

// Check of de skill een vereiste is voor een van de gekozen skills
export function isSkillAPrerequisiteToAnotherSkill(removedSkillId, isRemoved, tableData, setModalHeader, setModalMsg) {
    let isPrerequisite = false;

    if (tableData.length > 1) {
        if (!tableData.some(skill => skill.id === removedSkillId)) { return; }

        // Check leermeester expertise afhankelijkheden
        const containsTeacherSkill = tableData.some((record) => record.id === teacherSkill_Id);
        if (containsTeacherSkill) {
            const extraSkills = getExtraSkillsFromTable(tableData);
            const filteredSkills = extraSkills.filter(extraSkill => extraSkill.id !== removedSkillId)
            if (filteredSkills.length === 0) {
                isPrerequisite = true;

                setModalHeader(T("generic.oops"))
                const prereq = T("shared_actions.modals.item_is_prerequisite")
                const skill = tableData.find((record) => record.id === teacherSkill_Id).skill;
                const cant_remove = T("shared_actions.modals.cant_remove");
                setModalMsg(`${prereq} \n\n ${skill} \n\n ${cant_remove}`);
            }
        }

        // check overige vereisten
        if (isPrerequisite === false &&
            (!containsTeacherSkill || tableData.length > 1)) {
            for (const skillTableData of tableData) {
                const reqSkills = skillTableData.Requirements.skill;
                const reqAny = skillTableData.Requirements.any_list;
                const reqCategory = skillTableData.Requirements.Category;
                const reqException = skillTableData.Requirements.exception;

                if (isRemoved === true && skillTableData.id === removedSkillId) { continue; }
                else if (
                    reqSkills.length === 0 &&
                    reqAny.length === 0 &&
                    (!reqCategory || (reqCategory && reqCategory.name.length === 0))
                ) { continue; }
                else {
                    // skill
                    if (reqSkills.length > 0 && isPrerequisite === false) {
                        isPrerequisite = verifyRemovedSkillIsNotSkillPrerequisite(reqSkills, skillTableData, removedSkillId, isRemoved);
                        if (isPrerequisite === true) {

                            setModalHeader(T("generic.oops"))
                            const prereq = T("shared_actions.modals.item_is_prerequisite")
                            const skill = skillTableData.skill;
                            const cant_remove = T("shared_actions.modals.cant_remove");
                            setModalMsg(`${prereq} \n\n ${skill} \n\n ${cant_remove}`);
                            break;
                        }
                    }

                    // any_list
                    if (reqAny.length > 0 && isPrerequisite === false) {
                        isPrerequisite = verifyRemovedSkillIsNotOnlyAnyListPrerequisite(reqAny, skillTableData, removedSkillId, tableData);
                        if (isPrerequisite === true) {
                            setModalHeader(T("generic.oops"))
                            const prereq = T("shared_actions.modals.item_is_prerequisite")
                            const skill = skillTableData.skill;
                            const cant_remove = T("shared_actions.modals.cant_remove");
                            setModalMsg(`${prereq} \n\n ${skill} \n\n ${cant_remove}`);
                            break;
                        }
                    }

                    // category
                    if (reqCategory && isPrerequisite === false) {
                        const categories = reqCategory.name;
                        const totalReqXP = reqCategory.value;

                        // Afhandelen uitzondering
                        if (categories.length === 1 &&
                            categories.includes("Ritualisme")) {
                            isPrerequisite = verifyRemovedSkillIsNotARitualismPrerequisite(removedSkillId, tableData, isRemoved, totalReqXP);
                        }
                        // Standaard werking categorie
                        else {
                            isPrerequisite = verifyRemovedSkillIsNotACategoryPrerequisite(tableData, categories, skillTableData, removedSkillId, totalReqXP);
                        }

                        if (isPrerequisite === true) {
                            setModalHeader(T("generic.oops"))
                            const prereq = T("shared_actions.modals.xp_requirement")
                            const skill = skillTableData.skill;
                            const for_skill = T("shared_actions.modals.for_skill")
                            const cant_remove = T("shared_actions.modals.cant_remove");
                            setModalMsg(`${prereq} (${totalReqXP}) \n ${for_skill} \n\n ${skill} \n\n ${cant_remove}`);
                            break;
                        }
                    }

                    // exception
                    if (reqException && isPrerequisite === false) {
                        isPrerequisite = verifyTableExceptionSkillMeetsPrerequisite(tableData, reqException, removedSkillId);
                        if (isPrerequisite === true) {
                            let skill = null;

                            // Als de verwijderde vaardigheid de uitzonderingsskill is, 
                            // Zoek de andere vaardigheid die ook een afhankelijkheid heeft aan de Exception skill
                            if (reqException.includes(removedSkillId)) {
                                skill = tableData.find(skill =>
                                    skill.id !== skillTableData.id &&
                                    skill.Requirements.exception?.includes(removedSkillId)).skill

                                setModalHeader(T("generic.oops"))
                                const prereq = T("shared_actions.modals.exception_requirement")
                                const cant_remove = T("shared_actions.modals.cant_remove");
                                setModalMsg(`${prereq} \n\n ${skill} \n\n ${cant_remove}`);
                                break;
                            }
                            else {
                                skill = tableData.find(item => reqException.includes(item.id))?.skill;
                                setModalHeader(T("generic.oops"))
                                const prereq = T("shared_actions.modals.item_is_prerequisite")
                                const cant_remove = T("shared_actions.modals.cant_remove");
                                setModalMsg(`${prereq} \n\n ${skill} \n\n ${cant_remove}`);
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    return isPrerequisite;
}

// Check of de skill niet een prequisite is uit de Any_Skill
function verifyRemovedSkillIsNotSkillPrerequisite(reqSkillIds, currentSkill, removedSkillId, isRemoved) {
    let isPrerequisite = false;
    for (const reqSkillId of reqSkillIds) {
        if ((isRemoved && removedSkillId === reqSkillId) ||
            (!isRemoved && currentSkill.id === removedSkillId && currentSkill.count === 1)
        ) {
            return true;
        }
    }
    return isPrerequisite;
}

// Check of na verwijderen de overige skills nog voldoen voor de item.Any-List
function verifyRemovedSkillIsNotOnlyAnyListPrerequisite(reqAnyIds, skillTableData, removedSkillId, tableData) {
    let isPrerequisite = true;
    // Als alle uitzondering aanwezig zijn. Op dit moment is dat maximaal 2 skills
    // controleren of de andere uitzondering skill, zichzelf in stand houd.
    if (reqAnyIds.every(id => skillTableData.Requirements.any_list.find(anyId => anyId === id)) &&
        reqAnyIds.every(id => tableData.find(skill => skill.id === id))) {
        const reqAnySkillId = reqAnyIds.find(skillId => skillId !== removedSkillId);
        const reqAnySkill = getSkillById(reqAnySkillId);
        const filteredTableData = tableData.filter(skill =>
            skill.id !== skillTableData.id &&
            skill.id !== removedSkillId &&
            skill.id !== reqAnySkillId
        )
        const meetsRequirements = meetsAllPrerequisites(reqAnySkill, filteredTableData);
        if (meetsRequirements) { isPrerequisite = false; }
    } else {
        // Als er geen of maar 1 uitzondering aanwezig is
        // Checken of er meerdere counts zijn en hierin compenseren.
        const removedSkill = tableData.find(skill => skill.id === removedSkillId);
        if (removedSkill.count > 1) {
            removedSkill.count -= 1;
            removedSkill.xp -= 1;
            isPrerequisite = !meetsAllPrerequisites(removedSkill, tableData);
        }
        else {
            // Anders kijken of weghalen wel mag.
            const filteredTableData = tableData.filter(skill => skill.id !== removedSkillId) // haal verwijderde skill weg.
            for (const skill of filteredTableData) {
                const isValid = meetsAllPrerequisites(skill, filteredTableData);
                if (!isValid) {
                    isPrerequisite = true;
                    break;
                };
                isPrerequisite = false;
            };
        };
    };
    return isPrerequisite;
}

// Check of een Category prerequisite behouden wordt wanneer de skill verwijdert/verlaagd wordt
function verifyRemovedSkillIsNotACategoryPrerequisite(tableData, categories, item, removedSkillId, totalReqXP) {
    let isPrerequisite = false;
    let selectedSkillsXP = 0;
    const removedSkill = getSkillById(removedSkillId)

    if (categories.includes(removedSkill.category) || categories.includes(item.Requirements.Category?.name[0])) {
        const selectedSkills = tableData.filter(tableItem => categories.includes(tableItem.category) && // van de juiste categorie
            (tableItem.Spreuken.length > 2 || tableItem.Recepten.length > 2) && // alleen skills met recepten of spreuken zijn doorgaans relevant                             
            tableItem.id !== item.id && // item waarvan pre-reqs gecheckt worden uitsluiten
            tableItem.id !== removedSkillId); // Skip zelf, deze is wordt verwijderd.

        selectedSkills.forEach(item => selectedSkillsXP += item.xp); // calculate XP
        if (totalReqXP > selectedSkillsXP) { isPrerequisite = true; }
    }

    return isPrerequisite;
}

// Check of de uitgezonderde skills aanwezig zijn in tableData en of deze nog voldoen zonder verwijderde vaardigheid
// Dit is specifiek voor Druid/Necro die bepaalde vereisten mogen negeren
function verifyTableExceptionSkillMeetsPrerequisite(tableData, reqExceptions, removedSkillId) {
    let isExceptionPrerequisite = false;

    if (reqExceptions.includes(removedSkillId)) {
        const filteredTableData = tableData.filter(oldSkill => oldSkill.id !== removedSkillId);
        // Filter de skill met uitzonderingen weg om te zien of elke skill zichzelf in stand houd.
        // Ogenschijnlijk de enige manier om te dubbelchecken of elke skill zichzelf 'draagt'.
        // Dit is een hele lelijke dubbele loop omdat er meerdere uitzonderingen kunnen zijn (druid/necro)
        for (const req of reqExceptions) {
            const filterTableData_NoReq = filteredTableData.filter(oldSkill => oldSkill.id !== req)
            for (const skill of filteredTableData) {
                const filterTableData_NoSkill = filterTableData_NoReq.filter(oldSkill => oldSkill.id !== skill.id)
                const meetsPrequisites = meetsAllPrerequisites(skill, filterTableData_NoSkill);
                if (!meetsPrequisites) {
                    isExceptionPrerequisite = true;
                    break;
                };
            }
            if (isExceptionPrerequisite) { break; }
        }
    }
    return isExceptionPrerequisite;
}

// Check of de ritualisme vaardigheid verwijdert wordt, en zo ja of deze een prerequisite is.
// Zo ja, check ook of de vereiste door een andere ritualisme vaardigheid nog behaald wordt.
function verifyRemovedSkillIsNotARitualismPrerequisite(removedSkillId, tableData, isRemoved, totalReqXP) {
    let isPrerequisite = false;

    // List all Ritualism skills
    if (ritualismSkills_Ids.includes(removedSkillId)) {
        let tableSkillTotalXP = 0;
        const tableSkills = tableData.filter(tableItem => tableItem.category.includes("Ritualism"));

        // exit early
        if (isRemoved === true && tableSkills.length === 1) { isPrerequisite = true; }
        else {
            for (const tableSkill of tableSkills) {
                // Check of skill die vermindert wordt nog voldoet
                if (tableSkill.id === removedSkillId) {
                    if (!isRemoved) {
                        tableSkillTotalXP = tableSkill.xp - (tableSkill.xp / tableSkill.count);
                        isPrerequisite = totalReqXP > tableSkillTotalXP;
                    }
                }
                // Check of andere ritualisme skills garant staan voor pre-reqs
                else { isPrerequisite = totalReqXP > tableSkill.xp; }
            }
        }
    }
    return isPrerequisite;
}

/// --- TILES --- ///

// Op basis van de Eigenschappen, voeg nieuwe tegels toe.
export function updateGridEigenschappenTiles(tableData, defaultProperties) {
    const propertySums = defaultProperties.map((property) => (
        {
            ...property, value: tableData.reduce((sum, record) => {
                const vaardigheid = getSkillById(record.id);
                const propertyValue = vaardigheid.Eigenschappen?.find((prop) =>
                    prop.name.toLowerCase() === property.name.toLowerCase())?.value || 0;
                return sum + propertyValue * record.count;
            }, property.name === "hitpoints" ? 1 : 0)
        }));
    return propertySums;
}

// Op basis van de Spreuken, voeg nieuwe tegels toe.
export function updateGridSpreukenTiles(tableData) {
    const spellProperties = tableData.reduce((spellsAccumulator, record) => {
        const vaardigheid = getSkillById(record.id);
        const spells = vaardigheid.Spreuken || [];
        spells.forEach((spell) => {
            const existingSpell = spellsAccumulator.find((existing) => existing.id === spell);
            if (existingSpell) { existingSpell.count += spells.count; }
            else {
                const newSpell = {
                    "skillId": vaardigheid.id,
                    "spellId": spell,
                    "alt_skill": vaardigheid.alt_skill
                };
                spellsAccumulator.push({ ...newSpell });
            }
        });
        return spellsAccumulator;
    }, []);
    return spellProperties;
}

// Op basis van de Recepten, voeg nieuwe tegels toe.
export function updateGridReceptenTiles(tableData) {
    const recipeMap = new Map();

    tableData.forEach((record) => {
        const vaardigheid = getSkillById(record.id);
        const recepten = vaardigheid ? vaardigheid.Recepten : [];

        recepten.forEach((recept) => {
            if (recipeMap.has(recept)) {
                const existingRecipe = recipeMap.get(recept);
                existingRecipe.count += recept.count;
            } else {
                const newRecipe = {
                    "skillId": vaardigheid.id,
                    "recipeId": recept,
                    "alt_skill": vaardigheid.alt_skill,
                    "count": recept.count || 1 // Assuming each recipe has an initial count of 1 if not specified
                };
                recipeMap.set(recept, newRecipe);
            }
        });
    });

    // Convert the map values to an array
    const recipeProperties = Array.from(recipeMap.values());

    return recipeProperties;
}

/// --- PDF --- ///

// Open het vaardigheden boekje op de juiste pagina
export function openPdfPage(pdfName, pageNumber) {
    let rootURL = getPdfURL(pdfName);
    const fullURL = rootURL + pdfName + "#page=" + pageNumber;
    window.open(fullURL, '_blank');
}

export function getPdfURL(pdfName) {
    let rootURL = "";
    if ([
        "Vaardigheden.pdf",
        "Spreuken_en_Technieken.pdf",
        "Samenvatting_regelsysteem.pdf",
        "Crafting_loresheets.pdf",
        "Imbue_loresheet.pdf",
        "Kennis_van_kruiden.pdf",
        "Genezende_Dranken.pdf",
        "Kruiden_Elixers.pdf",
        "Magische_Elixers.pdf",
        "Hallucinerende_Elixers.pdf",
        "Giffen.pdf",
        "Armourpoint_kostuum_eisen.pdf"
    ].includes(pdfName)) { rootURL = "https://the-vortex.nl/wp-content/uploads/2024/06/" }
    else if ([
        "priest_runes.ttf",
        "mage_glyphs.ttf"
    ].includes(pdfName)) { rootURL = "https://the-vortex.nl/wp-content/uploads/2022/04/" }
    else if ([
        "Priest-Runes.pdf",
        "Mage-Glyphs.pdf"
    ].includes(pdfName)) { rootURL = "https://the-vortex.nl/wp-content/uploads/2022/03/" }
    else { console.warn("PDF name was not recognized as a valid option.", pdfName) }
    return rootURL;
}