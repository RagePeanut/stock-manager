import { useState, useEffect, useTransition, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormControl, InputLabel, TextField, MenuItem, Select, InputAdornment } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Search } from '@mui/icons-material';
import { query, collection, where, orderBy, limit } from 'firebase/firestore';

import ItemsTable from '../components/ItemsTable';
import ProfitTable from '../components/ProfitTable';
import TypeSelect from '../components/inputs/TypeSelect';
import TypesProvider from '../contexts/TypesContext';
import OrderProvider from '../contexts/OrderContext';
import { auth, db } from '../firebase';
import useSnapshot from '../hooks/useSnapshot';

const Home = () => {
    const [ , startTransition ] = useTransition();
    const [ search, setSearch ] = useState('');
    const [ typeFilter, setTypeFilter ] = useState('');
    const [ statusFilter, setStatusFilter ] = useState('');
    const [ minDate, setMinDate ] = useState(null);
    const [ maxDate, setMaxDate ] = useState(new Date().withoutTime());
    const navigate = useNavigate();

    const mapSnapshot = useCallback(snapshot => {
        if(snapshot.empty) {
            return new Date().withoutTime();
        }
        return snapshot.docs[0].data().purchaseDate.toDate();
    }, []);

    const earliestDate = useSnapshot(
        query(collection(db, 'items'), where('userId', '==', auth.currentUser.uid), orderBy('purchaseDate'), limit(1)),
        mapSnapshot,
        new Date().withoutTime()
    );

    useEffect(() => {
        if(!auth.currentUser) navigate('/');
    }, [ navigate ]);

    //TODO: ajouter filtre d'état

    return (
        <div style={{ display: 'flex', boxSizing: 'border-box', width: '100%' }}>
            <div style={{ flex: 3 }}>
                <div style={{ marginBottom: '16px', display: 'flex' }}>
                    <TextField
                        placeholder="Rechercher un article..."
                        onChange={event => startTransition(() => setSearch(event.target.value))}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search/>
                                </InputAdornment>
                            )
                        }}
                        sx={{ marginRight: '16px', flex: 1 }}
                    />
                    <TypesProvider>
                        <TypeSelect
                            sx={{ minWidth: 120, marginRight: '16px' }}
                            value={typeFilter}
                            onChange={setTypeFilter}
                        />
                    </TypesProvider>
                    <FormControl sx={{ minWidth: 120, marginRight: '16px' }}>
                        <InputLabel>
                            Statut
                        </InputLabel>
                        <Select
                            label="Statut"
                            value={statusFilter}
                            onChange={event => setStatusFilter(event.target.value)}
                        >
                            <MenuItem value=""><em>Retirer le filtre</em></MenuItem>
                            <MenuItem value="sold">Vendu</MenuItem>
                            <MenuItem value="on-sale">En vente</MenuItem>
                            <MenuItem value="to-sell">À vendre</MenuItem>
                        </Select>
                    </FormControl>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DesktopDatePicker
                            label="Afficher du"
                            inputFormat="dd/MM/yyyy"
                            onChange={date => setMinDate(isFinite(date) ? date : null)}
                            value={minDate ?? earliestDate ?? null}
                            renderInput={props => <TextField
                                {...props}
                                sx={{ marginRight: '16px' }}
                            />}
                            minDate={earliestDate}
                            maxDate={maxDate}
                            allowSameDateSelection
                        />
                        <DesktopDatePicker
                            label="au"
                            inputFormat="dd/MM/yyyy"
                            onChange={date => setMaxDate(isFinite(date) ? date : new Date().withoutTime())}
                            value={maxDate}
                            renderInput={props => <TextField
                                {...props}
                            />}
                            minDate={minDate ?? earliestDate ?? null}
                            maxDate={new Date().withoutTime()}
                            allowSameDateSelection
                        />
                    </LocalizationProvider>
                </div>
                <OrderProvider defaultOrder="desc" defaultOrderBy="purchaseDate">
                    <ItemsTable
                        filter={search}
                        typeFilter={typeFilter}
                        statusFilter={statusFilter}
                        minDate={minDate ?? earliestDate ?? null}
                        maxDate={maxDate}
                    />
                </OrderProvider>
            </div>
            <div style={{ flex: 1, marginLeft: '32px' }}>
                <ProfitTable minYear={earliestDate?.getFullYear()}/>
            </div>
        </div>
    );
}

export default Home;
