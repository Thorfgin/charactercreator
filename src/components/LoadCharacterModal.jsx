import { useState } from 'react';
import { T } from '../i18n.js';

// components
import CharacterTable from './CharacterTable.jsx';

// Shared
import { useSharedState } from '../SharedStateContext.jsx';
import {
    loadCharacterFromStorage,
    getAllLocalStorageKeys
} from '../SharedStorage.js';

function LoadCharacterModal() {
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
        try {
            const key = getAllLocalStorageKeys(selectedCharacter);
            const charData = loadCharacterFromStorage(key);
            if (charData) {
                setCharName(charData.name || selectedCharacter.replace('CC-', ''));
                setIsChecked(charData.is_checked);
                setMAX_XP(charData.max_xp);
                setTableData(charData.Skills);
                setSelectedBasicSkill(null);
                setSelectedExtraSkill(null);
                closeModal();
            }
            else if (!selectedCharacter || selectedCharacter.trim() === "") {
                // Do nothing
            }
        }
        catch {
            const msg = T("loadcharacter_modal.modals.cant_load_version");
            alert(msg);
            console.error(msg, selectedCharacter);
        }
    }

    // Selecteer personage
    function handleCharacterChange(selectedChar) { setSelectedCharacter(selectedChar); }

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="load-modal" onClick={e => e.stopPropagation()}>
                <h3>{T("loadcharacter_modal.labels.load_character")}</h3>
                <div className="upload-modal-block center-content">
                    <CharacterTable
                        selectedChar={selectedCharacter}
                        handleCharacterChange={handleCharacterChange} />
                </div>
                <div className="load-modal-block">
                    <button className="btn-primary" onClick={loadCharacterFromLocalStorage}>{T("generic.load")}</button>
                    <button className="btn-primary" onClick={closeModal}>{T("generic.cancel")}</button>
                </div>
            </div>
            <span className="close" onClick={closeModal}>&times;</span>
        </div>
    );
}

export default LoadCharacterModal;
