import React from 'react';
import styled from 'styled-components';
import { useBetween } from 'use-between';

// Absolute Zone Stuff

const useEventListener = (o, name, cb) => {
    React.useEffect(() => {
        o.addEventListener(name, cb);

        return () => o.removeEventListener(name, cb);
    }, []);
};

const Zone = ({ api, children: c }) => {
    const [children, setChildren] = React.useState((c || []).map(($) => ({ content: $, id: Math.random().toString() })));
    const mouseRef = React.useRef(null);
    const nodeRef = React.useRef(null);
    const cbRef = React.useRef(null);
    const idRef = React.useRef(null);

    const move = (e, childRef) => {
        console.log(e, childRef)
        const { clientX: x, clientY: y } = e;

        mouseRef.current = { x, y };
        nodeRef.current = childRef.current;
    };

    const add = (e, node, cb) => {
        console.log(e, node);
        const id = Math.random().toString();
        
        const wtf = (
            <Block api={api} key={id} innerRef={nodeRef}>
                {node()}
            </Block>
        );

        setChildren((c) => c.concat([{ id, content: wtf }]));
        setTimeout(() => {
            move(e, nodeRef);
        }, 0);

        cbRef.current = cb;
        idRef.current = id;
        
        // console.log(wtf)
        // wtf.start(e);
    };

    useEventListener(window, 'mouseup', React.useCallback((e) => {
        if (cbRef.current) {
            cbRef.current(e);
        }

        setChildren((c) => c.filter(($) => $.id !== idRef.current));

        mouseRef.current = null;
        cbRef.current = null;
        idRef.current = null;
    }, []));

    useEventListener(window, 'mousemove', React.useCallback((e) => {
        if (mouseRef.current !== null) {
            const { clientX: x, clientY: y } = e;
            const rect = nodeRef.current.getBoundingClientRect();

            const left = rect.left + (x - mouseRef.current.x);
            const top = rect.top + (y - mouseRef.current.y);

            // nodeRef.current.style.position ='absolute';
            nodeRef.current.style.left = left + 'px'; 
            nodeRef.current.style.top = top + 'px';

            mouseRef.current = { x, y };
        }
    }, []));

    const has = () => {
        // console.log('has', mouseRef)
        return mouseRef;
    };

    React.useEffect(() => {
        api.current = {
            move, add, has
        };
    }, []);

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 100, pointerEvents: 'none' }}>
            {children.map(($) => $.content)}
        </div>
    );
};

const Block = ({ innerRef, api, children }: any) => {
    const ref = React.useRef(null);

    const start = (e) => {
        api.current.move(e, ref);
    };

    React.useEffect(() => {
        if (innerRef) {
            innerRef.current = ref.current;
        }
    }, []);

    return (
        <div ref={ref} onMouseDown={start} style={{ position: 'absolute' }}>
            {children}
        </div>
    );
};

const Drag = ({ api, children }) => {
    const [content, setContent] = React.useState(children());

    const start = (e) => {
        api.current.add(e, children, (e) => {
            console.log('finished');
            // setContent(children())
        });

        // setContent(null);
    };

    return (
        <div onMouseDown={start}>
            {content}
        </div>
    );
};

const Drop = ({ api, children }) => {
    // const wtfRef = React.useRef(null);

    const [over, setOver] = React.useState(false);
    const [content, setContent] = React.useState(children({
        over
    }));

    useEventListener(window, 'mousemove', (e) => {
        if (api.current.has().current !== null) {
            setContent(children({ over: true }));
        } else {
            setContent(children({ over: false }));
        }
    });

    return (
        <div>
            {content}
        </div>
    );
};



// const _useAbsoluteZone = () => {
//     const absoluteZoneRef = React.useRef(null);
//     const dragRef = React.useRef(null);
//     const mouseRef = React.useRef(null);
//     const cbRef = React.useRef(null);

//     // const AbsoluteZone = React.useCallback(() => {
//     //     return (
            
//     //     );
//     // }, []);

//     const push = (e, node, cb) => {
//         const zone = absoluteZoneRef.current;
//         dragRef.current = node;

