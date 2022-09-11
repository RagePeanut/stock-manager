import React from 'react';
import { Controller } from 'react-hook-form';
import { TextField, InputAdornment } from '@mui/material';

import { NumericFormat } from 'react-number-format';

const PriceFormat = React.forwardRef(({ inputRef, onChange, ...props }, ref) => {
    return (
        <NumericFormat
            {...props}
            getInputRef={ref}
            onValueChange={({ floatValue }) => onChange(floatValue)}
            thousandSeparator={' '}
            allowedDecimalSeparators={['.', ',']}
            decimalScale={2}
            isNumericString
            isAllowed={({ value, floatValue }) => value === '' || floatValue >= 0}
        />
    );
});

const PriceField = ({
    control,
    label,
    name,
    sx,
}) => {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value }, formState: { errors } }) => (
                <TextField
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                €
                            </InputAdornment>
                        ),
                        inputComponent: PriceFormat,
                    }}
                    name={name}
                    label={label}
                    value={value ?? ''}
                    onChange={value => {
                        onChange(isNaN(value) ? null : value);
                    }}
                    error={!!errors[name]}
                    sx={sx}
                />
            )}
        />
    );
}

export default PriceField;