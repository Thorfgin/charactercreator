import { useRef } from 'react';
import PropTypes from 'prop-types';

// shared
import { CustomTooltip } from './Tooltip.jsx';

// functions
import { getPresets } from '../SharedObjects.js'

TemplateTable.propTypes = {
    selectedTemplate: PropTypes.string,
    handleTemplateChange: PropTypes.func.isRequired
};

export default function TemplateTable({ selectedTemplate, handleTemplateChange }) {
    const tableRef = useRef(null);
    const presets = getPresets();
    const sourcePresets = presets.Presets.sort((a, b) => a.name.localeCompare(b.name));

    function handleSelectTemplate(name) {
        handleTemplateChange(name);
        // Verwijderen 'selected-row' als deze al was toegewezen
        const prevSelectedRow = tableRef.current.querySelector('.selected-row');
        if (prevSelectedRow) { prevSelectedRow.classList.remove('selected-row'); }

        // Toevoegen 'selected-row' aan geselecteerde rij
        const selectedRow = tableRef.current.querySelector(`tr[data-key="${name}"]`);
        if (selectedRow) { selectedRow.classList.add('selected-row'); }
    }

    return (
        <table className="character-table" ref={tableRef}>
            <tbody>
                {sourcePresets.length > 0 && sourcePresets.map((item) => (
                    <tr
                        key={item.name}
                        data-key={item.name}
                        className={selectedTemplate === item.name ? 'selected-row' : ''}
                        onClick={() => handleSelectTemplate(item.name)}
                    >
                        <td>{item.name}</td>
                        {item.information !== "" && (
                            <td>
                                <CustomTooltip
                                    header={"Template: " + item.name}
                                    message={item.information}
                                />
                            </td>
                        )}
                    </tr>
                ))}
                {!sourcePresets && (
                    <tr>
                        <td>Geen presets gevonden</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}