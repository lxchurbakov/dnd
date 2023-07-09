import _ from 'lodash';
import React from 'react';
import styled from 'styled-components';

import { useEventListener } from './hooks';

const getMousePositionFromEvent = (e) => ({ x: e.clientX, y: e.clientY });

// Level 1 - move stuff around in HTML node

const AreaWrap = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
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

    const getPosition = (event) => {
        const zone = zoneRef.current.getBoundingClientRect();

        return {
            x: event.clientX - zone.left,
            y: event.clientY - zone.top,
        };
    };

    // Then we can actually start moving stuff by accepting
    // the event (to get position) and reference to the node
    const start = React.useCallback((event, nodeRef, data) => {
        const position = getPosition(event);
        const rect = nodeRef.current.getBoundingClientRect();
        const zone = zoneRef.current.getBoundingClientRect();

        mouseRef.current = position;
        dragRef.current = nodeRef.current;
        rectRef.current = { x: rect.left - zone.left, y: rect.top - zone.top };

        setData(data);
        onStart?.({ position, data });
    }, [data]);
    
    useEventListener(window, 'mousemove', (event) => {
        if (mouseRef.current) {
            const position = getPosition(event);

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
        const position = getPosition(event);

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

export const Block = ({ zIndex, position, data, movement, children, style, ...props }: any) => {
    const nodeRef = React.useRef(null);

    React.useEffect(() => {
        if (position) {
            nodeRef.current.style.left = position.x + 'px';
            nodeRef.current.style.top = position.y + 'px';
        }
    }, []);

    // React.useEffect(() => {
    //     if (immediate) {
    //         const { event } = immediate;


    //         movingArea.start(event, nodeRef);
    //     }
    // }, [immediate]);

    // 

    return (
        <BlockWrap data-value={JSON.stringify(data)} onMouseDown={(e) => movement.start(e, nodeRef, data)} ref={nodeRef} style={{ zIndex, ...style }} {...props}>
            {children}
        </BlockWrap>
    );
};