import api from "./api";


export const toggleWishListItem = async (email: string, productId: string) => { 
    return await api.put(`/users/wishlist`, { email, productId }); 
};
export const getWishList = async (email:string) => {
    const response = await api.get(`/users/wishlist/${email}`);
    return response.data;
}

export const getMyDetails = async () => {
    const res = await api.get('/users/getMyDetails')
    return res.data
}