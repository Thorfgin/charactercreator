import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';

ConfirmModal.propTypes = {
    header: PropTypes.string,
    modalMsg: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired
};

// Toont een Modal message met een Bevestig/Annuleer knop
export default function ConfirmModal({ header, modalMsg, closeModal, onConfirm }) {
    // Multi-Language support klaarzetten
    const { t } = useTranslation();

    const msgBlocks = modalMsg.split('\n');

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <h3>{header}</h3>
                <div className="modal-container">
                    {msgBlocks.map((block) => (
                        <div key={uuidv4()} className="modal-block">
                            {block === '' ? <br /> : block}
                        </div>
                    ))}
                </div>
                <button className="btn-primary" onClick={onConfirm}>{t("generic.confirm")}</button>
                <button className="btn-primary" onClick={closeModal}>{t("generic.cancel")}</button>
            </div>
            <span className="close" onClick={closeModal}>&times;</span>
        </div>
    );
}
