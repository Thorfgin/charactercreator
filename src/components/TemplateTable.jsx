import { useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

// shared
import { CustomTooltip } from './Tooltip.jsx';

// functions
import { getPresets } from '../SharedObjects.js'

TemplateTable.propTypes = {
    selectedTemplate: PropTypes.string,
    handleTemplateChange: PropTypes.func.isRequired
};

export default function TemplateTable({ selectedTemplate, handleTemplateChange }) {
    // Multi-Language support klaarzetten
    const { t } = useTranslation();

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
                                    header={`${t("template_table.labels.template")} ${item.name}`}
                                    message={item.information}
                                />
                            </td>
                        )}
                    </tr>
                ))}
                {!sourcePresets && (
                    <tr>
                        <td>{t("template_tabe.labels.no_presets_found")}</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}