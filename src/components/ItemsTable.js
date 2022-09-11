import { useCallback, useContext, useState, useEffect } from 'react';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, SpeedDial, SpeedDialIcon, SpeedDialAction, Link } from '@mui/material';
import { Delete, Edit, ArrowRight, ArrowDropDown, Add, AddCircleOutline } from '@mui/icons-material';
import { OrderContext } from '../contexts/OrderContext';
import TypesProvider from '../contexts/TypesContext';
import AddItemDialog from './dialogs/AddItemDialog';
import AddBundleDialog from './dialogs/AddBundleDialog';
import EditItemDialog from './dialogs/EditItemDialog';
import DeleteItemConfirmationDialog from './dialogs/DeleteItemConfirmationDialog';
import useSnapshot from '../hooks/useSnapshot';
import { getDoc, query, collection, orderBy, where, runTransaction, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';

// TODO: add a cross to the search bar to clear the field

const SortableTableCell = ({ children, field, width }) => {
    const { order, orderBy, setOrder, setOrderBy } = useContext(OrderContext);
    
    const handleClick = useCallback(() => {
        if(orderBy !== field) {
            setOrderBy(field);
            setOrder('asc');
            return;
        }
        setOrder(order === 'asc' ? 'desc' : 'asc');
    }, [ field, order, orderBy, setOrder, setOrderBy ]);

    return (
        <TableCell sortDirection={orderBy === field ? order : false} sx={{ paddingRight: 0, width, backgroundColor: '#0059B2' }}>
            <TableSortLabel
                active={orderBy === field}
                direction={orderBy === field ? order : 'asc'}
                onClick={handleClick}
                sx={{
                    WebkitTextFillColor: 'white',
                    whiteSpace: 'nowrap',
                    '& svg': {
                        color: 'white !important',
                    }
                }}
            >
                { children }
            </TableSortLabel>
        </TableCell>
    );
}

const stateMap = {
    'new': 'Neuf',
    'like-new': 'Comme neuf',
    'very-good': 'Très bon état',
    'good': 'Bon état',
    'acceptable': 'Acceptable',
    'bad': 'Mauvais état',
}

const BaseTableRow = ({ firstCellContent, item, onAddToBundle, onEdit, onDelete, statusFilter }) => {
    let salePrice = item.bundleItems?.reduce((sum, bi) => sum + (bi.salePrice ?? 0), 0) ?? item.salePrice;
    if(salePrice === 0 && !item.saleDate && !item.bundleItems?.some(bi => bi.saleDate)) salePrice = null;
    const realSalePrice = item.bundleItems?.reduce((sum, bi) => sum + (bi.saleDate ? (bi.salePrice ?? 0) : 0), 0) ?? (item.saleDate ? item.salePrice : undefined);
    const saleDate = !item.saleDate && item.bundleItems?.every(bi => bi.saleDate) ? item.bundleItems.reduce((max, bi) => !max || max < bi.saleDate ? bi.saleDate : max, null) : item.saleDate; 

    if((statusFilter === 'sold' && !saleDate && !item.bundleItems?.some(bi => bi.saleDate))
    || (statusFilter === 'on-sale' && !(typeof salePrice === 'number' && salePrice && !saleDate))
    || (statusFilter === 'to-sell' && ((item.type === 'Bundle' && item.bundleItems.every(bi => bi.salePrice)) || item.salePrice))) {
        return <></>
    }

    return (
        <TableRow sx={{ backgroundColor: item.saleDate ? '#E2F89C' : 'white' }}>
            <TableCell>{ firstCellContent }</TableCell>
            <TableCell sx={{ paddingLeft: item.bundleId !== 'none' ? '40px' : 0 }}>{ item.link ? <Link href={item.link} underline="none" target="_blank">{ item.name }</Link> : item.name}</TableCell>
            <TableCell>{ item.type === 'Bundle' ? 'Lot' : item.type }</TableCell>
            <TableCell>{ item.state && stateMap[item.state] }</TableCell>
            <TableCell>{ item.purchaseDate?.toLocaleDateString() }</TableCell>
            <TableCell>{ saleDate?.toLocaleDateString() }</TableCell>
            <TableCell>{ typeof item.purchasePrice === 'number' && item.purchasePrice.toFixed(2) + '€' }</TableCell>
            <TableCell>{ typeof salePrice === 'number' && salePrice.toFixed(2) + '€' }</TableCell>
            <TableCell>{ typeof item.purchasePrice === 'number' && typeof salePrice === 'number' && (salePrice - item.purchasePrice).toFixed(2) + '€' }</TableCell>
            <TableCell>{ typeof item.purchasePrice === 'number' && typeof realSalePrice === 'number' && (realSalePrice - item.purchasePrice).toFixed(2) + '€' }</TableCell>
            <TableCell>
                { item.type === 'Bundle' ? (
                    <IconButton color="primary" onClick={onAddToBundle}>
                        <Add/>
                    </IconButton>
                ) : (
                    <div style={{ display: 'inline-block', width: '40px' }}/>
                ) }
                <IconButton color="primary" onClick={onEdit}>
                    <Edit/>
                </IconButton>
                { !item.saleDate && (
                    <IconButton color="error" onClick={onDelete}>
                        <Delete/>
                    </IconButton>
                ) }
            </TableCell>
        </TableRow>
    )
};

const bundleMatchesFilters = (bundle, search, type, minDate, maxDate) => {
    const bundleCopy = { ...bundle, bundleItems: [] };
    return itemMatchesFilters(bundleCopy, search, type, minDate, maxDate);
}

const itemMatchesFilters = (item, search, type, minDate, maxDate) => {
    if(type && item.type !== type && !item.bundleItems?.some(bi => bi.type === type)) return false;
    if(!((item.purchaseDate >= minDate && item.purchaseDate <= maxDate) || (item.saleDate >= minDate && item.saleDate <= maxDate))) return false;
    const names = [ item.name.toLocaleLowerCase().normalize('NFD').replace(/[\W_\u0300-\u036f]/g, '') ];
    if(item.type === 'Bundle') names.push(...item.bundleItems.map(bi => bi.name.toLocaleLowerCase().normalize('NFD').replace(/[\W_\u0300-\u036f]/g, '')));
    const searchParts = search.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f-]/g, '').replace(/[\W]+/g, ' ').split(' ');
    return names.some(name => searchParts.every(part => name.includes(part)));
};

