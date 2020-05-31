export const URL = 'http://127.0.0.1:8000';
export const REQUEST_OPTIONS = {
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json',
    },
    // cache: 'no-cache', credentials: 'same-origin',
    // redirect: 'follow',
    // referrerPolicy: 'no-referrer'
};

export const VERTEX_SHAPE = Object.freeze({STROKED: 'STROKED', FILLED: 'FILLED'});
export const VERTEX_RADIUS = 10;