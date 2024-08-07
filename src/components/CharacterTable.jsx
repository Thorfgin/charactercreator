import { useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

// shared
import { getAllLocalStorageKeys } from '../SharedStorage.js';


CharacterTable.propTypes = {
    selectedCharacter: PropTypes.string,
    handleCharacterChange: PropTypes.func.isRequired,
};

export default function CharacterTable({ selectedCharacter, handleCharacterChange }) {
    // Multi-Language support klaarzetten
    const { t } = useTranslation();

    const tableRef = useRef(null);

    const keys = getAllLocalStorageKeys();
    keys.sort((a, b) => a.localeCompare(b));

    function handleSelectCharacter(key) {
        handleCharacterChange(key);
        // Verwijderen 'selected-row' als deze al was toegewezen
        const prevSelectedRow = tableRef.current.querySelector('.selected-row');
        if (prevSelectedRow) {
            prevSelectedRow.classList.remove('selected-row');
        }

        // Toevoegen 'selected-row' aan geselecteerde rij
        const selectedRow = tableRef.current.querySelector(`tr[data-key="${key}"]`);
        if (selectedRow) {
            selectedRow.classList.add('selected-row');
        }
    }

    return (
        <table className="character-table" ref={tableRef}>
            <tbody>
                {keys.length > 0 && keys.map((key) => (
                    <tr
                        key={key}
                        data-key={key}
                        className={selectedCharacter === key ? 'selected-row' : ''}
                        onClick={() => handleSelectCharacter(key)}
                    >
                        <td>{key}</td>
                    </tr>
                ))}
                {(!keys || keys.length === 0) && (
                    <tr>
                        <td>{t("character_table.labels.no_characters")}</td>
                    </tr>
                )
                }
            </tbody>
        </table>
    );
}