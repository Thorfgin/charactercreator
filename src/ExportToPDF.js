import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

// Shared
import {
    sourceSpreuken,
    sourceRecepten
} from './SharedObjects.js';

import { getPdfURL } from './SharedActions.js';

let version = "";

// Definieer de table columns en headers
const columns = [
    { header: 'ID', dataKey: 'id' },
    { header: 'Vaardigheid', dataKey: 'skill' },
    { header: 'Aantal keer', dataKey: 'count' },
    { header: 'XP Kosten', dataKey: 'xp' },
    { header: 'Loresheet', dataKey: 'loresheet' },
];

// Definieer de Option variaties
const titleOptions = {
    fontSize: 14,
    font: 'helvetica',
    textColor: [72, 133, 199],
};

const bigTitleOptions = {
    fontSize: 18,
    font: 'InknutAntiqua-Regular',
    textColor: [72, 133, 199],
};

const coverOptions = {
    fontSize: 24,
    font: 'InknutAntiqua-Regular',
    textColor: [0, 0, 0],
};

const headerOptions = {
    fontSize: 16,
    font: 'InknutAntiqua-Regular',
    textColor: [0, 0, 0],
};

// Const waarmee de XP per event berekend wordt
const calculateGainedXP = (MAX_XP) => {
    if (MAX_XP < 20) { return 1.5; }
    else if (MAX_XP >= 20 && MAX_XP < 30) { return 1.25; }
    else if (MAX_XP >= 30 && MAX_XP < 40) { return 1; }
    else if (MAX_XP >= 40 && MAX_XP < 50) { return 0.75; }
    else if (MAX_XP >= 50) { return 0.5; }
    else { console.error("The required xp value was not found"); }
}

// Nieuwe pagina klaarzetten
async function addNewPage(pdf) {
    pdf.addPage();
    await addImageToPDF(pdf, './images/logo_100.png', { x: 70, y: 7.5, width: 50, height: 50 });
    await addTextBlockToPdf(pdf, ["Character Creator"], 82, 15, false, headerOptions);
    await addTextBlockToPdf(pdf, [`Vortex Adventures - Character Creator - versie ${version}`], 105, 285, true);
}

// Voeg Skills toe aan de pdf
async function addSkillDescriptionsToPdf(pdf, tableData, x = 20, y = 30) {
    const blockElements = [];
    for (const item of tableData) {
        const punten = item.xp > 1 ? "punten" : "punt";
        const vereisten = "Vereist: "
            + (item.Requirements.skill ? item.Requirements.skill : "")
            + (item.Requirements.any_list ? item.Requirements.any_list : "")
            + (item.Requirements.exception ? item.Requirements.exception : "");

        const newBlock = {
            title: {
                options: {
                    text: `${item.skill} (${item.xp} ${punten})`,
                    fontSize: 14,
                    font: 'helvetica',
                    textColor: [72, 133, 199],
                    lineheight: 1
                }
            },
            requirements: {
                options: {
                    text: `${vereisten}`,
                    isItalic: true,
                    fontSize: 11
                }
            },
            description: {
                options: {
                    text: `${item.description}`,
                    fontSize: 11
                }
            },

        };
        blockElements.push(newBlock);
    }
    await addTextBlockWithMarkUpToPdf(pdf, blockElements, x, y);
}

// Voeg Spreuken toe aan de pdf
async function addSpellDescriptionsToPdf(pdf, gridSpreuken, x = 20, y = 30) {
    const blockElements = [];

    for (const item of gridSpreuken) {
        const skillFound = sourceSpreuken.find((sourceSkill) =>
            item.skill?.toLowerCase() === sourceSkill.skill.toLowerCase() ||
            item.alt_skill?.toLowerCase() === sourceSkill.skill.toLowerCase());
        if (!skillFound) { continue; }

        const spellData = skillFound?.Spells.find((sourceSpell) =>
            item.name?.toLowerCase() === sourceSpell.spell.toLowerCase());
        if (!spellData) { continue; }

        const newBlock = {
            title: {
                options: {
                    text: `${spellData.spell} ${spellData.mana_cost}`,
                    fontSize: 14,
                    font: 'helvetica',
                    textColor: [72, 133, 199],
                    lineheight: 1
                }
            },
            skill: {
                options: {
                    text: `Vaardigheid: ${item.skill}`,
                    fontSize: 11
                }
            },
            incantation: {
                options: {
                    text: `${spellData.incantation}`,
                    isItalic: true,
                    fontSize: 11
                }
            },
            description: {
                options: {
                    text: `${spellData.description}`,
                    fontSize: 11
                }
            },
            spelleffect: {
                options: {
                    text: `${spellData.spell_effect}, ${spellData.spell_duration}`,
                    fontSize: 11
                }
            },
        };
        blockElements.push(newBlock);
    }
    await addTextBlockWithMarkUpToPdf(pdf, blockElements, x, y);
}

