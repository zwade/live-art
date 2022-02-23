import * as React from "react";

import { WrapComponentError } from "../../wrappers";
import { SettingsOptions } from "./settings-options";

const getWrappedOptions = WrapComponentError(SettingsOptions, "/settings");

export const Settings = () => {
    const options = getWrappedOptions({});

    return (
        <div className="settings">
            <h1>Settings</h1>
            { options }
        </div>
    )
}

export { SettingsProvider } from "./settings-provider";