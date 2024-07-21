/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

// components
import TemplateTable from './TemplateTable.jsx';

// Shared
import { useSharedState } from '../SharedStateContext.jsx';
import { getPresets } from '../SharedObjects.js'
import { loadCharacterFromPreset } from '../SharedStorage.js'

export default function LoadPresetModal() {
    // Multi-Language support klaarzetten
    const { t } = useTranslation();

    const [selectedTemplate, setSelectedTemplate] = useState("");

    // Ophalen uit SharedStateContext
    const {
        setTableData,
        setCharName,
        setIsChecked,
        setMAX_XP,
        setShowLoadPresetModal,
        setSelectedBasicSkill,
        setSelectedExtraSkill
    } = useSharedState();

    const closeModal = () => { setShowLoadPresetModal(false); };

    // Converteer teksten naar tekstblokken.
    const getBlock = (text, className) => {
        if (!text) { return <p></p> }
        let descriptionBlock = text.split('\n');
        const description = descriptionBlock.map((block) => (
            <div key={uuidv4()}> {block === '' ? <br /> : block} </div>
        ));
        return description;
    }

    // Selecteer personage
    function handleSelectPreset(selectedTemp) { setSelectedTemplate(selectedTemp); }

    function loadPresetToTableData() {
        const preset = getPresets().Presets.find(item => item.name === selectedTemplate)
        try {
            const charData = loadCharacterFromPreset(preset);
            if (charData) {
                setCharName(charData.name);
                setIsChecked(charData.is_checked);
                setMAX_XP(charData.max_xp);
                setTableData(charData.Skills);
                setSelectedBasicSkill(null);
                setSelectedExtraSkill(null);
                closeModal();
            }
        }
        catch {
            console.error(t("loadpreset_modal.modals.cant_load_version"));
        }
    }

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="preset-modal" onClick={e => e.stopPropagation()}>
                <h3>{t("loadpreset_modal.labels.view_template")}</h3>
                {getBlock(t("loadpreset_modal.labels.description"), "modal-description")}
                <div className="preset-modal-block center-content">
                    <TemplateTable
                        selectedChar={selectedTemplate}
                        handleTemplateChange={handleSelectPreset}
                    />
                </div>
                <div className="preset-modal-block">
                    <button className="btn-primary" onClick={loadPresetToTableData}>{t("generic.load")}</button>
                    <button className="btn-primary" onClick={closeModal}>{t("generic.cancel")}</button>
                </div>
            </div>
            <span className="close" onClick={closeModal}>&times;</span>
        </div>
    );
}