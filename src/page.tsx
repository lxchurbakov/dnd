import React from 'react';
import styled from 'styled-components';
import { useBetween } from 'use-between';

const useEventListener = (o, name, cb) => {
    React.useEffect(() => {
        o.addEventListener(name, cb);

        return () => o.removeEventListener(name, cb);
    }, []);
};

// Step Two - the Move Area but with many blocks

const AreaWrap = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
`;

const BlockWrap = styled.div`
    position: absolute;
    cursor: move;
    user-select: none;
`;

const useMovingArea = () => {
    const mouseRef = React.useRef(null);
    const nodeRef = React.useRef(null);

    const start = (e, $nodeRef) => {
        const { clientX: x, clientY: y } = e;

        mouseRef.current = { x, y };
        nodeRef.current = $nodeRef.current;
    };

    useEventListener(window, 'mousemove', (e) => {
        if (mouseRef.current) {
            const { clientX: x, clientY: y } = e;

            const rect = nodeRef.current.getBoundingClientRect();

            const left = rect.left + (x - mouseRef.current.x);
            const top = rect.top + (y - mouseRef.current.y);

            nodeRef.current.style.left = left + 'px'; 
            nodeRef.current.style.top = top + 'px';

            mouseRef.current = { x, y };
        }
    });

    useEventListener(window, 'mouseup', (e) => {
        mouseRef.current = null;
    });

    return { start };
};

const Area = ({ children, ...props }) => {
    return (
        <AreaWrap {...props}>
            {children}
        </AreaWrap>
    );
};

const Block = ({ movingArea, children, ...props }) => {
    const nodeRef = React.useRef(null);

    return (
        <BlockWrap onMouseDown={(e) => movingArea.start(e, nodeRef)} ref={nodeRef} {...props}>
            {children}
        </BlockWrap>
    );
};

export default () => {
    const movingArea = useMovingArea();

    return (
        <Area>
            <Block movingArea={movingArea}>
                <div style={{ padding: '12px 20px', background: 'white', border: '1px solid black' }}>
                    <h1>Drag me around</h1>
                </div>
            </Block>

            <Block movingArea={movingArea}>
                <div style={{ padding: '12px 20px', background: 'white', border: '1px solid black' }}>
                    <h1>Drag me around 2</h1>
                </div>
            </Block>
        </Area>
    );
};
