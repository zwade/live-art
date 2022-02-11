import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Drawing } from "../drawing";
import { ErrorPage } from "../error";

export const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/error" element={<ErrorPage />} />
                <Route path="/drawing/:page" element={<Drawing />} />
            </Routes>
        </BrowserRouter>
    )
};
