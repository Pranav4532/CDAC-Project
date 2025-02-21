import { createContext, useContext, useReducer } from "react";

const UserContext = createContext();

const initialState = {
    id: null,
    username: "",  // Changed from 'name' to 'username' to match DB
    email: "",
    password: "",
    phone: "",  // Changed from 'phoneno' to 'phone' to match DB
    role: "",
};

function reducer(state, action) {
    switch (action.type) {
        case "user/login":
            return {
                ...state,
                id: action.payload.id,  // Matches database schema
                username: action.payload.username,
                email: action.payload.email,
                password: action.payload.password,
                phone: action.payload.phone,
                role: action.payload.role,
            };

        default:
            return state;
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
