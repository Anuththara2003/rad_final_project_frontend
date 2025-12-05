import api from "./api";



export const getAllProducts = async () => {
  return await api.get("/products/");
};

export const createProduct = async (productData: any) => {
  return await api.post("/products/",productData);
};

export const updateProduct = async (id: string, productData: any) => {
  return await api.put(`/products/${id}`,productData);
};

export const deleteProduct = async (id: string) => {
  return await api.delete(`/products/${id}`);
};


export const getAllOrders = async () => {
  return await api.get(`/orders`);
};

export const updateOrderStatus = async (id: string, status: string) => {
  return await api.put(`/orders/${id}`, { status });
};


export const getUserOrdersByEmail = async(email:string)=>{
    return await api.get(`/orders/user/${email}`);
}

export const deleteOrder = async (id: string) => {
  return await api.delete(`/orders/${id}`);
};



// --- Users Services ---
export const getAllUsers = async () => {
  return await api.get("/users/");
};

export const removeUser = async (id: string) => {
  return await api.delete(`/users/${id}`);
};

// --- Stats Services ---
export const getDashboardStats = async () => {
  return await api.get(`/stats`);
};