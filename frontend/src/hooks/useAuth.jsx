import { useContext } from "react";
import { AuthContext } from "../contexts";

//custom hook
export const useAuth = () => {
    return useContext(AuthContext);
};