// Voeg Recepten toe aan de pdf
async function addRecipeDescriptionsToPdf(pdf, gridRecepten, x = 20, y = 30) {
    const blockElements = [];

    for (const item of gridRecepten) {
        const skillFound = sourceRecepten.find((sourceSkill) =>
            item.skill?.toLowerCase() === sourceSkill.skill.toLowerCase());
        if (!skillFound) { continue; }

        const recipeData = skillFound?.Recipes.find((sourceRecipe) =>
            item.name?.toLowerCase() === sourceRecipe.recipy.toLowerCase());
        if (!recipeData) { continue; }

        let newTitle = `${recipeData.recipy}`;
        newTitle = newTitle + (recipeData.inspiration >= 1 ? ` ${recipeData.inspiration}` : ``);

        const newBlock = {
            title: {
                options: {
                    text: `${newTitle}`,
                    fontSize: 14,
                    font: 'helvetica',
                    textColor: [72, 133, 199],
                    lineheight: 1
                }
            },
            skill: {
                options: {
                    text: `Vaardigheid: ${item.skill}`,
                    fontSize: 11
                }
            },
            components: {
                options: {
                    text: `Componenten: ${recipeData.components}`,
                    isItalic: true,
                    fontSize: 11
                }
            },
            description: {
                options: {
                    text: `${recipeData.effect}`,
                    fontSize: 11
                }
            }
        };
        blockElements.push(newBlock);
    }
    await addTextBlockWithMarkUpToPdf(pdf, blockElements, x, y);
}

// Voeg LoreSheets in een Bijlage-referentie toe
async function addLoreSheetDescriptionsToPdf(pdf, uniqueLoreSheetValues, x = 20, y = 30) {
    const blockElements = [];

    for (const item of uniqueLoreSheetValues) {
        const url = getPdfURL(item.pdf);
        const sourcePDF = url + item.pdf;
        const newTitle = item.pdf.split(".")[0];

        let special;
        if (item.pdf.includes("Priest-Runes") || item.pdf.includes("Mage-Glyphs")) {
            const specialUrl = getPdfURL(item.special);
            special = specialUrl + item.special;
        }

        const newBlock = {
            title: {
                options: {
                    text: newTitle,
                    fontSize: 14,
                    font: 'helvetica',
                    textColor: [72, 133, 199],
                    lineheight: 1
                }
            },
            url: {
                options: {
                    text: sourcePDF,
                    special: special,
                    isUrl: true,
                    fontSize: 11,
                    textColor: [0, 0, 255]
                }
            },
            description: {
                options: {
                    text: ``,
                    fontSize: 11
                }
            }
        };
        blockElements.push(newBlock);
    }
    await addTextBlockWithMarkUpToPdf(pdf, blockElements, x, y);
}

