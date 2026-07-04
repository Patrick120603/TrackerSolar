/* eslint-disable react/prop-types */
import { createContext } from "react";

export const SolarAppContext = createContext();

const SolarAppContextProvider = (props) => {
    const value = {};
    return (
        <SolarAppContext.Provider value={value}>
            {props.children}
        </SolarAppContext.Provider>
    );
};

export default SolarAppContextProvider;