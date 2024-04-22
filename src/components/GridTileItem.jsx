import PropTypes from 'prop-types';

// components
import {
    SpellTooltip,
    RecipeTooltip
} from './Tooltip.jsx';

SpellTile.propTypes = {
    id: PropTypes.number.isRequired,
    spellName: PropTypes.string.isRequired,
    page: PropTypes.number,
};

export function SpellTile({ id, spellName, page=1 }) {
    return (

        <div className="grid-spreuk-item">
            <div className="grid-spreuk-text">{"  " + spellName}</div>
            <div className="grid-spreuk-icons">
                <SpellTooltip
                    id={id}
                    spellName={spellName}
                    page={page}
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