// Voeg een block met mark-up toe aan de pdf.
async function addTextBlockWithMarkUpToPdf(pdf, blockElements, x, y, maxWidthPercentage = 0.8) {
    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageWidth = pdf.internal.pageSize.getWidth() * maxWidthPercentage;

    // Bereken de height van het element
    const getTotalElementHeight = (allParts = []) => {
        let totalHeight = 0;
        for (const part of allParts) {
            if (part?.options?.text) {
                const blockSize = part.options?.text.split('\n').length * part.options.fontSize * 0.92;
                totalHeight += blockSize;
            }
        }
        return totalHeight;
    };

    // Verwerk het element
    const processElement = async (options, fontSizeThreshold = 14) => {
        const {
            text = "",
            special = undefined,
            fontSize = 11,
            font = 'helvetica',
            isUrl = false,
            isItalic = false,
            textColor = [0, 0, 0],
            lineHeight = 0.45 } = options;

        if (isItalic === true) { pdf.setFont(font, "italic"); }
        else { pdf.setFont(font, "normal"); }
        pdf.setFontSize(fontSize);
        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);

        if (fontSize >= fontSizeThreshold) { y += 1; }

        const lines = pdf.splitTextToSize(text, pageWidth);
        for (const line of lines) {
            if (line.trim() === "") { continue; }
            if (isUrl === true) {
                pdf.setTextColor(0, 0, 0);
                pdf.text("Url:", x, y)
                pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
                pdf.textWithLink(line, x + 12, y, { url: line, target: "_blank" });
                if (special !== undefined) {
                    y += (fontSize * lineHeight);
                    pdf.setTextColor(0, 0, 0);
                    pdf.text("Extra:", x, y)
                    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
                    pdf.textWithLink(special, x + 12, y, { url: special, target: "_blank" });
                }
            }
            else { pdf.text(line, x, y); }
            y += (fontSize * lineHeight);
        }
    }

    // element op de pagina plaatsen
    for (const element of blockElements) {
        const {
            title = {},
            url = {},
            skill = {},
            incantation = {},
            requirements = {},
            components = {},
            description = {},
            spelleffect = {}
        } = element;

        const totalElementHeight = getTotalElementHeight([title, url, skill, incantation, requirements, components, description, spelleffect]);
        if (y + totalElementHeight > pageHeight) {
            await addNewPage(pdf);
            y = 30;
        }

        if (title?.options) { await processElement(title.options); }
        if (url?.options) { await processElement(url.options); }
        if (skill?.options) { await processElement(skill.options); }
        if (incantation?.options) { await processElement(incantation.options); }
        if (requirements?.options && requirements?.options?.text?.toLowerCase().trim() !== "vereist:") {
            await processElement(requirements.options);
        }
        if (components?.options) { await processElement(components.options); }
        if (description?.options) { await processElement(description.options); }
        if (spelleffect?.options) { await processElement(spelleffect.options); }
        y += 4;
    }
}

// Voeg skills table toe aan de pdf
async function addSkillTableToPdf(pdf, tableData, posY) {
    // Map de data aan de columns.
    const rows = tableData.map((item) => {
        const row = {};
        columns.forEach((column) => {
            if (column.dataKey === 'loresheet' ) {
                row[column.dataKey] = item[column.dataKey]?.pdf ? JSON.stringify(item[column.dataKey].pdf).replace(/"/g, '') : '';
            } else {
                row[column.dataKey] = item[column.dataKey];
            }
        });
        return row;
    });

    // Definieer de table settings.
    const tableOptions = {
        startY: posY, // Adjust the Y position where the table starts.
        body: rows,
        columns,
        headStyles: {
            fillColor: [0, 0, 0],
            textColor: [255, 255, 255]
        }, // Header styles.
        alternateRowStyles: { fillColor: [240, 240, 240] }, // Alternate row styles.
    };

    pdf.autoTable(tableOptions);
}

// Voeg een Afbeelding van een element via ID toe aan de pdf
async function addImgElementToPDF(pdf, element, width, height, posX = 10, posY = 10) {
    const input = document.getElementById(element);
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = imgData;

        img.onload = function () {
            let imgWidth;
            let imgHeight;

            if (img.width > img.height) {
                imgWidth = width * 0.2;
                imgHeight = (img.height / img.width) * width * 0.2;
            } else {
                imgHeight = height * 0.2;
                imgWidth = (img.width / img.height) * height * 0.2;
            }

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            const x = posX <= 0 ? (pageWidth - imgWidth) / 2 : posX;
            const y = posY <= 0 ? (pageHeight - imgHeight) / 2 : posY;
            pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
            resolve();
        };
        img.onerror = reject;
    });
}

// Voeg een Afbeelding als achtergrond toe aan de pdf
async function addImageToPDF(pdf, imageSource, options = undefined) {
    const img = new Image();
    img.src = imageSource;

    return new Promise((resolve, reject) => {
        img.onload = function () {

            if (options) {
                pdf.addImage(img, 'PNG', options.x, options.y, options.width * 0.25, options.height * 0.25);
            }
            else {
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                pdf.addImage(img, 'PNG', 0, 0, pageWidth, pageHeight);
            }
            resolve();
        };
        img.onerror = reject;
    });
}

// Voeg Tekst toe aan de pdf
async function addTextBlockToPdf(pdf, textArray, x = 0, y = 0, isCentered = false, options = {}) {
    const {
        fontSize = 11,
        font = 'helvetica',
        textColor = [0, 0, 0],
        lineHeight = 0.5,
    } = options;

    pdf.setFont(font);
    pdf.setFontSize(fontSize);
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);

    let currentY = y;
    let currentTextIndex = 0;

    const addTextBlockAsync = async () => {
        if (currentTextIndex < textArray.length) {
            const text = textArray[currentTextIndex];
            const textWidth = pdf.getTextWidth(text);
            const textX = isCentered ? x - (textWidth / 2) : x;

            if (currentY + fontSize > pdf.internal.pageSize.getHeight()) {
                await addNewPage(pdf);
                currentY = 30;
            }

            pdf.text(text, textX, currentY);
            currentY += (fontSize * lineHeight);
            currentTextIndex++;

            // Recursively call the function to process the next text block
            await addTextBlockAsync();
        }
    };
    return addTextBlockAsync();
}

