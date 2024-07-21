import PropTypes from 'prop-types';

// components
import {
    SpellTooltip,
    RecipeTooltip
} from './Tooltip.jsx';

import {
    getSpellBySkill,
    getRecipeBySkill
} from '../SharedActions.js';

SpellTile.propTypes = {
    skillId: PropTypes.number.isRequired,
    spellId: PropTypes.number.isRequired
};

export function SpellTile({ skillId, spellId }) {
    const spell = getSpellBySkill(skillId, spellId);

    return (
        <div className="grid-spreuk-item">
            <div className="grid-spreuk-text">{"  " + spell.spell}</div>
            <div className="grid-spreuk-icons">
                <SpellTooltip
                    skillId={skillId}
                    spellId={spellId}
                />
            </div>
        </div>
    );
}

RecipeTile.propTypes = {
    skillId: PropTypes.number.isRequired,
    recipeId: PropTypes.number.isRequired,
};

export function RecipeTile({ skillId, recipeId }) {
    const recipe = getRecipeBySkill(skillId, recipeId);

    return (
        <div className="grid-spreuk-item">
            <div className="grid-spreuk-text">{"  " + recipe.recipe}</div>
            <div className="grid-spreuk-icons">
                <RecipeTooltip
                    skillId={skillId}
                    recipeId={recipeId}
                />
            </div>
        </div>
    );
}