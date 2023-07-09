import React from 'react';
import styled from 'styled-components';
import { useBetween } from 'use-between';

import { Flex, Base, Card, Container, Text } from './atoms';

import { colors } from './theme';

import { useMovement, Zone, Block } from './lib';
import { useDND, Overlayer, Drag } from './lib';

export default () => {
    const movement = useMovement({
        // onStart: (data) => console.log('start', data),
        // onMove: (data) => console.log('move', data),
        // onStop: (data) => console.log('stop', data),
        onOffset: (position) => {
            // const nodes = movement.list();
            // const xsnaps = nodes.reduce((acc, node) => acc.concat([node.rect.left, node.rect.right]), []);

            // const xsnapindex = xsnaps.findIndex((snap) => Math.abs(snap - position.x) < 20);

            const x = position.x;
            const y = position.y;

            return { x, y };


    // const list = () => {
    //     return Array.from(zoneRef.current.childNodes).map((node: any) => ({
    //         rect: node.getBoundingClientRect(),
    //         data: JSON.parse(node.getAttribute('data-value')),
    //     }));
    // };

            // console.log(xsnaps, position.x)

            // return {
            //     x: position.x - position.x % 10,
            //     y: position.y - position.y % 10,
            // };
        },
    });

    const dnd = useDND({});

    return (
        <>
            <Overlayer dnd={dnd} />

            <Container>
                <Text mb="18px" size={42} weight={800} color={colors.text}>
                    Drag and Drop explained
                </Text>

                <Text mb="18px" mw="600px" size={16} weight={400} color={colors.text}>
                    Did you ever wonder how Draggable, Beautiful DND and React DND are connected? 
                    Why those quite different things have quite the same name, even that they serve 
                    different purpose and can't replace each other? There's actually a little bit 
                    of hidden complexity behind drag and drop that no one seems to care about. 
                    Let's figure out why.
                </Text>

                <Text mb="32px" mw="600px" size={16} weight={400} color={colors.text}>
                    My name is <a target="_blank" href="//lxchurbakov.com">Alexander Churbakov</a>, 
                    I am a fullstack JS developer with more than 8 years of experience. 
                    Visit my website to know more about me or subscribe to get notified about news project I work on.
                </Text>

                <Text mb="18px" size={32} weight={800} color={colors.text}>
                    Moving things around
                </Text>

                <Text mb="18px" mw="600px" size={16} weight={400} color={colors.text}>
                    The first library on the list is not claiming to do any drag and drop stuff, 
                    it only lets you move elements around. Let's try to reimplement that.
                </Text>

                <Base mb="18" w="100%" h="500px" bc="#f0f0f0" br="4px">
                    <Zone movement={movement}>
                        <Block zIndex={2} position={{ x: 20, y: 20 }} data="card-1" movement={movement}>
                            <Card>
                                <Text size={22} weight={800}>Movable Card</Text>
                                <Text size={16} weight={400}>Try to move me around!</Text>
                            </Card>
                        </Block>

                        <Block zIndex={1} position={{ x: 20, y: 120 }} data="card-2" movement={movement}>
                            <Card>
                                <Text size={22} weight={800}>I am a movable card too!</Text>
                                <Text size={16} weight={400}>Try to move me around!</Text>
                            </Card>
                        </Block>
                    </Zone>
                </Base>

                <Text mb="32px" mw="600px" size={16} weight={400} color={colors.text}>
                    That looks good, but what if we want to move elements all over the page, outside of the container they are in?
                </Text>

                <Text mb="18px" size={32} weight={800} color={colors.text}>
                    Moving Zone over everything
                </Text>

                <Text mb="18px" mw="600px" size={16} weight={400} color={colors.text}>
                    To do so, we need to place a moving zone all over the page. Once the element is being
                    dragged, we will create a clone block inside that zone. Let's seee how that works.
                </Text>

                <Base p="12px" mb="18" w="100%" bc="#f0f0f0" br="4px">
                    <Flex gap="12px" justify="flex-start">
                        <Drag dnd={dnd}>{({ state }) => (
                            <Card>
                                <Text size={22} weight={800}>Card you can take</Text>
                                <Text size={16} weight={400}>Try to move me around! State: {state}</Text>
                            </Card>
                        )}</Drag>

                        <Drag dnd={dnd}>{({ state }) => (
                            <Card>
                                <Text size={22} weight={800}>Another one!</Text>
                                <Text size={16} weight={400}>Try to move me around! State: {state}</Text>
                            </Card>
                        )}</Drag>
                    </Flex>
                </Base>
            </Container>
        </>
    );
};  