// Exporteren van de gegevens in de tableData en Grids naar PDF
export default async function useExportToPDF(charName, ruleset_version, tableData, MAX_XP, totalXP, gridSpreuken, gridRecepten) {
    version = ruleset_version;
    let name = (charName && charName !== "") ? charName : "Naam onbekend";

    const uniqueItemsSet = new Set();
    // Samenvoegen en Filteren van LoreSheets
    const uniqueLoreSheetValues = [...new Set(tableData.map(item => item.loresheet))]
        .filter(item => {
            if (item.pdf !== undefined && !uniqueItemsSet.has(item.pdf)) {
                uniqueItemsSet.add(item.pdf);
                return true;
            }
            return false;
        });
    uniqueLoreSheetValues.push({ pdf: "Samenvatting-regelsysteem.pdf" });

    const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
    });

    // Font wordt opgehaald uit de CSS @font-face
    pdf.addFont('InknutAntiqua-Regular.ttf', 'InknutAntiqua-Regular', 'normal');

    const next_event_xp = calculateGainedXP(MAX_XP);

    /// --- OPBOUW EXPORT --- ///

    // Page 1
    await addImageToPDF(pdf, './images/pdf_cover.png');
    await addImageToPDF(pdf, './images/logo_100.png', { x: 52, y: 200, width: 75, height: 75 });
    await addTextBlockToPdf(pdf, ["Character Creator"], 72, 212, false, coverOptions);
    await addTextBlockToPdf(pdf, [`versie ${version}`], 105, 222, true);

    // Page 2
    await addNewPage(pdf);
    await addTextBlockToPdf(pdf, ["Character"], 35, 50, false, titleOptions);
    await addTextBlockToPdf(pdf, [`${name}`], 35, 55, false);

    await addTextBlockToPdf(pdf, ["XP"], 35, 70, false, titleOptions);
    await addTextBlockToPdf(pdf, [
        `Totaal XP: ${MAX_XP}`,
        `Uitgegeven XP: ${totalXP}`,
        `Besteedbare XP: ${MAX_XP - totalXP}`,
        `XP per Event: ${next_event_xp}`], 35, 75);

    await addTextBlockToPdf(pdf, ["Vaardigheden"], 35, 105, false, titleOptions);
    await addTextBlockToPdf(pdf, [
        `Aantal vaardigheden: ${tableData.length}`,
        `Aantal spreuken/technieken: ${gridSpreuken.length}`,
        `Aantal recepten: ${gridRecepten.length}`], 35, 110, false);

    await addImgElementToPDF(pdf, "side-container-b", 350, 625, 100, 45);

    // Page 3
    await addNewPage(pdf);
    await addSkillTableToPdf(pdf, tableData, 30);

    // Page 4 -->>

    /// --- VAARDIGHEDEN --- ///
    await addNewPage(pdf);
    await addTextBlockToPdf(pdf, ["Vaardigheden"], 20, 30, false, bigTitleOptions);
    await addSkillDescriptionsToPdf(pdf, tableData, 20, 40);

    /// --- OPTIONEEL: SPREUKEN --- ///
    if (gridSpreuken.length > 0) {
        await addNewPage(pdf);
        await addTextBlockToPdf(pdf, ["Spreuken & Technieken"], 20, 30, false, bigTitleOptions);
        await addSpellDescriptionsToPdf(pdf, gridSpreuken, 20, 40);
    }

    /// --- OPTIONEEL: RECEPTEN --- ///
    if (gridRecepten.length > 0) {
        await addNewPage(pdf);
        await addTextBlockToPdf(pdf, ["Recepten"], 20, 30, false, bigTitleOptions);
        await addRecipeDescriptionsToPdf(pdf, gridRecepten, 20, 40);
    }

    /// --- LoreSheets --- ///
    await addNewPage(pdf);
    await addTextBlockToPdf(pdf, ["Bijlagen"], 20, 30, false, bigTitleOptions);
    await addLoreSheetDescriptionsToPdf(pdf, uniqueLoreSheetValues, 20, 40);

    pdf.save(`${name}.pdf`);
}