import React from 'react';
import styled from 'styled-components';

const ZoneWrap = styled.div`
    position: relative;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #f5f5f5;
`;

const Zone = ({ children }) => {
    return (
        <ZoneWrap>
            {children}
        </ZoneWrap>  
    );
};

const DragWrap = styled.div`
    background: #ffffff;
    padding: 12px;
    border-radius: 4px;
    border: 1px solid #aaa;
    width: auto;
    position: absolute;
    cursor: move;
    user-select: none;
`;

const Drag = ({ children }) => {
    const mouseRef = React.useRef(null);
    const nodeRef = React.useRef(null);

    const handleMouseDown = React.useCallback((e) => {
        const { clientX: x, clientY: y } = e;

        mouseRef.current = { x, y };
    }, []);

    const handleMouseUp = React.useCallback(() => {
        mouseRef.current = null;
    }, []);

    const handleMouseMove = React.useCallback((e) => {
        if (mouseRef.current !== null) {
            const { clientX: x, clientY: y } = e;
            const rect = nodeRef.current.getBoundingClientRect();

            const left = rect.left + (x - mouseRef.current.x);
            const top = rect.top + (y - mouseRef.current.y);

            nodeRef.current.style.left = left + 'px'; 
            nodeRef.current.style.top = top + 'px';

            mouseRef.current = { x, y };
        }
    }, []);

    React.useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [handleMouseMove]); 

    return (
        <DragWrap ref={nodeRef} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
            {children}
        </DragWrap>
    );
};

export default () => {
    return (
        <Zone>
            <Drag>
                <h1>It works</h1>
            </Drag>
        </Zone>
    );
};
