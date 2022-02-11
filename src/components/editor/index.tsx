import * as React from "react";

type Dimensions = { width: number, height: number };

const baseResolution: Dimensions = { width: 500, height: 300 };

export const Editor = () => {
    const [dimensions, updateDimensions] = React.useReducer(
        (canvasDimensions: Dimensions, windowDimensions: Dimensions) => {
            const newScale = Math.floor(Math.min(
                (windowDimensions.width / baseResolution.width),
                (windowDimensions.height / baseResolution.height))
            );

            const desiredDimensions = { width: baseResolution.width * newScale, height: baseResolution.height * newScale };
            if (desiredDimensions.width !== canvasDimensions.width || desiredDimensions.height !== canvasDimensions.height) {
                return desiredDimensions;
            } else {
                return canvasDimensions;
            }
        },
        { width: 500, height: 500 }
    );

    React.useEffect(() => {
        const listener = () => {
            updateDimensions({ width: window.innerWidth - 100, height: window.innerHeight - 200 });
        }

        window.addEventListener("resize", listener);

        return () => {
            window.removeEventListener("resize", listener);
        }
    }, []);

    return (
        <div>
            <h1>Editor!</h1>
            <img { ...dimensions } src="https://static01.nyt.com/images/2021/09/14/science/07CAT-STRIPES/07CAT-STRIPES-mediumSquareAt3X-v2.jpg"/>
        </div>
    )
}