const EnhancedTableRow = ({ filter, statusFilter, typeFilter, minDate, maxDate, item, onAddToBundle, onEdit, onDelete }) => {
    const [ collapsed, setCollapsed ] = useState(false);

    if(item.type !== 'Bundle') return (
        <BaseTableRow
            item={item}
            onEdit={() => onEdit(item)}
            onDelete={() => onDelete(item)}
            statusFilter={statusFilter}
        />
    );

    const showFullBundle = bundleMatchesFilters(item, filter, typeFilter, minDate, maxDate);

    return (
        <>
            <BaseTableRow
                item={item}
                firstCellContent={
                    <IconButton onClick={() => setCollapsed(!collapsed)}>
                        { collapsed ? <ArrowRight/> : <ArrowDropDown/> }
                    </IconButton>
                }
                onAddToBundle={() => onAddToBundle(item)}
                onEdit={() => onEdit(item)}
                onDelete={() => onDelete(item)}
                statusFilter={statusFilter}
            />
            { !collapsed && (showFullBundle ? item.bundleItems : item.bundleItems.filter(bundleItem => itemMatchesFilters(bundleItem, filter, typeFilter, minDate, maxDate))).map((bundleItem, index) => (
                <BaseTableRow
                    key={index}
                    item={bundleItem}
                    onEdit={() => onEdit(bundleItem)}
                    onDelete={() => onDelete(bundleItem)}
                    statusFilter={statusFilter}
                />
            )) }
        </>
    );
}

const potentialProfitComparer = (a, b) => {
    const aSalePrice = a.bundleItems?.reduce((sum, bi) => sum + (bi.salePrice ?? 0), 0) ?? a.salePrice ?? Number.MIN_SAFE_INTEGER;
    const bSalePrice = b.bundleItems?.reduce((sum, bi) => sum + (bi.salePrice ?? 0), 0) ?? b.salePrice ?? Number.MIN_SAFE_INTEGER;
    return (aSalePrice - (a.purchasePrice ?? 0)) - (bSalePrice - (b.purchasePrice ?? 0));
}

