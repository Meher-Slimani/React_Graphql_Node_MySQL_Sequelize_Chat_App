import { createContext, useReducer, useContext } from "react";
import jwtDecode from "jwt-decode";

const AuthStateContext = createContext();
const AuthDispatchContext = createContext();

let user = null;
const token = localStorage.getItem("token");
if (token) {
  const decodedToken = jwtDecode(token);
  const expiresAt = new Date(decodedToken.exp * 1000);

  if (new Date() > expiresAt) {
    localStorage.removeItem("token");
  } else {
    user = decodedToken;
  }
} else {
  console.log("No token found");
}

const authReducer = (state, { type, payload }) => {
  switch (type) {
    case "LOGIN":
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        user: payload,
      };
    case "LOGOUT":
      localStorage.removeItem("token");
      return {
        ...state,
        user: null,
      };
    default:
      throw new Error(`Unknown action type: ${type}`);
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user });

  return (
    <AuthDispatchContext.Provider value={dispatch}>
      <AuthStateContext.Provider value={state}>
        {children}
      </AuthStateContext.Provider>
    </AuthDispatchContext.Provider>
  );
};

export const useAuthState = () => useContext(AuthStateContext);
export const useAuthDispatch = () => useContext(AuthDispatchContext);
