import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// shared
import { useSharedState } from '../SharedStateContext.jsx';
import { importCharacterFromFile } from '../SharedStorage.js';

export default function FileUploadModal() {
    // Multi-Language support klaarzetten
    const { t } = useTranslation();

    const {
        setCharName,
        setIsChecked,
        setMAX_XP,
        setTableData,
        setShowUploadModal,
        setSelectedBasicSkill,
        setSelectedExtraSkill
    } = useSharedState();

    const [selectedFile, setSelectedFile] = useState(null);

    // Werk bestand info mbij
    const handleFileChange = (e) => { setSelectedFile(e.target.files[0]); };
    const closeModal = () => { setShowUploadModal(false); }

    // Oppakken van het aangewezen bestand, uitlezen en nakijken of het matcht.
    // Daarna de juiste velden en tabel updaten.
    function handleUpload() {
        if (selectedFile) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const rawData = e.target.result;
                try {
                    if (rawData) {
                        const charData = importCharacterFromFile(rawData);
                        if (charData) {
                            setCharName(charData.name || "Mr/Mrs Smith");
                            setIsChecked(charData.is_checked);
                            setMAX_XP(charData.max_xp);
                            setTableData(charData.Skills);
                            setSelectedBasicSkill(null);
                            setSelectedExtraSkill(null);
                            setSelectedFile(null);
                            closeModal();
                        }
                        else {
                            const msg = t("fileupload_modal.modals.cant_load_version");
                            alert(msg);
                            console.error(msg, selectedFile, charData);
                        }


                    }
                } catch (error) {
                    const msg = t("fileupload_modal.modals.unknown_error");
                    alert(msg);
                    console.error(msg, error);
                }
            };

            reader.readAsText(selectedFile);
            closeModal();

            setSelectedFile(null);
        }
    }

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="upload-modal" onClick={e => e.stopPropagation()}>
                <h3>{t("fileupload_modal.labels.upload_file")}</h3>
                <div className="upload-modal-block center-content">
                    <input type="file" onChange={handleFileChange} />
                </div>
                <div className="upload-modal-block">
                    <button className="btn-primary" onClick={handleUpload}>{t("generic.upload")}</button>
                    <button className="btn-primary" onClick={closeModal}>{t("generic.cancel")}</button>
                </div>
            </div>
            <span className="close" onClick={closeModal}>&times;</span>
        </div>
    );
}