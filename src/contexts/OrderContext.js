import { createContext, useState } from 'react';

export const OrderContext = createContext();

const OrderProvider = ({ children, defaultOrder, defaultOrderBy }) => {
    const [ order, setOrder ] = useState(defaultOrder);
    const [ orderBy, setOrderBy ] = useState(defaultOrderBy);

    return (
        <OrderContext.Provider value={{
            order,
            orderBy,
            setOrder,
            setOrderBy,
        }}>
            { children }
        </OrderContext.Provider>
    );
}

export default OrderProvider;