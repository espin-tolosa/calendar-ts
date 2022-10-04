import { useContext, createContext } from "react";

export const authLevel = createContext<jh.SpaUserType | null>(null);

export const useAuthLevel = () => {
    return useContext(authLevel);
}