// Step Two - the Move Area but with many blocks





// // Step 3 - Drag and Drop

// const NoInteractionArea = styled(Area)`
//     position: fixed;
//     top: 0;
//     left: 0;
//     width: 100vw;
//     height: 100vh;
//     z-index: 100;
//     pointer-events: none;
// `;

// const DragWrap = styled.div`
//     cursor: move;
//     user-select: none;
// `;

// const DropWrap = styled.div`

// `;

// const DropContext = React.createContext({} as any);

// const Provider = ({ children }) => {
//     const [blocks, setBlocks] = React.useState([]);
//     const [data, setData] = React.useState(null);
//     const active = React.useMemo(() => blocks.length > 0, [blocks]);

//     const movingArea = useMovingArea({ onStop: () => setBlocks([]) });

//     const push = (event, predicate, data) => {
//         const rect = event.target.getBoundingClientRect();
//         const offset = { x: event.clientX - rect.width / 2, y: event.clientY - rect.height / 2 };

//         setBlocks(($) => $.concat([(
//             <Block key={Math.random()} immediate={{ offset, event }} movingArea={movingArea} style={{ pointerEvents: 'none' }}>
//                 {predicate({ drag: false, use: true })}
//             </Block>
//         )]));

//         setData(data);
//     };

//     return (
//         <DropContext.Provider value={{ active, push, data }}>
//             <NoInteractionArea>
//                 {blocks}
//             </NoInteractionArea>

//             {children}
//         </DropContext.Provider>
//     );
// };

// const Drag = ({ data, children, ...props }) => {
//     const [drag, setDrag] = React.useState(false);
//     const dropContext = React.useContext(DropContext);

//     const start = (e) => {
//         dropContext.push(e, children, data);
//         setDrag(true);
//     };

//     React.useEffect(() => {
//         if (!dropContext.active) {
//             setDrag(false);
//         }
//     }, [dropContext.active]);

//     return (
//         <DragWrap onMouseDown={start} {...props}>
//             {children({ drag, use: false })}
//         </DragWrap>
//     );
// };  

// const Drop = ({ onDrop, children }) => {
//     const [over, setOver] = React.useState(false);
//     const dropContext = React.useContext(DropContext);

//     const mouseOver = () => {
//         if (dropContext.active) {
//             setOver(true);
//         }
//     };

//     const mouseOut = () => {
//         setOver(false);
//     };

//     const drop = () => {
//         onDrop(dropContext.data);
//     };

//     return (
//         <DropWrap onMouseOver={mouseOver} onMouseOut={mouseOut} onMouseUp={drop}>
//             {children({ over })}
//         </DropWrap>
//     );
// };


// export default () => {
//     // const movingArea = useMovingArea();

//     return (
//         <Provider>
//             <Flex mt="12px" align="center" justify="center" gap="12px">
//                 <Card>
//                     <Drag data="asd" style={{ marginBottom: 12 }}>
//                         {({ drag, use }) => (
//                             <Element>
//                                 Table ({drag ? 'drag' : (use ? 'use': 'static')})
//                             </Element>
//                         )}
//                     </Drag>

//                     <Drag data="qwe">
//                         {({ drag, use }) => (
//                             <Element>
//                                 Table ({drag ? 'drag' : (use ? 'use': 'static')})
//                             </Element>
//                         )}
//                     </Drag>
//                 </Card>

//                 <Card>
//                     <Drop onDrop={console.log}>
//                         {({ over }) => (
//                             <Element>
//                                 Drop ({over ? 'over' : 'none'})

//                                 <Drop onDrop={console.log}>
//                                     {({ over }) => (
//                                         <Element>
//                                             Drop ({over ? 'over' : 'none'})
//                                         </Element>
//                                     )}
//                                 </Drop>
//                             </Element>
//                         )}
//                     </Drop>
//                 </Card>
//             </Flex>
            
//         </Provider>
//     );
// };

{/* <Area>
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
</Area> */}