//         zone.appendChild(node);
//         const { clientX: x, clientY: y } = e;
//         mouseRef.current = { x, y };

//         cbRef.current = cb;
//     };

//     const clone = (e, node, cb) => {
//         const $ = node.cloneNode(true);
//         const zone = absoluteZoneRef.current;
//         dragRef.current = $;

//         zone.appendChild($);
//         const { clientX: x, clientY: y } = e;
//         mouseRef.current = { x, y };

//         cbRef.current = cb;
//     };

   

//     useEventListener(window, 'mouseup', React.useCallback((e) => {
//         mouseRef.current = null;
//         cbRef.current(dragRef.current)
//     }, []));

//     return { AbsoluteZone, push, clone };
// };

// const useAbsoluteZone = () => useBetween(_useAbsoluteZone);

// // Main Stuff

// // const ZoneWrap = styled.div`
// //     position: relative;
// //     top: 0;
// //     left: 0;
// //     width: 100vw;
// //     height: 100vh;
// //     background: #f5f5f5;
// // `;

// // const Zone = ({ children }) => {
// //     return (
// //         <ZoneWrap>
// //             {children}
// //         </ZoneWrap>  
// //     );
// // };

const Wrap = styled.div`
    background: #ffffff;
    padding: 12px;
    border-radius: 4px;
    border: 1px solid #aaa;
    width: auto;
    cursor: move;
    user-select: none;
`;

// // const Drag = ({ children }) => {
// //     const { clone } = useAbsoluteZone();

// //     // const mouseRef = React.useRef(null);
// //     const nodeRef = React.useRef(null);

// //     const handleMouseDown = React.useCallback((e) => {
// //         // const { clientX: x, clientY: y } = e;

// //         // mouseRef.current = { x, y };
// //         const parent = nodeRef.current.parentNode;
// //         clone(e, nodeRef.current, (node) => {
// //             parent.appendChild(node);
// //         });
// //     }, []);

// //     // const handleMouseUp = React.useCallback(() => {
// //     //     mouseRef.current = null;
// //     // }, []);

// //     // const handleMouseMove = React.useCallback((e) => {
// //     //     if (mouseRef.current !== null) {
// //     //         // const { clientX: x, clientY: y } = e;
// //     //         // const rect = nodeRef.current.getBoundingClientRect();

// //     //         // const left = rect.left + (x - mouseRef.current.x);
// //     //         // const top = rect.top + (y - mouseRef.current.y);

// //     //         // nodeRef.current.style.left = left + 'px'; 
// //     //         // nodeRef.current.style.top = top + 'px';

// //     //         // mouseRef.current = { x, y };
// //     //     }
// //     // }, []);

// //     // React.useEffect(() => {
// //     //     window.addEventListener('mousemove', handleMouseMove);

// //     //     return () => window.removeEventListener('mousemove', handleMouseMove);
// //     // }, [handleMouseMove]); 

// //     return (
// //         <DragWrap ref={nodeRef} onMouseDown={handleMouseDown}>
// //             {children}
// //         </DragWrap>
// //     );
// // };

export default () => {
    const zoneApi = React.useRef(null);

    // React.useEffect(() => {
    //     console.log(zoneApi)
    // }, []);

    
    return (
        <>
            <Zone api={zoneApi} />

            <Drag api={zoneApi}>
                {() => (
                    <Wrap>
                        <h1>It works too</h1>
                    </Wrap>
                )}
            </Drag>

            <Drop api={zoneApi}>
                {({ over }) => (
                    <Wrap>
                        <h1>Drop: {over ? 'Yes' : 'No'}</h1>
                    </Wrap>
                )}
            </Drop>
        </>
    );  

//     <Drag api={zoneApi}>
//     {() => {
//         return (
            
//         );
//     }}
// </Drag>

    // const { AbsoluteZone } = useAbsoluteZone();

    // return (
    //     <>
    //         <AbsoluteZone />

    //         <Zone>
    //             <Drag>
    //                 <h1>It works</h1>
    //             </Drag>
    //         </Zone>
    //     </>
    // );
};
