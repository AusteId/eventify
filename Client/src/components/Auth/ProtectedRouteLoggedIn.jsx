import { Navigate } from "react-router";
import { useAuth } from "./AuthContext";
import LoadingScreen from "../message/LoadingScreen";

const ProtectedRouteLoggedIn = ({children}) => {
    const {isAuthenticated,loading} = useAuth();
    
    if (loading) {
        return <div><LoadingScreen/></div>
      }

    if (isAuthenticated) {
     return <Navigate to="/" replace/>
    }
    
    return children;
}
 
export default ProtectedRouteLoggedIn;