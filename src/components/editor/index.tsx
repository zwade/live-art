import * as React from "react";
import { Canvas } from "./canvas";
import { ColorPicker, ColorProvider } from "./colors";

import "./index.scss";

export interface Props {

}

export const Editor = (props: Props) => {
    const [canvas, setCanvas] = React.useState<HTMLCanvasElement | null>(null);

    return (
        <ColorProvider>
            <div className="editor">
                <Canvas/>
                <ColorPicker/>
            </div>
        </ColorProvider>
    );
}