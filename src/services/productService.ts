import api from './api';


export const getRecommendations = async (answers: any) => {
    return await api.post('/products/recommend', answers);
};

export const getAllProducts = async () => {
    return await api.get('/products');
};