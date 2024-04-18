import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useTable, useSortBy } from 'react-table';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';

// shared
import { useSharedState } from '../SharedStateContext.jsx';
import {
    getSkillById,
    isSkillAPrerequisiteToAnotherSkill,
} from '../SharedActions.js';

import {
    totalXP,
    setTotalXP,
    sourceBasisVaardigheden,
    sourceExtraVaardigheden,
} from '../SharedObjects.js';

// Components
import { InfoTooltip } from './Tooltip.jsx';
import LoreSheet from './LoreSheet.jsx';

// SkillTabel Kolommen
const columns = [
    { Header: "ID", accessor: "id", className: "col-id" },
    { Header: "Vaardigheid", accessor: "skill", className: "col-vaardigheid" },
    { Header: "XP Kosten", accessor: "xp", className: "col-xp" },
    { Header: "Loresheet", accessor: "loresheet", className: "col-loresheet", Cell: (table) => {return <LoreSheet pdf={table?.cell?.value?.pdf}></LoreSheet>}},
    { Header: "Aantal keer", accessor: "count", className: "col-aantalkeer" },
    { Header: "Info", className: "col-info", Cell: (table) => {return <InfoTooltip row={table.cell.row}></InfoTooltip>}}
];

export default function SkillTable() {
    // SharedStateContext
    const {
        tableData, setTableData,
        setIsChecked,
        MAX_XP, setMAX_XP,
        setCharName,
        setSelectedBasicSkill,
        setSelectedExtraSkill,

        setShowModal,
        setModalMsg,
    } = useSharedState();


    /// --- TABLE CONTENT --- ///
    function getTableDataSums() {
        if (tableData.length > 0) {
            setTotalXP(tableData.reduce((accumulator, skill) => accumulator + skill.xp, 0));
            return (
                <tr>
                    <td /><td>Aantal vaardigheden: {tableData.length} </td>
                    <td>Totaal: {totalXP}</td>
                    <td />
                    <td />
                    <td />
                    <td>
                        <button
                            title="Alle vaardigheden verwijderen"
                            className="btn-secondary"
                            onClick={clearCharacterBuild}>
                            Wissen
                        </button>
                    </td>
                </tr>
            );
        }
        else {
            setTotalXP(0);
            return null;
        }
    }

    // Wissen van tabel + naam
    function clearCharacterBuild() {
        setTableData([]);
        setCharName("");
        setMAX_XP(15);
        setIsChecked(true);
        setSelectedBasicSkill(null);
        setSelectedExtraSkill(null);
    }

    // Verwijderen uit de tabel, updaten van grid
    function handleDelete(row) {
        // check of het een vereiste is
        const isPrerequisite = isSkillAPrerequisiteToAnotherSkill(row.skill, true, tableData, setModalMsg);
        if (isPrerequisite) { setShowModal(true); }
        else {
            // Item weghalen uit grid
            setTableData((prevData) => prevData.filter((item) =>
                item.skill.toLowerCase() !== row.skill.toLowerCase()));
        }
    }

    // Aanvullende aankopen van reeds bestaande vaardigheid
    function handleAdd(row) {
        if (totalXP < Math.floor(MAX_XP)) {
            // Source data
            let sourceRecord = sourceBasisVaardigheden.find((record) =>
                record.skill.toLowerCase() === row.skill.toLowerCase());
            if (!sourceRecord) {
                sourceRecord = sourceExtraVaardigheden.find((record) =>
                    record.skill.toLowerCase() === row.skill.toLowerCase())
            }
            const currentRecord = tableData.find((record) =>
                record.skill.toLowerCase() === row.skill.toLowerCase());

            if (currentRecord.count < sourceRecord.maxcount) {
                const updatedTableData = tableData.map((record) =>
                    record.skill.toLowerCase() === row.skill.toLowerCase()
                        ? { ...record, count: record.count + 1, xp: sourceRecord.xp * (record.count + 1) }
                        : record
                );
                setTableData(updatedTableData);
            }
            else {
                // Inbouwen extra zekerheid dat items niet twee keer in het grid komen.
                setModalMsg("Maximum aantal aankopen bereikt. \nToevoegen is niet toegestaan.\n");
                setShowModal(true);
            }
        }
        else {
            setModalMsg("Maximum XP (" + MAX_XP + ") bereikt. \nToevoegen is niet toegestaan.\n");
            setShowModal(true);
        }
    }

    function handleSubtract(row) {
        // check of het een vereiste is
        const isPrerequisite = isSkillAPrerequisiteToAnotherSkill(row.skill, false, tableData, setModalMsg);
        if (isPrerequisite) { setShowModal(true); }
        else {
            const currentSkill = tableData.find(currentSkill => currentSkill.skill === row.skill);
            if (currentSkill.count === 1) {
                // Item weghalen uit grid
                setTableData((prevData) => prevData.filter((item) =>
                    item.skill.toLowerCase() !== row.skill.toLowerCase()));
            }
            else {
                const updatedTableData = tableData.map((record) =>
                    record.skill.toLowerCase() === row.skill.toLowerCase() &&
                        record.multi_purchase === true
                        ? { ...record, count: record.count - 1, xp: (record.xp / record.count) * (record.count - 1) }
                        : record
                );
                setTableData(updatedTableData);
            }
        }
    }

    // Plaats Acties in de kolom op basis van de multipurchase property
    function requestActions(row) {
        const currentItem = getSkillById(row.original.id);
        if (currentItem && currentItem.multi_purchase === true) {
            return (
                <div className="acties">
                    <div className="acties-overige">
                        <img
                            className="btn-image"
                            title="Toevoegen"
                            onClick={() => handleAdd(currentItem)}
                            src="./images/button_add.png"
                            alt="Add">
                        </img>
                        <img
                            className="btn-image"
                            title="Verminderen"
                            onClick={() => handleSubtract(currentItem)}
                            src="./images/button_subtract.png"
                            alt="Subtract">
                        </img>
                        <img
                            className="btn-image"
                            title={currentItem.skill + " verwijderen"}
                            onClick={() => handleDelete(currentItem)}
                            src="./images/button_remove.png"
                            alt="Remove">
                        </img>
                    </div>
                </div>
            );
        }
        else {
            return (
                <div className="acties">
                    <div className="acties-overige">
                        <img
                            className="btn-image"
                            title={currentItem.skill + " verwijderen"}
                            onClick={() => handleDelete(currentItem)}
                            src="./images/button_remove.png"
                            alt="Remove">
                        </img>
                    </div>
                </div>
            );
        }
    }

    // TableData aanpassen op basis van Drag & Drop
    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const updatedTableData = [...tableData];
        const [reorderedRow] = updatedTableData.splice(result.source.index, 1);
        updatedTableData.splice(result.destination.index, 0, reorderedRow);
        setTableData(updatedTableData);
    };

    SkillTable.propTypes = {
        selectedCharacter: PropTypes.string,
        handleCharacterChange: PropTypes.func.isRequired,
    };


    const determineSortinSymbol = (isSorted) => { return isSorted ? ' \u25BC' : ' \u25B2'; }

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: tableData }, useSortBy);

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <table {...getTableProps()} className="App-table" id="App-table">
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr key={uuidv4()} {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th
                                    key={uuidv4()}
                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                    className={column.className}
                                >
                                    {column.render('Header')}
                                    <span>
                                        {column.isSorted ? determineSortinSymbol(column.isSortedDesc) : ''}
                                    </span>
                                </th>
                            ))}
                            <th key={uuidv4()} className="col-acties">Acties</th>
                        </tr>
                    ))}
                </thead>
                <Droppable droppableId="skillsDataTable">
                    {(provided) => (
                        <tbody
                            {...getTableBodyProps()}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {rows.map((row, index) => {
                                prepareRow(row);
                                return (
                                    <Draggable
                                        key={row.id}
                                        draggableId={row.id}
                                        index={index}>
                                        {(provided) => (
                                            <tr
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                {row.cells.map((cell) => (
                                                    // eslint-disable-next-line react/jsx-key
                                                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                                ))}
                                                <td role="cell">
                                                    {requestActions(row)}
                                                </td>
                                            </tr>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {getTableDataSums()}
                            {provided.placeholder}
                        </tbody>
                    )}
                </Droppable>
            </table>
        </DragDropContext>
    );
}