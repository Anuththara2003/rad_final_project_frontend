import api from "./api";

type RegisterDataType = {
    username: string;
    email: string;
    password: string;
}


export const registerUser = async (data: RegisterDataType) => {
    const response = await api.post("/auth/signup", data);
    return response.data;
}

export const loginUser = async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
}


export const refreshTokens = async (refreshToken: string) => {
    const res = await api.post('/auth/refresh', { token: refreshToken })
    return res.data
}