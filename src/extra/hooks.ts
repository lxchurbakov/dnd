import React from 'react';

import { EventEmitter } from './emitter';

export const useEmitter = <T>() => {
    const [emitter, setEmitter] = React.useState(
        new EventEmitter<T>()
    );

    return emitter;
};

export const useEventListener = (o, name, cb, deps) => {
    React.useEffect(() => {
        o.addEventListener(name, cb, false);

        return () => o.removeEventListener(name, cb);
    }, deps);
};
