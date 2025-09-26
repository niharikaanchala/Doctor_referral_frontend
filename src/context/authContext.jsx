import { createContext, useContext, useEffect, useReducer } from "react";

const initailState = {
  user:
    localStorage.getItem("user") !== undefined
      ? JSON.parse(localStorage.getItem("user"))
      : null,
  role: localStorage.getItem("role") || null,
  token: localStorage.getItem("token") || null,
};

export const authContext = createContext(initailState);

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        role: null,
        token: null,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload.user,
        token: action.payload.token,
        role: action.payload.role,
      };
    case "LOGOUT":
      return {
        user: null,
        role: null,
        token: null,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initailState);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
    localStorage.setItem("token", state.token);
    localStorage.setItem("role", state.role);
  }, [state]);

  // New method to update user information
  const updateUser = (updatedUser) => {
    // Merge the updated fields with existing user data
    const mergedUser = {
      ...state.user,
      ...updatedUser
    };

    dispatch({
      type: "UPDATE_USER",
      payload: mergedUser,
    });

    // Update localStorage immediately
    localStorage.setItem("user", JSON.stringify(mergedUser));
  };

  return (
    <authContext.Provider
      value={{
        user: state.user,
        token: state.token,
        role: state.role,
        dispatch,
        updateUser, // Add the new method to the context
      }}
    >
      {children}
    </authContext.Provider>
  );
};
