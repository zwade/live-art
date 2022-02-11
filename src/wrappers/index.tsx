import * as React from "react";

export class ComponentError {
    constructor(public message: string) { }
}

export const WrapComponentError = <T extends (props: any) => JSX.Element>(component: T, returnTo = "/") => {
    return (props: T extends (props: infer P) => JSX.Element ? P : {}) => {
        try {
            return component(props);
        } catch (e) {
            const error = e instanceof ComponentError ? e.message : "Something went wrong";
            window.location.href = `/error#message=${encodeURIComponent(error)}&returnTo=${encodeURIComponent(returnTo)}`;
        }
    }
}