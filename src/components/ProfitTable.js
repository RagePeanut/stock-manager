import { useState, useCallback, useEffect } from 'react';
import { Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Select, MenuItem} from '@mui/material';
import useSnapshot from '../hooks/useSnapshot';
import { query, collection, where } from 'firebase/firestore';
import { auth, db } from '../firebase';

const ProfitTable = ({ minYear }) => {
    const [ year, setYear ] = useState(new Date().getFullYear());
    const [ month, setMonth ] = useState(new Date().getMonth());

    const mapSnapshot = useCallback(async (snapshot) => {
        const items = snapshot.docs.map(item => {
            const data = item.data();
            return {
                ...data,
                purchaseDate: data.purchaseDate?.toDate(),
                saleDate: data.saleDate?.toDate(),
            };
        });
        return items.reduce((totals, item) => {
            const boughtForMe = item.name.includes('POUR MOI');
            
            totals = {
                yearTotalSpent: year === 'all' || item.purchaseDate?.getFullYear() === year ? totals.yearTotalSpent + (item.purchasePrice ?? 0) : totals.yearTotalSpent,
                yearTotalSold: (year === 'all' || item.saleDate?.getFullYear() === year) && !boughtForMe ? totals.yearTotalSold + ((item.saleDate ? item.salePrice : 0) ?? 0) : totals.yearTotalSold,
                monthTotalSpent: item.purchaseDate?.getFullYear() === year && item.purchaseDate.getMonth() === month ? totals.monthTotalSpent + (item.purchasePrice ?? 0) : totals.monthTotalSpent,
                monthTotalSold: item.saleDate?.getFullYear() === year && item.saleDate.getMonth() === month && !boughtForMe ? totals.monthTotalSold + (item.salePrice ?? 0) : totals.monthTotalSold,
            };

            // For items I kept from bundles, we need to remove their sale price from the bundle's purchase price
            if(boughtForMe) {
                if(year === 'all' || item.purchaseDate?.getFullYear() === year) {
                    totals.yearTotalSpent -= item.salePrice ?? 0;
                    if(item.purchaseDate?.getMonth() === month) totals.monthTotalSpent -= item.salePrice ?? 0;
                }
            }

            return {
                ...totals,
                yearProfit: totals.yearTotalSold - totals.yearTotalSpent,
                monthProfit: totals.monthTotalSold - totals.monthTotalSpent,
            }
        }, { yearTotalSpent: 0, yearTotalSold: 0, yearProfit: 0, monthTotalSpent: 0, monthTotalSold: 0, monthProfit: 0 });
    }, [ year, month ]);

    const totals = useSnapshot(
        query(collection(db, 'items'), where('userId', '==', auth.currentUser.uid)),
        mapSnapshot,
        null
    );

    const getYearOptions = useCallback(() => {
        const options = [];
        for(let value = minYear; value <= new Date().getFullYear(); value++) {
            options.push(
                <MenuItem
                    key={value}
                    value={value}
                    sx={{ display: 'flex', justifyContent: 'center' }}
                >
                    {value}
                </MenuItem>
            );
        }
        return options;
    }, [ minYear ]);

    useEffect(() => {
        if(minYear > year) setYear(minYear);
    }, [ year, minYear ]);

    return (
        <>
            <h2 style={{ fontSize: 20, fontFamily: '"Roboto","Helvetica","Arial",sans-serif', margin: 0, marginBottom: '-4px', marginTop: '14px' }}>
                Résultats pour { year !== 'all' && 'l\'année ' }
                <Select
                    value={year < minYear ? minYear : year}
                    onChange={event => setYear(event.target.value)}
                    sx={{
                        fontWeight: 'bold',
                        fontSize: 20,
                        '& *': {
                            border: '0 !important',
                        },
                        position: 'relative',
                        left: -12,
                    }}
                >
                    <MenuItem value="all"><i>Toutes les années</i></MenuItem>
                    { getYearOptions() }
                </Select>
            </h2>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#0059B2' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', paddingRight: 0, width: 70 }}>
                                Total des dépenses
                            </TableCell>
                            <TableCell sx={{ color: 'white', paddingRight: 0, width: 70 }}>
                                Total des ventes
                            </TableCell>
                            <TableCell sx={{ color: 'white', paddingRight: 0, width: 70 }}>
                                Bénéfice total
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell sx={{ height: '40px' }}>
                                { (totals?.yearTotalSpent ?? 0).toFixed(2) }€
                            </TableCell>
                            <TableCell>
                                { (totals?.yearTotalSold ?? 0).toFixed(2) }€
                            </TableCell>
                            <TableCell>
                                { (totals?.yearProfit ?? 0).toFixed(2) }€
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <h2 style={{ fontSize: 20, fontFamily: '"Roboto","Helvetica","Arial",sans-serif', margin: 0, marginBottom: '-4px', marginTop: '14px' }}>
                Résultats pour le mois { [3, 7, 9].includes(month) ? 'd\' ' : 'de ' }
                <Select
                    value={month}
                    onChange={event => setMonth(event.target.value)}
                    sx={{
                        fontWeight: 'bold',
                        fontSize: 20,
                        '& *': {
                            border: '0 !important',
                        },
                        position: 'relative',
                        left: -12,
                        top: 1,
                    }}
                >
                    <MenuItem value={0}>Janvier</MenuItem>
                    <MenuItem value={1}>Février</MenuItem>
                    <MenuItem value={2}>Mars</MenuItem>
                    <MenuItem value={3}>Avril</MenuItem>
                    <MenuItem value={4}>Mai</MenuItem>
                    <MenuItem value={5}>Juin</MenuItem>
                    <MenuItem value={6}>Juillet</MenuItem>
                    <MenuItem value={7}>Août</MenuItem>
                    <MenuItem value={8}>Septembre</MenuItem>
                    <MenuItem value={9}>Octobre</MenuItem>
                    <MenuItem value={10}>Novembre</MenuItem>
                    <MenuItem value={11}>Décembre</MenuItem>
                </Select>
            </h2>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#0059B2' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', paddingRight: 0, width: 70 }}>
                                Total des dépenses
                            </TableCell>
                            <TableCell sx={{ color: 'white', paddingRight: 0, width: 70 }}>
                                Total des ventes
                            </TableCell>
                            <TableCell sx={{ color: 'white', paddingRight: 0, width: 70 }}>
                                Bénéfice total
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell sx={{ height: '40px' }}>
                                { (totals?.monthTotalSpent ?? 0).toFixed(2) }€
                            </TableCell>
                            <TableCell>
                                { (totals?.monthTotalSold ?? 0).toFixed(2) }€
                            </TableCell>
                            <TableCell>
                                { (totals?.monthProfit ?? 0).toFixed(2) }€
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default ProfitTable;