import * as React from "react";
import { useMatch, useParams } from "react-router-dom";

import { WrapComponentError } from "../../wrappers";
import { Editor } from "../editor";
import { ErrorPage } from "../error";

const getWrappedError = WrapComponentError(ErrorPage)
const getWrappedEditor = WrapComponentError(Editor);

const isWideEnough = () => window.outerWidth > 600;

interface Props {
    page?: string
}

const _Drawing = (props: Props) => {
    const [bigEnough, setBigEnough] = React.useState(isWideEnough());

    React.useEffect(() => {
        const listener = () => {
            setBigEnough(isWideEnough());
        }

        window.addEventListener("resize", listener);

        return () => {
            window.removeEventListener("resize", listener);
        }
    });

    const page = bigEnough
        ? getWrappedEditor({})
        : getWrappedError({ error: "Please make your window bigger" });

    return (
        <div>
            { page }
        </div>
    );
};

export const Drawing = () => {
    const params = useParams();
    return (<_Drawing page={ params.page } />);
}
