import _ from 'lodash';
import React from 'react';
import styled from 'styled-components';

import { useEventListener } from './extra/hooks';

const getMousePositionFromEvent = (e) => ({ x: e.clientX, y: e.clientY });
const isPositionWithinRect = (position, rect: DOMRect) => 
    position.x >= rect.left && position.x <= rect.right &&
    position.y >= rect.top && position.y <= rect.bottom

// Level 1 - move stuff around in HTML node

const AreaWrap = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
`;

const BlockWrap = styled.div`
    position: absolute;
    cursor: move;
    user-select: none;
    pointer-events: all;
`;

export const useMovement = ({ onStart, onMove, onStop, onOffset }: any) => {
    const zoneRef = React.useRef(null); // reference to the parent node
    const mouseRef = React.useRef(null); // last mouse position
    const dragRef = React.useRef(null); // reference to the element we move
    const rectRef = React.useRef(null);

    // The following section represents the "monitor" -
    // a way to check the state of moving
    const [data, setData] = React.useState(null);
    const onMoveDebounced = React.useMemo(() => onMove ? _.throttle((...args) => mouseRef.current && onMove(...args), 200) : null, [onMove]);

    // Firstly we update the reference to the parent element
    // to keep track of the area we're allowed to move things around
    const zone = React.useCallback((ref) => {
        zoneRef.current = ref.current;
    }, []);
    
    // Then we can actually start moving stuff by accepting
    // the event (to get position) and reference to the node
    const start = React.useCallback((event, nodeRef, data) => {
        const position = getMousePositionFromEvent(event);
        const rect = nodeRef.current.getBoundingClientRect();
        const zone = zoneRef.current.getBoundingClientRect();

        mouseRef.current = position;
        dragRef.current = nodeRef.current;
        rectRef.current = { x: rect.left - zone.left, y: rect.top - zone.top };

        setData(data);
        onStart?.({ position, data });
    }, [onStart, data]);
    
    useEventListener(window, 'mousemove', (event) => {
        if (mouseRef.current) {
            const position = getMousePositionFromEvent(event);

            rectRef.current.x = rectRef.current.x + (position.x - mouseRef.current.x);
            rectRef.current.y = rectRef.current.y + (position.y -  mouseRef.current.y);

            const offset = onOffset?.(rectRef.current) || rectRef.current;

            dragRef.current.style.left = offset.x + 'px'; 
            dragRef.current.style.top = offset.y + 'px';

            mouseRef.current = position;

            onMoveDebounced?.({ position, data });
        }
    }, [data, onMoveDebounced]);

    useEventListener(window, 'mouseup', (event) => {
        const position = getMousePositionFromEvent(event);

        setData(null);
        dragRef.current = null;
        mouseRef.current = null;

        onMoveDebounced?.({ position, data });
        onStop?.({ position, data });
    }, [data, onStop]);

    return { data, zone, start };
};

export const Zone = ({ children, movement, ...props }) => {
    const zoneRef = React.useRef(null);

    React.useEffect(() => {
        movement.zone(zoneRef);
    }, []);

    return (
        <AreaWrap ref={zoneRef} {...props}>
            {children}
        </AreaWrap>
    );
};

export const Block = ({ immediate, zIndex, position, data, movement, children, style, ...props }: any) => {
    const nodeRef = React.useRef(null);

    React.useEffect(() => {
        if (position) {
            nodeRef.current.style.left = position.x + 'px';
            nodeRef.current.style.top = position.y + 'px';
        }
    }, []);

    React.useEffect(() => {
        if (immediate) {
            movement.start(immediate, nodeRef, data);
        }
    }, [immediate]);

    const left = position ? (position.x + 'px') : 'auto';
    const top = position ? (position.y + 'px') : 'auto';

    return (
        <BlockWrap 
            onMouseDown={(e) => movement.start(e, nodeRef, data)} 
            ref={nodeRef} 
            style={{ zIndex, left, top, ...style }} 
            {...props}
        >
            {children}
        </BlockWrap>
    );
};

// Level 2 - actual drag and drop

const DragWrap = styled.div<{ propagate: boolean }>`
    cursor: move;
    user-select: none;
    pointer-events: ${props => props.propagate ? 'none' : 'all'};
`;

const OverlayerWrap = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vw;
    overflow: hidden;
    pointer-events: none;
    z-index: 100;
`;

const DropWrap = styled.div`
    user-select: none;
`;

export const useDND = ({ }) => {
    const [listeners, setListeners] = React.useState([]);
    const [block, setBlock] = React.useState(null);
    
    const emit = React.useCallback((data) => 
        listeners.forEach((listener) => listener(data)), [listeners]);    

    const listen = React.useCallback((l) => {
        setListeners(($) => $.concat([l]));
        return () => setListeners(($) => $.filter(($$) => $$ !== l));
    }, [setListeners]);

    const movement = useMovement({
        onStop: ({ position, data }) => {
            setBlock(null);
            emit({ type: 'stop', meta: { position, data }});
        },
        onMove: ({ position, data }) => {
            emit({ type: 'move', meta: { position, data }});
        },
    });

    const start = (e, children, data) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const cursorPosition = getMousePositionFromEvent(e);

        const position = { x: cursorPosition.x - (rect.width / 2), y: cursorPosition.y - (rect.height / 2) };

        setBlock((
            <Block data={data} movement={movement} immediate={e} position={position}>
                {children({ state: 'drag' })}
            </Block>
        ));
    };

    return { emit, listen, block, start, movement };
};

export const Overlayer = ({ dnd, children }: any) => {
    return (
        <OverlayerWrap>
            <Zone movement={dnd.movement}>
                {dnd.block}
            </Zone>
        </OverlayerWrap>
    );
};

export const Drag = ({ data, dnd, children }: any) => {
    const [state, setState] = React.useState('idle');

    React.useEffect(() => {
        if (dnd.block === null) {
            setState('idle');
        }
    }, [dnd.block]);

    const start = React.useCallback((e) => {
        dnd.start(e, children, data); 
        setState('shadow');
    }, [dnd.start, setState]);

    return (
        <DragWrap propagate={state === 'drag'} onMouseDown={start}>
            {children({ state })}
        </DragWrap>
    );
};

export const Drop = ({ dnd, onShadow, onDrop, children }: any) => {
    const wrapRef = React.useRef(null);
    const [state, setState] = React.useState('idle');

    React.useEffect(() => {
        return dnd.listen(({ type, meta }) => {
            if (type === 'stop') {
                const { position, data } = meta;

                if (state === 'shadow') {
                    onDrop?.({ position, data});
                }

                setState('idle');
            }

            if (type === 'move') {
                const { position, data } = meta;

                const rect = wrapRef.current.getBoundingClientRect();
                const isShadowed = isPositionWithinRect(position, rect); 

                setState(isShadowed ? 'shadow' : 'idle');

                if (isShadowed) {
                    onShadow?.({ data, position });
                }
            }
        });
    }, [setState, onShadow, onDrop, state, dnd.emitter]);

    return (
        <DropWrap ref={wrapRef}>
            {children({ state })}
        </DropWrap>
    );
};
