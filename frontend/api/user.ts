import { User } from "@/models/user";
import api from "./api";

export const login = async (email: string, password: string) => {
    const response = await api.post("/user/login", {
        email,
        password,
    });

    return response.data;
}

export const createUser = async (user: User) => {
    const response = await api.post("/user", user);

    return response.data;
}

export const getUser = async (): Promise<User[]> => {
    const response = await api.get("/user");
  
    return response.data;
};

