import { useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Shared
import { useSharedState } from './SharedStateContext.jsx';
import { saveCharacterToStorage } from './SharedStorage.js';
import {
    updateGridEigenschappenTiles,
    updateGridSpreukenTiles,
    updateGridReceptenTiles,
} from './SharedActions.js';

import {
    resetTotalXP,
    regeneratedBasisVaardigheden,
    regeneratedExtraVaardigheden,
    defaultProperties,
} from './SharedObjects.js';

// Components
import {
    SpellTile,
    RecipeTile
} from './components/GridTileItem.jsx';
import FAQModal from './components/FaqModal.jsx'
import FileUploadModal from './components/FileUploadModal.jsx'
import GridEigenschapItem from './components/GridEigenschapItem.jsx';
import LoadCharacterModal from './components/LoadCharacterModal.jsx'
import LoadPresetModal from './components/LoadPresetModal.jsx'
import ModalMessage from './components/ModalMessage.jsx'
import ReleaseNotesModal from './components/ReleaseNotesModal.jsx'
import Toolbar from './components/Toolbar.jsx';
import SkillTable from './components/SkillTable.jsx';


/// --- MAIN APP --- ///
export default function App() {
    const {
        version,
        creator,
        tableData,
        isChecked,
        MAX_XP,
        charName,

        showModal, setShowModal,
        showFAQModal, setShowFAQModal,
        showReleaseNotesModal, setShowReleaseNotesModal,
        showUploadModal,
        showLoadCharacterModal,
        showLoadPresetModal,
        setModalMsg,
        gridEigenschappen, setGridEigenschappen,
        gridEnergiePerDag, setGridEnergiePerDag,
        gridSpreuken, setGridSpreuken,
        gridRecepten, setGridRecepten
    } = useSharedState();

    // Wanneer er iets aan de tableData verandert, wordt de nieuwe data opgeslagen.
    // Op basis van de nieuwe tableData worden de Selects, Grid en Spreuken/Recepten bijewerkt.
    const onUpdateTableData = useCallback(() => {


        // LocalStorage bijwerken
        saveCharacterToStorage('CCdata', charName, isChecked, MAX_XP, tableData);

        // SELECT skill options bijwerken | reeds geselecteerde items worden uitgesloten.
        // INPUT resterende XP bijwerken
        regeneratedBasisVaardigheden(tableData);
        regeneratedExtraVaardigheden(tableData);
        resetTotalXP(tableData);

        // karakter eigenschappen container
        const updatedAllGridContent = updateGridEigenschappenTiles(tableData, defaultProperties)
        const updatedGridEigenschappenContent = updatedAllGridContent.filter((property) => {
            return property.name === 'hitpoints'
                || property.name === 'armourpoints'
                || (property.value !== 0  && property.name.includes('glyph'))
                || (property.value !== 0 && property.name.includes('rune'))
        });

        const updatedGridEnergiePerDag = updatedAllGridContent.filter((property) => {
            return (property.value !== 0 && property.name === 'willpower')
                || (property.value !== 0 && property.name === 'inspiration')
                || (property.value !== 0 && property.name.includes('elemental'))
                || (property.value !== 0 && property.name.includes('spiritual'))
        });

        setGridEigenschappen(updatedGridEigenschappenContent);
        setGridEnergiePerDag(updatedGridEnergiePerDag)

        // spreuken & techieken container
        const updatedGridSpreukenContent = updateGridSpreukenTiles(tableData).filter((property) => {
            return property.value !== ""
        });
        setGridSpreuken(updatedGridSpreukenContent);

        // recepten container
        const updatedGridReceptenContent = updateGridReceptenTiles(tableData).filter((property) => {
            return property.value !== ""
        });
        setGridRecepten(updatedGridReceptenContent);
    }, [charName, isChecked, MAX_XP, tableData, setGridEigenschappen, setGridEnergiePerDag, setGridSpreuken, setGridRecepten]);

    useEffect(() => { onUpdateTableData(); }, [onUpdateTableData, tableData]);

    function showDisclaimer() {
        if (showModal !== true) {
            setModalMsg(
                "De character creator geeft een indicatie van de mogelijkheden. " +
                "Er kunnen altijd afwijkingen zitten tussen de teksten " +
                "in de character creator en de VA regelset.\n\n" +
                "Check altijd de laatste versie van de regelset op:\n" +
                "https://the-vortex.nl/het-spel/regels/" +
                "\n");
            setShowModal(true);
        }
    }

    const openFAQModal = () => { setShowFAQModal(true); }
    const openReleaseNotesModal = () => { setShowReleaseNotesModal(true); }

    /// --- HTML CONTENT --- ///
    return (
        <div className="App">
            <header className="App-header" id="App-header">
                <div></div>
                <div className="header-wrapper" id="header-wrapper">
                    <img id="App-VA-logo" src="./images/logo_100.png" alt="Logo" />
                    <h2 id="App-VA-title">Character Creator</h2>
                </div>
                <div></div>
            </header>
            <main id="main">
                <div className="main-container">
                    <Toolbar />
                    <SkillTable />

                    {showModal && (<ModalMessage />)}
                    {showUploadModal && (<FileUploadModal />)}
                    {showFAQModal && (<FAQModal />)}
                    {showReleaseNotesModal && (<ReleaseNotesModal />)}
                    {showLoadCharacterModal && (<LoadCharacterModal />)}
                    {showLoadPresetModal && (<LoadPresetModal />)}

                </div>
                <div className="side-containers">
                    <div className="side-container-b" id="side-container-b">
                        <div className="summary-title">
                            <h5>Character eigenschappen</h5>
                        </div>
                        <div className="grid-eigenschappen">
                            {gridEigenschappen.map((item) => (
                                <GridEigenschapItem
                                    name={item.name}
                                    key={uuidv4()}
                                    image={item.image}
                                    text={item.text}
                                    value={item.value}
                                />
                            ))}
                        </div>
                        <div className="summary-title">
                            <h5>Energie per Dag</h5>
                        </div>
                        <div className="grid-eigenschappen">
                            {gridEnergiePerDag.map((item) => (
                                <GridEigenschapItem
                                    name={item.name}
                                    key={uuidv4()}
                                    image={item.image}
                                    text={item.text}
                                    value={item.value}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="side-container-a" id="side-container-a">
                        <div className="summary-title">
                            <h5>Spreuken & Technieken</h5>
                        </div>
                        <div className="grid-spreuken">
                            {gridSpreuken?.map((item) => (
                                <SpellTile
                                    key={uuidv4()}
                                    skillName={item.skill}
                                    spellName={item.name}
                                    page={item.page}
                                />
                            ))}
                        </div>

                        <div className="summary-title">
                            <h5>Recepten</h5>
                        </div>
                        <div className="grid-recepten">
                            {gridRecepten.map((item) => (
                                <RecipeTile
                                    key={uuidv4()}
                                    skillName={item.skill}
                                    recipeName={item.name}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main >
            <div className="flex-filler"></div>
            <footer>
                <div className="release-notes" onClick={openReleaseNotesModal}><u>{version}</u></div>
                <div>{creator}{'\u2122'}</div>
                <div>
                    <div className="disclaimer" onClick={showDisclaimer}><u>Disclaimer</u></div>
                    <div className="faq" onClick={openFAQModal}><u>F.A.Q.</u></div>
                </div>
            </footer>
        </div >
    );
}