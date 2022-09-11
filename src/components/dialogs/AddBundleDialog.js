import { useCallback, useEffect, useState, useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';

import useYupResolver from '../../hooks/useYupResolver';
import PriceField from '../PriceField';
import { TypesContext } from '../../contexts/TypesContext';

const schema = yup.object({
    purchaseDate: yup.date().required(),
    purchasePrice: yup.number().required(),
});

const itemSchema = yup.object({
    name: yup.string().required(),
    type: yup.string().required(),
    state: yup.string().transform(value => value ? value : null).nullable(),
    saleDate: yup.date().nullable(),
    salePrice: yup.number().transform((currentValue, originalValue) => {
        return originalValue === '' ? null : currentValue ?? null;
    }).nullable(),
    link: yup.string().nullable(),
});

const BundleFormContent = ({ item, canSubmit, isLastItem, onCancel, onContinue, onDone }) => {
    const resolver = useYupResolver(schema);
    const { handleSubmit, formState: { errors }, control, setValue } = useForm({
        defaultValues: item ?? {},
        resolver,
    });

    return (
        <>
            <DialogContent sx={{ paddingTop: 0 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <div style={{ display: 'flex', marginTop: '8px' }}>
                        <Controller
                            control={control}
                            name="purchaseDate"
                            render={({ field: { value } }) => (
                                <DesktopDatePicker
                                    label="Date d'achat"
                                    inputFormat="dd/MM/yyyy"
                                    onChange={date => setValue('purchaseDate', isFinite(date) ? date?.withoutTime() : null)}
                                    value={value ?? null}
                                    maxDate={new Date().withoutTime()}
                                    allowSameDateSelection
                                    renderInput={props => <TextField
                                        {...props}
                                        error={!!errors.purchaseDate}
                                        sx={{ flex: 1, marginRight: '8px' }}
                                    />}
                                />
                            )}
                        />
                        <PriceField
                            control={control}
                            label="Prix d'achat"
                            name="purchasePrice"
                            sx={{ flex: 1, marginLeft: '8px' }}
                        />
                    </div>
                </LocalizationProvider>
            </DialogContent>
            <DialogActions>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div>
                        { !!errors && canSubmit && <Button onClick={handleSubmit(onDone)}>Soumettre</Button> }
                    </div>
                    <div>
                        <Button onClick={onCancel}>Annuler</Button>
                        { isLastItem && <Button onClick={handleSubmit(onContinue)}>Continuer</Button> }
                    </div>
                </div>
            </DialogActions>
        </>
    );
}

const ItemFormContent = ({ item, canSubmit, isLastItem, purchaseDate, onCancel, onContinue, onDelete, onDone }) => {
    const resolver = useYupResolver(itemSchema);
    const { handleSubmit, formState: { errors }, control, setValue, register } = useForm({
        defaultValues: item ?? {},
        resolver,
    });
    const { types } = useContext(TypesContext);

    return (
        <>
            <DialogContent sx={{ paddingTop: 0 }}>
                <Controller
                    control={control}
                    name="name"
                    render={({ field: { value } }) => (
                        <TextField
                            value={value ?? ''}
                            onChange={event => setValue('name', event.target.value)}
                            label="Nom de l'article"
                            autoFocus
                            error={!!errors.name}
                            fullWidth
                            sx={{ marginTop: '8px', marginBottom: '16px' }}
                        />
                    )}
                />
                <div style={{ display: 'flex', marginBottom: '16px' }}>
                    <FormControl
                        error={!!errors.type}
                        sx={{ flex: 1, marginRight: '16px' }}>
                        <InputLabel>
                            Type
                        </InputLabel>
                        <Controller
                            control={control}
                            name="type"
                            render={({ field: { value } }) => (
                                <Select
                                    value={value ?? ''}
                                    onChange={event => setValue('type', event.target.value)}
                                    error={!!errors.type}
                                    label="Type"
                                >
                                    { types.map(type => (
                                        <MenuItem value={type} key={type}>{ type }</MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                    </FormControl>
                    <FormControl
                        error={!!errors.state}
                        sx={{ flex: 1, marginLeft: '8px' }}
                    >
                        <InputLabel>
                            État
                        </InputLabel>
                        <Controller
                            control={control}
                            name="state"
                            render={({ field: { value } }) => (
                                <Select
                                    value={value ?? ''}
                                    onChange={event => setValue('state', event.target.value)}
                                    error={!!errors.state}
                                    label="Format"
                                >
                                    <MenuItem value=""><i>Non défini</i></MenuItem>
                                    <MenuItem value="new">Neuf</MenuItem>
                                    <MenuItem value="like-new">Comme neuf</MenuItem>
                                    <MenuItem value="very-good">Très bon état</MenuItem>
                                    <MenuItem value="good">Bon état</MenuItem>
                                    <MenuItem value="acceptable">Acceptable</MenuItem>
                                    <MenuItem value="bad">Mauvais état</MenuItem>
                                </Select>
                            )}
                        />
                    </FormControl>
                </div>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <div style={{ display: 'flex', marginBottom: '16px' }}>
                        <Controller
                            control={control}
                            name="saleDate"
                            render={({ field: { value } }) => (
                                <DesktopDatePicker
                                    label="Date de vente"
                                    inputFormat="dd/MM/yyyy"
                                    onChange={date => setValue('saleDate', isFinite(date) ? date?.withoutTime() : null)}
                                    value={value ?? null}
                                    minDate={purchaseDate}
                                    maxDate={new Date().withoutTime()}
                                    allowSameDateSelection
                                    renderInput={props => <TextField
                                        {...props}
                                        error={!!errors.saleDate}
                                        sx={{ flex: 1, marginRight: '8px' }}
                                    />}
                                />
                            )}
                        />
                        <PriceField
                            control={control}
                            label="Prix de vente"
                            name="salePrice"
                            sx={{ flex: 1, marginLeft: '8px' }}
                        />
                    </div>
                </LocalizationProvider>
                <TextField
                    label="Lien vers l'article"
                    type="string"
                    {...register('link')}
                    error={!!errors.link}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div>
                        { !!errors && canSubmit && <Button onClick={handleSubmit(onDone)}>Soumettre</Button> }
                    </div>
                    <div>
                        <Button onClick={onCancel}>Annuler</Button>
                        { isLastItem && <Button onClick={onDelete}>Supprimer</Button> }
                        { isLastItem && <Button onClick={handleSubmit(onContinue)}>Continuer</Button> }
                    </div>
                </div>
            </DialogActions>
        </>
    );
}

const AddBundleDialog = ({ open, onCancel, onDone }) => {
    const [ items, setItems ] = useState([]);
    const [ index, setIndex ] = useState(0);

    const handleCancel = useCallback(() => {
        setItems([]);
        setIndex(0);
        onCancel();
    }, [ onCancel ]);

    const handleDelete = useCallback(() => {
        items.splice(index, 1);
        setItems(items);
        if(items.length === index) setIndex(index - 1);
    }, [ items, index ]);

    const handlePrevious = useCallback(() => {
        setIndex(index - 1);
    }, [ index ]);
    
    const handleNext = useCallback(() => {
        setIndex(index + 1);
    }, [ index ]);

    const handleContinue = useCallback(item => {
        items[index] = item;
        setItems(items);
        setIndex(index + 1);
    }, [ items, index ]);

    const handleDone = useCallback(item => {
        items[index] = item;
        onDone(items);
    }, [ items, index, onDone ]);

    useEffect(() => {
        setItems([]);
        setIndex(0);
    }, [ open ]);

    return (
        <Dialog open={open} onClose={handleCancel} fullWidth>
            <DialogTitle sx={{ position: 'relative', paddingBottom: '8px' }}>
                Ajouter un lot
                <div style={{ position: 'absolute', top: 16, right: 24 }}>
                    <IconButton size="small" onClick={handlePrevious} disabled={index === 0} sx={{ height: '34px', width: '34px' }}>
                        { index > 0 && <ArrowBackIosNew/> }
                    </IconButton>
                    <IconButton size="small" onClick={handleNext} disabled={index >= items.length - 1} sx={{ height: '34px', width: '34px' }}>
                        { index < items.length - 1 && <ArrowForwardIos/> }
                    </IconButton>
                </div>
            </DialogTitle>
            { index === 0 && (
                <BundleFormContent
                    item={items[index]}
                    canSubmit={items.length >= 3}
                    isLastItem={index >= items.length - 1}
                    onCancel={handleCancel}
                    onContinue={handleContinue}
                />
            )}
            { items.map((_, i) => (
                <div key={i}>
                    { index === i + 1 && (
                        <ItemFormContent
                            item={items[index]}
                            canSubmit={items.length >= 3 || index === 2}
                            isLastItem={index >= items.length - 1}
                            onCancel={handleCancel}
                            onDelete={handleDelete}
                            onContinue={handleContinue}
                            onDone={handleDone}
                            purchaseDate={items[0].purchaseDate}
                        />
                    )}
                </div>
            ))}
        </Dialog>
    );
}

export default AddBundleDialog;