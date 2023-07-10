import React from 'react';

export const useEventListener = (o, name, cb, deps) => {
    React.useEffect(() => {
        o.addEventListener(name, cb, false);

        return () => o.removeEventListener(name, cb);
    }, deps);
};
