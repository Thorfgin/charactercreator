import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';

// Shared
import { useSharedState } from '../SharedStateContext.jsx';

// Toont een Modal message met alleen een sluit knop
export default function ModalMessage() {
    // Multi-Language support klaarzetten
    const { t } = useTranslation();

    // Ophalen uit SharedStateContext
    const {
        modalMsg,
        setShowModal
    } = useSharedState();

    const closeModal = () => { setShowModal(false); };

    const msgBlocks = modalMsg.split('\n');
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // Checken of block als URL omgevormd moet worden
    const getBlock = (block) => block.match(urlRegex) ? <a target="_blank" rel="noopener noreferrer" href={block}>{block}</a> : block

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-container">
                    {msgBlocks.map((block) => (
                        <div key={uuidv4()} className="modal-block">
                            {block === '' ? <br /> : getBlock(block)}
                        </div>
                    ))}
                </div>
                <button className="btn-primary" onClick={closeModal}>
                    {t("generic.ok")}
                </button>
            </div>
            <span className="close" onClick={closeModal}>&times;</span>
        </div>);
}