/* eslint-disable react-refresh/only-export-components */
import { useState } from 'react';
import PropTypes from 'prop-types';
import Tooltip from './tooltip.jsx';
import openPage from './openPdf.jsx';
import {
    sourceBasisVaardigheden,
    sourceExtraVaardigheden,
    defaultProperties
} from './App.jsx';
import {
    SpiderController,
    GhostController,
    SkeletonController,
} from './additions/bug.jsx';
import {
    StoneController
} from './additions/stone.jsx';
import './css/heart.css';

let bugsActive = false;

GridEigenschapItem.propTypes = {
    image: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
};

// Karakter eigenschappen griditem
export function GridEigenschapItem({ image, text, value }) {

    const [clicked, setClicked] = useState(false);
    const [counter, setCounter] = useState(0);
    const [spiderController, setSpiderController] = useState(null);
    const [ghostController, setGhostController] = useState(null);
    const [skeletonController, setSkeletonController] = useState(null);
    const [stoneController, setStoneController] = useState(null);

    let reqClicks = 2;

    const handleItemClick = () => {
        setClicked(!clicked);
        setCounter(counter + 1);
    };

    const getContent = () => {
        // eslint-disable-next-line react/prop-types
        if (text.trim() === "Totaal HP" && clicked && counter >= reqClicks) {
            const jstoggle = document.getElementById("App-VA-logo");

            // event listenis op Logo. Werkt wanneer hartje aanwezig is.
            jstoggle.addEventListener('click', () => {
                const pulsingHeart = document.getElementById("pulsingheart");

                if (pulsingHeart && bugsActive === false) {
                    bugsActive = true;
                    const spider = new SpiderController({ minBugs: 3, maxBugs: 5 });
                    setSpiderController(spider);
                    const ghost = new GhostController();
                    setGhostController(ghost);
                    const skeleton = new SkeletonController();
                    setSkeletonController(skeleton);
                    const stone = new StoneController();
                    setStoneController(stone);
                }
            });

            return (
                <div>
                    <div className="grid-eigenschap-image" style={{ backgroundImage: "url(" + image + ")" }}>
                        <div className="wrapper">
                            <div className="pulsingheart" id="pulsingheart"></div>
                        </div>
                    </div >
                    <div className="grid-eigenschap-text">{text}: {value}</div>
                </div>
            );
        }
        else {
            if (bugsActive === true && counter >= reqClicks) {
                setCounter(0);
                setClicked(false);
                bugsActive = false;

                setTimeout(() => {
                    spiderController.killAll();
                    ghostController.killAll();
                    skeletonController.killAll();
                }, 1000);

                setTimeout(() => {
                    spiderController.end();
                    ghostController.end();
                    skeletonController.end();
                    stoneController.end();
                }, 3000);
            }
            return (
                <div>
                    <div className="grid-eigenschap-image" style={{ backgroundImage: "url(" + image + ")" }} />
                    <div className="grid-eigenschap-text">{text}: {value}</div>
                </div>
            )
        }
    }

    return (
        <div className={`grid-eigenschap-item ${clicked ? 'clicked' : ''}`} onClick={handleItemClick}>
            {getContent()}
        </div>
    );
}

GenericTooltipItem.propTypes = {
    skill: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    page: PropTypes.number,
};

// Generiek aanmaken van een tooltip knop op basis van type
export function GenericTooltipItem({ skill, name, text, type, page }) {

    let result = <div></div>;
    if (type === "grid-spreuken") { result = getTooltip(skill, name, type, page); }
    if (type === "grid-recepten") { result = getTooltip(skill, name, type); }

    return (
        <div className="grid-spreuk-item">
            <div className="grid-spreuk-text">{"  " + text}</div>
            {result}
        </div>
    );
}

getTooltip.propTypes = {
    skill: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    page: PropTypes.number,
};

function getTooltip(skill, name, type, page) {
    let isSpell = false;
    let isRecipe = false;

    if (type === "grid-spreuken") { isSpell = true; }
    else if (type === "grid-recepten") { isRecipe = true; }
    else { console.log("Type was not recognized") }

    return (
        <div className="grid-spreuk-icons">
            <Tooltip
                skillName={skill}
                itemName={name}
                isSpell={isSpell}
                isRecipe={isRecipe}
                isSkill={false} />
            {isSpell &&
                page && (
                    <img
                        className="btn-image"
                        title={"Open Spreuken.pdf - pagina " + page}
                        onClick={() => openPage('Spreuken.pdf', page)}
                        src="./images/img-pdf.png"
                        alt="PDF">
                    </img>
                )}
        </div>
    )
}

// Op basis van de Eigenschappen, voeg nieuwe tegels toe.
export function updateGridEigenschappenTiles(tableData) {
    const propertySums = defaultProperties.map((property) => (
        {
            ...property, value: tableData.reduce((sum, record) => {
                let vaardigheid = sourceBasisVaardigheden.find((vaardigheid) =>
                    vaardigheid.skill.toLowerCase() === record.skill.toLowerCase());
                if (!vaardigheid) {
                    vaardigheid = sourceExtraVaardigheden.find((vaardigheid) =>
                        vaardigheid.skill.toLowerCase() === record.skill.toLowerCase());
                }

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
        let vaardigheid = sourceBasisVaardigheden.find((vaardigheid) =>
            vaardigheid.skill.toLowerCase() === record.skill.toLowerCase());
        if (!vaardigheid) {
            vaardigheid = sourceExtraVaardigheden.find((vaardigheid) =>
                vaardigheid.skill.toLowerCase() === record.skill.toLowerCase());
        }

        const spells = vaardigheid.Spreuken || [];

        spells.forEach((spell) => {
            const existingSpell = spellsAccumulator.find((existing) =>
                existing.name.toLowerCase() === spell.name.toLowerCase());
            if (existingSpell) { existingSpell.count += spell.count; }
            else {
                spell.skill = vaardigheid.skill;
                spellsAccumulator.push({ ...spell });
            }
        });
        return spellsAccumulator;
    }, []);
    return spellProperties;
}

// Op basis van de Recepten, voeg nieuwe tegels toe.
export function updateGridReceptenTiles(tableData) {
    const recipyProperties = tableData.reduce((recipyAccumulator, record) => {
        let vaardigheid = sourceBasisVaardigheden.find((vaardigheid) =>
            vaardigheid.skill.toLowerCase() === record.skill.toLowerCase());
        if (!vaardigheid) {
            vaardigheid = sourceExtraVaardigheden.find((vaardigheid) =>
                vaardigheid.skill.toLowerCase() === record.skill.toLowerCase());
        }

        const recepten = vaardigheid.Recepten || [];

        for (const recipy of recepten) {
            const existingRecipy = recipyAccumulator.find((existing) =>
                existing?.name.toLowerCase() === recipy.name.toLowerCase());
            if (existingRecipy) {
                existingRecipy.count += recipy.count;
            } else {
                recipy.skill = vaardigheid.skill;
                recipyAccumulator.push({ ...recipy });
            }
        }
        return recipyAccumulator;
    }, []);
    return recipyProperties;
}