const sortByColumn = (items, column, reverse) => {
    var sortedItems;
    switch(column) {
        case 'name':
        case 'type':
            sortedItems = items.sort((a, b) => a[column].localeCompare(b[column]));
            break;
        case 'state':
            const states = [ 'new', 'like-new', 'very-good', 'good', 'acceptable', 'bad' ];
            sortedItems = items.sort((a, b) => states.indexOf(a.state) - states.indexOf(b.state));
            break;
        case 'purchaseDate':
        case 'purchasePrice':
            sortedItems = items.sort((a, b) => a[column] - b[column]);
            break;
        case 'saleDate':
            sortedItems = items.sort((a, b) => {
                const aSaleDate = !a.saleDate && a.bundleItems?.every(bi => bi.saleDate) ? a.bundleItems.reduce((max, bi) => max < bi.saleDate ? bi.saleDate : max, 0) : a.saleDate;
                const bSaleDate = !b.saleDate && b.bundleItems?.every(bi => bi.saleDate) ? b.bundleItems.reduce((max, bi) => max < bi.saleDate ? bi.saleDate : max, 0) : b.saleDate;
                return (aSaleDate ?? null) - (bSaleDate ?? null);
            });
            break;
        case 'salePrice':
            sortedItems = items.sort((a, b) => {
                const aSalePrice = a.bundleItems?.reduce((sum, bi) => sum + (bi.salePrice ?? 0), 0) ?? a.salePrice;
                const bSalePrice = b.bundleItems?.reduce((sum, bi) => sum + (bi.salePrice ?? 0), 0) ?? b.salePrice;
                return (aSalePrice ?? Number.MIN_SAFE_INTEGER) - (bSalePrice ?? Number.MIN_SAFE_INTEGER);
            });
            break;
        case 'potentialProfit':
            sortedItems = items.sort(potentialProfitComparer);
            break;
        case 'profit':
            sortedItems = items.sort((a, b) => {
                if(!a.saleDate && !b.saleDate) return potentialProfitComparer(a, b);
                const aRealSalePrice = a.bundleItems?.reduce((sum, bi) => sum + (bi.saleDate ? (bi.salePrice ?? 0) : 0), 0) ?? (a.saleDate ? a.salePrice : Number.MIN_SAFE_INTEGER);
                const bRealSalePrice = b.bundleItems?.reduce((sum, bi) => sum + (bi.saleDate ? (bi.salePrice ?? 0) : 0), 0) ?? (b.saleDate ? b.salePrice : Number.MIN_SAFE_INTEGER);
                return (aRealSalePrice - (a.purchasePrice ?? 0)) - (bRealSalePrice - (b.purchasePrice ?? 0));
            });
            break;
        default:
            throw new Error(`Nom de colonne inconnu: ${column}`);
    }

    return reverse ? sortedItems.reverse() : sortedItems;
}

// FIXME: bundle titles appear when they contain an item that matches the search even though the item is filtered out
// FIXME: bundle item data should be saved if it has been changed while navigating through the bundle items in the add bundle dialog

