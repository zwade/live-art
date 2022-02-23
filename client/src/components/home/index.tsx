import * as React from "react";
import { useNavigate } from "react-router-dom";

import "./index.scss";

export const Home = () => {
    const nav = useNavigate();

    return (
        <div className="home">
            <div
                className="button"
                onClick={() => nav("/editor")}
            >
                Editor
            </div>
            <div
                className="button"
                onClick={() => nav("/settings")}
            >
                Settings
            </div>
        </div>
    )
}