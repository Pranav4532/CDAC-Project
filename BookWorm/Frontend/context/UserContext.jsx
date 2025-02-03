import { createContext, useContext, useReducer } from "react";

const UserContext = createContext();

const initialState = {
    id: null,
    name: "",
    role: "",
    email: "",
    password: "",
    phoneno: "",
};

function reducer(state, action) {
    switch (action.type) {
        case "user/login":
            return {
                ...state,
                id: action.payload.user_id,
                name: action.payload.name,
                role: action.payload.role,
                email: action.payload.email,
                password: action.payload.password,
                phoneno: action.payload.phoneno,
            };

        case "user/register":
            return {
                ...state,
                id: action.payload.user_id,
                name: action.payload.name,
                role: action.payload.role,
                email: action.payload.email,
                password: action.payload.password,
                phoneno: action.payload.phoneno,
            };

        default:
            return state; // Return the current state for unknown actions
    }
}

function UserProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <UserContext.Provider value={{ ...state, dispatch }}>
            {children}
        </UserContext.Provider>
    );
}

function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}

export { UserProvider, useUser };