const ItemsTable = ({
    filter = '',
    typeFilter,
    statusFilter,
    minDate,
    maxDate,
}) => {
    const [ dialogState, setDialogState] = useState({ open: null });
    const { order, orderBy: orderByColumn } = useContext(OrderContext);
    const [ screenWidth, setScreenWidth ] = useState(window.innerWidth);

    const mapItem = useCallback(async (item) => {
        item = await item;
        const data = item.data();
        const mapped = {
            ...data,
            purchaseDate: data.purchaseDate?.toDate(),
            saleDate: data.saleDate?.toDate(),
            id: item.id,
            ref: item.ref,
        };
        if(data.bundleItems) {
            mapped.bundleItems = await Promise.all(data.bundleItems.map(ref => mapItem(getDoc(ref))));
        }
        return mapped;
    }, []);

    const mapSnapshot = useCallback(async (snapshot) => {
        const items = (await Promise.all(snapshot.docs.map(async (item) => {
            const mapped = await mapItem(item);
            if(mapped.bundleItems) mapped.bundleItems = sortByColumn(mapped.bundleItems, orderByColumn, order !== 'asc');
            return mapped;
        }))).filter(item => itemMatchesFilters(item, filter, typeFilter, minDate, maxDate));
        return sortByColumn(items, orderByColumn, order !== 'asc');
    }, [ filter, order, orderByColumn, typeFilter, minDate, maxDate, mapItem ]);

    const items = useSnapshot(
        query(collection(db, 'items'), where('userId', '==', auth.currentUser.uid), orderBy('purchasePrice')),
        mapSnapshot,
        []
    );

    const handleAdd = useCallback(() => {
        setDialogState({
            open: 'add',
        });
    }, []);

    const handleAddBundle = useCallback(() => {
        setDialogState({
            open: 'add-bundle',
        });
    }, []);

    const handleAddToBundle = useCallback(item => {
        setDialogState({
            open: 'add',
            bundleRef: item.ref,
        });
    }, []);

    const handleEdit = useCallback(item => {
        setDialogState({
            open: 'edit',
            item,
        });
    }, []);

    const handleDelete = useCallback(item => {
        setDialogState({
            open: 'delete',
            item,
        });
    }, []);

    useEffect(() => {
        const updateWidth = () => {
            if(window.innerWidth !== screenWidth) setScreenWidth(window.innerWidth);
        };

        window.addEventListener('resize', updateWidth);

        return () => window.removeEventListener('resize', updateWidth);
    }, [ screenWidth ]);
console.log(dialogState)
    return (
        <>
            <TableContainer component={Paper} sx={{
                maxHeight: 'calc(100vh - 152px)',
                overflow: 'overlay',
                color: 'rgba(0, 0, 0, 0)',
                WebkitTextFillColor: 'black',
                transition: '300ms ease-in-out color',
                '&::-webkit-scrollbar': {
                    width: '10px',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundClip: 'padding-box',
                    border: '0px solid transparent',
                    borderTopWidth: '56px',
                    boxShadow: 'inset 0 0 0 10px',
                    minHeight: '140px'
                },
                '&:hover': {
                    color: 'rgba(0, 0, 0, 0.3)',
                }
            }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: 30, padding: 0, backgroundColor: '#0059B2' }}/>
                            <SortableTableCell field="name" width={`${window.innerWidth * 0.2}px`}>
                                Nom de l'article
                            </SortableTableCell>
                            <SortableTableCell field="type" width={100}>
                                Type
                            </SortableTableCell>
                            <SortableTableCell field="state" width={110}>
                                État
                            </SortableTableCell>
                            <SortableTableCell field="purchaseDate">
                                Date d'achat
                            </SortableTableCell>
                            <SortableTableCell field="saleDate">
                                Date de vente
                            </SortableTableCell>
                            <SortableTableCell field="purchasePrice">
                                Prix d'achat
                            </SortableTableCell>
                            <SortableTableCell field="salePrice">
                                Prix de vente
                            </SortableTableCell>
                            <SortableTableCell field="potentialProfit">
                                Bénéfice potentiel
                            </SortableTableCell>
                            <SortableTableCell field="profit">
                                Bénéfice
                            </SortableTableCell>
                            <TableCell sx={{ width: 155, minWidth: 155, padding: 0, paddingRight: '10px', backgroundColor: '#0059B2' }}/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { items?.map(item => (
                            <EnhancedTableRow
                                key={item.id}
                                item={item}
                                filter={filter}
                                typeFilter={typeFilter}
                                statusFilter={statusFilter}
                                minDate={minDate}
                                maxDate={maxDate}
                                onAddToBundle={handleAddToBundle}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        )) }
                    </TableBody>
                </Table>
            </TableContainer>
            {/* TODO: make color match table header color */}
            <SpeedDial
                ariaLabel="Ajouter un/des articles"
                sx={{ position: 'absolute', bottom: 40, right: 40 }}
                icon={<SpeedDialIcon/>}
            >
                <SpeedDialAction
                    icon={<Add/>}
                    tooltipTitle="Ajouter un article"
                    tooltipOpen
                    onClick={handleAdd}
                    sx={{
                        '& span': {
                            width: 'max-content',
                        },
                    }}
                />
                <SpeedDialAction
                    icon={<AddCircleOutline/>}
                    tooltipTitle="Ajouter un lot"
                    tooltipOpen
                    onClick={handleAddBundle}
                    sx={{
                        '& span': {
                            width: 'max-content',
                        },
                    }}
                />
            </SpeedDial>
            <TypesProvider>
                <AddItemDialog
                    onCancel={() => setDialogState({ ...dialogState, open: null })}
                    onDone={async (newItem) => {
                        await runTransaction(db, async (tx) => {
                            const toAdd = { ...newItem, userId: auth.currentUser.uid, bundle: dialogState.bundleRef };
                            const itemRef = doc(collection(db, 'items'));
                            if(dialogState.bundleRef) {
                                const bundle = (await tx.get(dialogState.bundleRef)).data();
                                tx.update(dialogState.bundleRef, {
                                    bundleItems: [ ...bundle.bundleItems, itemRef ],
                                    name: `Lot de ${bundle.bundleItems.length + 1} articles`,
                                });
                                toAdd.purchaseDate = bundle.purchaseDate;
                            }
                            tx.set(itemRef, toAdd);
                        });
                        setDialogState({ open: null });
                    }}
                    open={dialogState.open === 'add'}
                    partOfBundle={!!dialogState.bundleRef}
                />
                <AddBundleDialog
                    onCancel={() => setDialogState({ ...dialogState, open: null })}
                    onDone={async (newItems) => {
                        await runTransaction(db, async (tx) => {
                            const bundleRef = doc(collection(db, 'items'));
                            // The first item in the array is the bundle
                            const bundleToAdd = { ...newItems[0], type: 'Bundle', name: `Lot de ${newItems.length - 1} articles`, userId: auth.currentUser.uid };
                            const bundleItems = [];
                            for(let toAdd of newItems.splice(1)) {
                                const itemRef = doc(collection(db, 'items'));
                                bundleItems.push(itemRef);
                                tx.set(itemRef, { ...toAdd, purchaseDate: bundleToAdd.purchaseDate, userId: auth.currentUser.uid, bundle: bundleRef });
                            }
                            tx.set(bundleRef, { ...bundleToAdd, bundleItems: bundleItems });
                        });
                        setDialogState({ open: null });
                    }}
                    open={dialogState.open === 'add-bundle'}
                />
                <DeleteItemConfirmationDialog
                    onCancel={() => setDialogState({ open: null })}
                    onDone={async (deletedItem) => {
                        await runTransaction(db, async (tx) => {
                            if(deletedItem.type === 'Bundle') {
                                tx.delete(deletedItem.ref);
                                deletedItem.bundleItems.forEach(item => tx.delete(item.ref));
                            } else {
                                if(deletedItem.bundle) {
                                    const bundle = (await tx.get(deletedItem.bundle)).data();
                                    tx.update(deletedItem.bundle, {
                                        bundleItems: bundle.bundleItems.filter(ref => ref.id !== deletedItem.id),
                                        name: `Lot de ${bundle.bundleItems.length - 1} articles`
                                    })
                                }
                                tx.delete(deletedItem.ref);
                                console.log('fni');
                            }
                        });
                        setDialogState({ open: null });
                    }}
                    item={dialogState.item}
                    open={dialogState.open === 'delete'}
                />
                <EditItemDialog
                    onCancel={() => setDialogState({ open: null })}
                    onDone={async (updatedItem) => {
                        await runTransaction(db, async (tx) => {
                            if(updatedItem.type === 'Bundle') {
                                dialogState.item.bundleItems.forEach(item => tx.update(item.ref, { purchaseDate: updatedItem.purchaseDate }));
                            } else if(dialogState.item.bundle) {
                                // This property will never be used, this is just a hack for the snapshot observer to get triggered since
                                // it doesn't observe bundle items.
                                tx.update(dialogState.item.bundle, { bundleItemsLastUpdate: new Date() })
                            }
                            tx.update(dialogState.item.ref, updatedItem);
                        });
                        setDialogState({ item: dialogState.item, open: null });
                    }}
                    item={(({ bundle, id, ref, bundleItems, ...editableItem }) => editableItem)(dialogState.item ?? {})}
                    open={dialogState.open === 'edit'}
                    partOfBundle={!!dialogState.item?.bundle}
                />
            </TypesProvider>
        </>
    );
}

export default ItemsTable;