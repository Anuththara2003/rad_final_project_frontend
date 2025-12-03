import api from './api';

export const placeOrder = async (orderData: any) => {
    return await api.post('/orders', orderData);
};