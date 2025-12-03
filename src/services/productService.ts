import api from './api';


export const getRecommendations = async (answers: any) => {
    return await api.post('/products/recommend', answers);
};