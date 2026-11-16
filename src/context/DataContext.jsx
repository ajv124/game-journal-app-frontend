import { createContext, useContext, useState } from "react";

const DataContext = createContext()

function DataProvider({ children }) {
    return (
        <DataContext.Provider value={{}}>
            {children}
        </DataContext.Provider>
    )
}

export default DataProvider

export function useData() {
    return useContext(DataContext)
}