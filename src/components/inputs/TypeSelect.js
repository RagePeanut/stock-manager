import { useContext } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

import { TypesContext } from '../../contexts/TypesContext';

const TypeSelect = ({ sx, value, onChange }) => {
    const { types } = useContext(TypesContext);

    return (
        <FormControl sx={sx}>
            <InputLabel>
                Type
            </InputLabel>
            <Select
                label="Type"
                value={value}
                onChange={event => onChange(event.target.value)
            }>
                <MenuItem value=""><em>Retirer le filtre</em></MenuItem>
                { types.map(type => (
                    <MenuItem key={type} value={type}>{ type }</MenuItem>
                )) }
            </Select>
        </FormControl>
    );
}

export default TypeSelect;