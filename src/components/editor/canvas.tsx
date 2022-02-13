import * as React from "react";

import { CanvasManager } from "../../canvas";
import { ColorContext } from "./colors";

export interface Props {

}

export const Canvas = (props: Props) => {
    const [canvas, setCanvas] = React.useState<HTMLCanvasElement | null>(null);
    const managerRef = React.useRef<CanvasManager | null>(null);
    const { color } = React.useContext(ColorContext);

    React.useEffect(() => {
        if (!canvas) return;

        managerRef.current = new CanvasManager(canvas, color);

        return () => managerRef.current?.destroy();
    }, [canvas])

    React.useEffect(() => {
        managerRef.current?.setColor(color);
    }, [color]);

    return (
        <canvas ref={setCanvas} className="canvas" width={64} height={64} />
    )
}