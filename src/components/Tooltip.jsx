import { useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';


// shared
import {
    openPdfPage,
    getSkillById,
    getSkillsByIds,
    getSpellBySkill,
    getRecipeBySkill
} from '../SharedActions.js'

import {
    teacherSkill
} from '../SharedConstants.js'

// Converteer teksten naar tekstblokken.
const getBlock = (text, className) => {
    if (!text) { return <div key={uuidv4()} className={className || 'error'}> </div> }
    let descriptionBlock = text.split('\\n');
    const description = descriptionBlock.map((block) => (
        <div key={uuidv4()} className={className}> {block === '' ? <br /> : block} </div>
    ));
    return description;
}

// Map items uit een block  - translates all mapped items
function useMapping(tooltipData) {
    // Multi-Language support klaarzetten
    const { t } = useTranslation();

    return tooltipData.map((item) => {
        const uniqueKey = uuidv4();
        const label = t(item.label);
        const value = item.value;

        return (
            <tr key={uniqueKey}>
                {label ? <td className="tooltip-property">{label}</td> : null}
                <td className="tooltip-value">{value}</td>
            </tr>
        );
    })
}

InfoTooltip.propTypes = { row: PropTypes.any.isRequired };

// Plaats Info in de kolom
export function InfoTooltip({ row }) {
    // Multi-Language support klaarzetten
    const { t } = useTranslation();

    let currentItem = getSkillById(row.original.id);
    return (
        <div className="info">
            <div className="acties-info">
                <SkillTooltip id={currentItem.id} />
                <img
                    className="btn-image"
                    title={t("info_tooltip.pdf_reference") + " " + currentItem.page}
                    onClick={() => openPdfPage('Vaardigheden.pdf', currentItem.page)}
                    src="./images/img-pdf.png"
                    alt="PDF">
                </img>
            </div>
        </div>
    )
}

SkillTooltip.propTypes = {
    id: PropTypes.number.isRequired,
    image: PropTypes.string
};

export function SkillTooltip({ id, image = './images/img-info.png' }) {
    // Multi-Language support klaarzetten
    const { t } = useTranslation();

    const sourceSkill = getSkillById(id);
    let fullRequirementsBlock = "";

    function formatList(items) { return items.join(', \\n'); }

    // Check skills
    const reqSkills = getSkillsByIds(sourceSkill.Requirements.skill);
    if (reqSkills.length > 0) { fullRequirementsBlock += `${formatList(reqSkills)} \\n`; }

    // Exception - "Leermeester Expertise"
    if (sourceSkill.id === teacherSkill) { fullRequirementsBlock += t("skill_tooltip.extra_skill_req"); }

    // Check any_list
    const reqAny = getSkillsByIds(sourceSkill.Requirements.any_list);
    if (reqAny.length > 0) {
        fullRequirementsBlock += t("skill_tooltip.any_of_these_req");
        fullRequirementsBlock += ` \\n${ formatList(reqAny) } \\n`; }

    // Check category
    const reqCategory = sourceSkill.Requirements.Category;
    if (reqCategory && reqCategory.name.length > 0) {
        fullRequirementsBlock += `${reqCategory.value}`;
        fullRequirementsBlock += t("skill_tooltip.category_req");
        fullRequirementsBlock += ` \\n${formatList(reqCategory.name)}`;
    }

    const tooltipData = [
        { label: 'skill_tooltip.labels.xp_cost', value: sourceSkill.xp },
        { label: 'skill_tooltip.labels.requirements', value: getBlock(fullRequirementsBlock, "requirements-block") },
        { label: 'skill_tooltip.labels.description', value: getBlock(sourceSkill.description, "description-block") },
    ];

    const tooltipItems = useMapping(tooltipData);
    const header = t("generic.skill");

    return GenericTooltip({
        header: `${header} ${sourceSkill?.skill || null}`,
        message: tooltipItems || null,
        image: image
    });
}

SpellTooltip.propTypes = {
    skillId: PropTypes.number.isRequired,
    spellId: PropTypes.number.isRequired,
    image: PropTypes.string
};

export function SpellTooltip({ skillId, spellId, image = './images/img-info.png' }) {
    // Multi-Language support klaarzetten
    const { t } = useTranslation();

    const sourceSkill = getSkillById(skillId);
    const sourceSpell = getSpellBySkill(skillId, spellId);
    const description = getBlock(sourceSpell?.description, "description-block");

    const tooltipData = [
        { label: 'spell_tooltip.labels.energy_cost', value: sourceSpell?.mana_cost || null },
        { label: 'spell_tooltip.labels.energy_type', value: (sourceSpell?.mana_type != "Special" ? sourceSpell?.mana_type : t("generic.special_mana")) || null },
        { label: 'spell_tooltip.labels.incantation', value: sourceSpell?.incantation || null },
        { label: 'spell_tooltip.labels.description', value: description || t("generic.info_not_found") },
        { label: 'spell_tooltip.labels.effect', value: sourceSpell?.spell_effect || null },
        { label: 'spell_tooltip.labels.duration', value: sourceSpell?.spell_duration || null },
    ];

    const tooltipItems = useMapping(tooltipData);

    return (
        <div className="grid-spreuk-icons">
            <GenericTooltip
                header={`${t("generic.skill")} ${sourceSkill.skill}`}
                subheader={`${t("generic.spell_technique")} ${sourceSpell.spell}`}
                message={tooltipItems || ''}
                image={image}
            />

            <img
                className="btn-image"
                title={`${t("spell_tooltip.pdf_reference")} ${sourceSpell.page}`}
                onClick={() => openPdfPage('Spreuken_en_Technieken.pdf', sourceSpell.page)}
                src="./images/img-pdf.png"
                alt="PDF">
            </img>
        </div>
    )
}

RecipeTooltip.propTypes = {
    skillId: PropTypes.number.isRequired,
    recipeId: PropTypes.number.isRequired,
    image: PropTypes.string
};

export function RecipeTooltip({ skillId, recipeId, image = './images/img-info.png' }) {
    // Multi-Language support klaarzetten
    const { t } = useTranslation();

    const sourceSkill = getSkillById(skillId);
    const sourceRecipe = getRecipeBySkill(skillId, recipeId);
    const description = getBlock(sourceRecipe?.effect, "description-block");

    const tooltipData = [
        { label: 'recipe_tooltip.labels.description', value: description || t("generic.info_not_found") },
        { label: 'recipe_tooltip.labels.inspiration_cost', value: sourceRecipe?.inspiration || null },
        { label: 'recipe_tooltip.labels.supplies', value: sourceRecipe?.components || null },
    ];

    const tooltipItems = useMapping(tooltipData);

    return (
        <div className="grid-spreuk-icons">
            <GenericTooltip
                header={`${t("generic.skill")} ${sourceSkill.skill}`}
                subheader={`${t("generic.recipe")} ${sourceRecipe.recipe}`}
                message={tooltipItems || ''}
                image={image}
            />
        </div>
    )
}

CustomTooltip.propTypes = {
    header: PropTypes.string.isRequired,
    subheader: PropTypes.any,
    message: PropTypes.string.isRequired,
    image: PropTypes.any,
};

export function CustomTooltip({ header, subheader = undefined, message, image = './images/img-info.png' }) {
    // Multi-Language support klaarzetten
    const { t } = useTranslation();

    const description = getBlock(message, "description-block");
    const tooltipData = [{ label: 'generic.no_label', value: description || t("generic.info_not_found") }];
    const tooltipItems = useMapping(tooltipData);

    return (
        <div className="grid-spreuk-icons">
            <GenericTooltip
                header={header}
                subheader={subheader}
                message={tooltipItems}
                image={image}
            />
        </div>
    )
}

GenericTooltip.propTypes = {
    header: PropTypes.any,
    subheader: PropTypes.any,
    message: PropTypes.any,
    image: PropTypes.any,
};

function GenericTooltip({ header, subheader = undefined, message, image = './images/img-info.png' }) {
    const [showTooltip, setShowTooltip] = useState(false);
    const handleMouseOver = () => setShowTooltip(true);
    const closeTooltip = () => setShowTooltip(false);

    return (
        <div className="tooltip-container" onMouseEnter={handleMouseOver}>
            <img
                className="btn-image"
                src={image}
                alt="info"
            />
            {showTooltip && (
                <div className="tooltip-overlay">
                    <div className="tooltip" onClick={closeTooltip}>
                        <h5>{header}</h5>
                        {subheader ? <h5>{subheader}</h5> : null}
                        <table className="tooltip-table">
                            <tbody>
                                {message}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}