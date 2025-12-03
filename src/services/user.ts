import api from "./api";

export const toggleWishListItem = async (email: string, productID: string) => {
    const response = await api.put("/users/wishlist", { email, productId: productID });
    return response.data;
};

export const getWishList = async (email:string) => {
    const response = await api.get(`/users/wishlist/${email}`);
    return response.data;
}

export const getMyDetails = async () => {
    const res = await api.get('/users/getMyDetails')
    return res.data
}