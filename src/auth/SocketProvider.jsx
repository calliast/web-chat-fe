import { useSelector } from "react-redux";
import { signIn, signOut } from "../helpers/utils";
import { AuthContext } from "./AuthContext";



export default function SocketProvider({ children }) {
    const isLoggedIn = useSelector(state => state.user)

    return (
        
    )

}
