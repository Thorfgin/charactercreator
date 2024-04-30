import PropTypes from 'prop-types';

// components
import {
    SpellTooltip,
    RecipeTooltip
} from './Tooltip.jsx';

import {
    getSpellBySkill
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
    id: PropTypes.number.isRequired,
    recipeName: PropTypes.string.isRequired,
};

export function RecipeTile({ id, recipeName }) {
    return (
        <div className="grid-spreuk-item">
            <div className="grid-spreuk-text">{"  " + recipeName}</div>
            <div className="grid-spreuk-icons">
                <RecipeTooltip
                    id={id}
                    recipeName={recipeName}
                />
            </div>
        </div>
    );
}