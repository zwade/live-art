import * as React from "react";

const getHashParams = <T extends Record<string, string>>() => {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const result = Object.create(null);
    params.forEach((value, key) => {
        result[key] = value;
    });

    return result as T;
};

export const useHashParams = <T extends Record<string, string>>() => {
    const [params, setParams] = React.useState(getHashParams<T>());

    React.useEffect(() => {
        const listener = () => {
            setParams(getHashParams<T>());
        }

        window.addEventListener("hashchange", listener);

        return () => {
            window.removeEventListener("hashchange", listener);
        }
    });

    return params;
};
