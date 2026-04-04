import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// components
import CharacterTable from './CharacterTable.jsx';

// Shared
import { useSharedState } from '../SharedStateContext.jsx';
import {
    loadCharacterFromStorage,
    getAllLocalStorageKeys
} from '../SharedStorage.js';

function LoadCharacterModal() {
    // Multi-Language support klaarzetten
    const { t } = useTranslation();

    const [selectedCharacter, setSelectedCharacter] = useState("");

    // Ophalen uit SharedStateContext
    const {
        setTableData,
        setCharName,
        setIsChecked,
        setMAX_XP,
        setShowLoadCharacterModal,
        setSelectedBasicSkill,
        setSelectedExtraSkill
    } = useSharedState();

    const closeModal = () => { setShowLoadCharacterModal(false); };

    // Laden uit de local storage van de browser
    function loadCharacterFromLocalStorage() {
        // Validatie van input
        if (!selectedCharacter || typeof selectedCharacter !== 'string' || selectedCharacter.trim() === "") {
            return;
        }

        try {
            const key = getAllLocalStorageKeys(selectedCharacter);
            const charData = loadCharacterFromStorage(key);
            if (!charData) return;

            setCharName(charData.name || selectedCharacter.replace('CC-', ''));
            setIsChecked(charData.is_checked ?? false);
            setMAX_XP(charData.max_xp ?? 0);
            setTableData(charData.Skills || []);
            setSelectedBasicSkill(null);
            setSelectedExtraSkill(null);
            closeModal();

        } catch (error) {
            const msg = t("loadcharacter_modal.modals.cant_load_version");
            console.error(msg, {
                character: selectedCharacter,
                originalError: error
            });

            alert(msg);
        }
    }

    // Selecteer personage
    function handleCharacterChange(selectedChar) { setSelectedCharacter(selectedChar); }

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="load-modal" onClick={e => e.stopPropagation()}>
                <h3>{t("loadcharacter_modal.labels.load_character")}</h3>
                <div className="upload-modal-block center-content">
                    <CharacterTable
                        selectedChar={selectedCharacter}
                        handleCharacterChange={handleCharacterChange} />
                </div>
                <div className="load-modal-block">
                    <button className="btn-primary" onClick={loadCharacterFromLocalStorage}>{t("generic.load")}</button>
                    <button className="btn-primary" onClick={closeModal}>{t("generic.cancel")}</button>
                </div>
            </div>
            <span className="close" onClick={closeModal}>&times;</span>
        </div>
    );
}

export default LoadCharacterModal;
