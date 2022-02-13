import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Drawing } from "../drawing";
import { Editor } from "../editor";
import { ErrorPage } from "../error";
import { Settings, SettingsProvider } from "../settings";

export const App = () => {
    return (
        <BrowserRouter>
            <SettingsProvider>
                <Routes>
                    <Route path="/error" element={<ErrorPage />} />
                    <Route path="/drawing/:page" element={<Drawing />} />
                    <Route path="/editor" element={<Editor />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </SettingsProvider>
        </BrowserRouter>
    )
};
