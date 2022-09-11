import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { useEffect, useContext } from 'react';

import useYupResolver from '../../hooks/useYupResolver';
import PriceField from '../PriceField';
import { TypesContext } from '../../contexts/TypesContext';

const schema = yup.object({
    name: yup.string().required(),
    type: yup.string().required(),
    state: yup.string().transform(value => value ? value : null).nullable(),
    purchaseDate: yup.date().required(),
    saleDate: yup.date().nullable(),
    purchasePrice: yup.number().required(),
    salePrice: yup.number().transform((currentValue, originalValue) => {
        return originalValue === '' ? null : currentValue ?? null;
    }).nullable(),
    link: yup.string().nullable(),
});

const bundleItemSchema = yup.object({
    name: yup.string().required(),
    type: yup.string().required(),
    state: yup.string().transform(value => value ? value : null).nullable(),
    saleDate: yup.date().nullable(),
    salePrice: yup.number().transform((currentValue, originalValue) => {
        return originalValue === '' ? null : currentValue ?? null;
    }).nullable(),
    link: yup.string().nullable(),
});

const AddItemDialog = ({ open, partOfBundle, onCancel, onDone }) => {
    const resolver = useYupResolver(partOfBundle ? bundleItemSchema : schema);
    const { register, handleSubmit, reset, formState: { errors }, control, setValue, watch } = useForm({ resolver });
    const { types } = useContext(TypesContext);

    const purchaseDate = watch('purchaseDate');
    const saleDate = watch('saleDate');

    useEffect(() => {
        reset();
    }, [ open, reset ]);

    return (
        <Dialog open={open} onClose={onCancel} fullWidth>
            <DialogTitle>Ajouter un article</DialogTitle>
            <DialogContent>
                <TextField
                    label="Nom de l'article"
                    autoFocus
                    {...register('name')}
                    error={!!errors.name}
                    fullWidth
                    sx={{
                        flex: 1,
                        marginTop: '8px',
                        marginBottom: '16px'
                    }}
                />
                <div style={{ display: 'flex', marginBottom: '16px' }}>
                    <FormControl
                        error={!!errors.type}
                        sx={{ flex: 1, marginRight: '8px' }}
                    >
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
                    { !partOfBundle && (
                        <div style={{ display: 'flex', marginBottom: '16px' }}>
                            <Controller
                                control={control}
                                name="purchaseDate"
                                render={({ field: { value } }) => (
                                    <DesktopDatePicker
                                        label="Date d'achat"
                                        inputFormat="dd/MM/yyyy"
                                        onChange={date => setValue('purchaseDate', isFinite(date) ? date?.withoutTime() : null)}
                                        value={value ?? null}
                                        maxDate={saleDate ?? new Date().withoutTime()}
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
                    ) }
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
                <Button onClick={onCancel}>Annuler</Button>
                <Button onClick={handleSubmit(onDone)}>Confirmer</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddItemDialog;