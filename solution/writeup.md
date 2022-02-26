# Live Art Solution

The crux of the bug in this problem is a misuse of functional/higher order React components.

Consider these lines from `src/components/drawing/index.tsx`:

```tsx
const getWrappedError = WrapComponentError(ErrorPage)
const getWrappedViewer = WrapComponentError(Viewer);

...

const _Drawing = (props: Props) => {

    ...

    const view = bigEnough
        ? getWrappedViewer({ image })
        : getWrappedError({ error: "Please make your window bigger" });

    return (
        <div>
            { view }
        </div>
    );
}
```

This code works, since the components are just functions, and the result of using a higher order component is still just a functional component. However, the difference is that the children components are being processed **in the same fiber** as the parent component.

Why is this a problem? It means that React hooks used by the children components will be bound to the parent component.

Let's look a bit closer at those two children:

### `src/components/error/index.tsx`

```tsx
export const ErrorPage = (props: Props) => {
    const params = useHashParams<{ error: string, returnTo: string }>();
    const error = props.error ?? params.error;
    const returnTo = props.returnTo ?? params.returnTo;

    return (
        <div>
            <h1>Uh Oh Spaghetti-Oh!</h1>
            <h3>{ error }</h3>
            <div>
                <a href={ returnTo }>Return to previous page</a> or <a href="/">go home</a>.
            </div>
        </div>
    )
}
```

The error page uses a single hook, called `useHashParams`. However, this hook in turn is defined as (`/src/hooks/index.tsx`):

```tsx
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
```

Notice that it uses both a `useState` and a `useEffect` hook. Since nested hooks ultimately get attached to the component the invoked the top-level hook, these are both now attached to the error page, which from the above means it's actually bound to the `_Drawing` component.

### `src/components/viewer/index.tsx`


```tsx
export const Viewer = (props: Props) => {
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
        baseResolution
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
            <h1>Viewing</h1>
            <img src={props.image} { ...dimensions }/>
        </div>
    )
}
```

Note that the `Viewer` component has two hooks attached directly to the component. However, these hooks are a `useReducer` and `useEffect` hook. As before, these will get attached to the `_Drawing` component.

## How to use the bug?

Why is this helpful? Well if it's not immediately clear what this does, it might be worth looking at [React's implementation of hooks](https://github.com/facebook/react/blob/e12a9dfc96be12ea8e5c759986041ee5308e8e06/packages/react-reconciler/src/ReactFiberHooks.new.js#L752). To make a long file short, hooks are stored in a state object bound to the component (technically fiber) itself and are referenced based off of order. In other words, React knows how to persist data from on render to the next based off of the _order_ of the hooks.

Looking back at the code for `_Drawing`, we see that we can change which hooks are used by changing the screen width. How will this affect the hooks? It will cause all of the state from the first set of hooks to be treated as the state for the new set. So if we start at the error page and go to the viewer page, we'll have **state teleportation** from `useState -> useReducer` and `useEffect -> useEffect`.

Now, this might seem problematic since `useState` and `useReducer` are different hooks, but `useState` internally is just a wrapper around `useReducer` (sort of, there's a bit more complexity there). What this means is that when we swap to the `useReducer` call, the state from before will be used as the current reducer state **instead of re-initializing the state**.

Furthermore, if we look at what that reducer is storing, it's an object with width and height that gets passed **directly as the props to an <img>**.

What is that initial state? It's coming from `useHashParams`, and is the parsed hash params from the URL. In other words, it's a **user controlled key value object**.

Thus, by using this bug, we can have full control of the props to `React.createComponent("img", ...)`, but only with string values.

## Exploitation

The exploitation is fairly straightforward. We can't naively pass an `onerror` or `onload` prop because it will be interpreted by React, which is expecting a function not a string.

However, as [this problem from `redpwnCTF 2021`](https://ethanwu.dev/blog/2021/07/14/redpwn-ctf-2021-md-bin/) demonstrated, that's not an issue when you fully control the props. By setting `is=img`, React will naively pass all the props given to it to the `<img>` tag, including our event handler strings. Thus, we can set `is=img`, `src=<valid img src>`, and `onload=alert(1)` to gain code execution on the page.

## Final Product

For the full exploitation chain, take a look at `index.js` and `pwn.html` in this directory. It contains a simple script that loads the vulnerable page in a narrow `iframe` with the exploit in the hash part of the URL. Then after a second, it widens the page to switch the hooks around. Immediately this causes our code to be executed, which fetches the flag from local storage and sends it back to the server.
