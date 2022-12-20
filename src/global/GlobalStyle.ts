import { css } from "@emotion/react";

export const GlobalStyle = css`
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;700&display=swap');


*,
*::after,
*::before {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
*:focus,
*:active {
    -webkit-tap-highlight-color: transparent;
}
* {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
}
body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    
}
input,
button {
    outline: none;
}
a {
    text-decoration: none;
}
button,
svg {
    cursor: pointer;
}

a {
    text-decoration: none;
}

input, fieldset, button {
    border: unset;
    outline: unset;
}
`