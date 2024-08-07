import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';

// Components
import Collapsible from './Collapsible.jsx';

// shared
import { getSourceFAQ } from '../SharedObjects.js';
import { useSharedState } from '../SharedStateContext.jsx';

// Toont een venster met daar in de meeste gestelde vragen.
// Vragen zijn open/dicht te klappen
export default function FAQModal() {
    // Multi-Language support klaarzetten
    const { t } = useTranslation();

    const { setShowFAQModal } = useSharedState();
    const closeModal = () => { setShowFAQModal(false); };

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="faq-modal" onClick={e => e.stopPropagation()}>
                <h3>Frequently Asked Questions</h3>
                <div className="faq-modal-block">
                    {getSourceFAQ().FAQ.map(({ header, message }) => (
                        <Collapsible
                            key={uuidv4()}
                            className="modal-block"
                            header={header}
                            message={message}
                        />
                    ))}
                </div>
                <div><br /></div>
                <button className="btn-primary" onClick={closeModal}>{t("generic.close")}</button>
            </div>
            <span className="close" onClick={closeModal}>&times;</span>
        </div>
    );
}