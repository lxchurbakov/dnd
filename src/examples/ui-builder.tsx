import React from 'react';
import styled from 'styled-components';
import { Drop, Drag } from '../lib';
import { Flex, Card, Base, Container, Text } from '../extra/atoms';
import { colors } from '../extra/theme';

import { StickyFill } from '@styled-icons/bootstrap/StickyFill';

const RelativeBase = styled(Base)`
    position: relative;
`;

const Overlay = styled(Card)`
    position: absolute;
    top: 40px;
    left: 40px;
    width: 400px;
    height: auto;
    z-index: 90;
    box-shadow: 0 0 4px 0 rgba(0,0,0,.3);
`;

const PlaceholderWrap = styled(Base)<{ state: string }>`
    width: 100px;
    height: 100px;
    background: ${props => props.state === 'shadow' ? '#bed6fc' : '#9dbcec'};
    border-radius: 4px;

    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;
`;

const Placeholder = ({ state, ...props }) => {
    return (
        <PlaceholderWrap state={state} {...props}>
            <Text size={14} color={colors.text} weight={400}>Drop here</Text>
        </PlaceholderWrap>
    );
};

const COMPONENTS = {
    'root': ({ dnd, value, onChange }) => {
        const handleDrop = React.useCallback(({ position, data }) => {
            onChange({
                type: 'root',
                content: {
                    type: data,
                    content: null,
                }
            });
        }, []);

        return (
            <Flex w="100%" h="100%">
                {value.content ? <Node dnd={dnd} value={value.content} onChange={(v) => onChange({ ...value, content: v })} /> : <Drop onDrop={handleDrop} dnd={dnd}>{({ state }) => (
                    <Placeholder state={state} />
                )}</Drop>}
            </Flex>
        );
    },
    'double-slot': ({ dnd, value, onChange }) => {
        const handleLeftDrop = React.useCallback(({ position, data }) => {
            onChange({
                type: 'double-slot',
                content: {
                    left: {
                        type: data,
                        content: null,
                    },
                    right: value.content?.right,
                },
            });
        }, [value]);

        const handleRightDrop = React.useCallback(({ position, data }) => {
            onChange({
                type: 'double-slot',
                content: {
                    right: {
                        type: data,
                        content: null,
                    },
                    left: value.content?.left,
                },
            });
        }, [value]);

        return (
            <Flex gap="12px" w="100%" h="100%">
                {value.content?.left 
                    ? <Node dnd={dnd} value={value.content.left} onChange={(v) => onChange({ ...value, content: { ...value.content, left: v } })} /> 
                    : <Drop onDrop={handleLeftDrop} dnd={dnd}>{({ state }) => (
                        <Placeholder state={state} />
                )}</Drop>}

                {value.content?.right 
                    ? <Node dnd={dnd} value={value.content.right} onChange={(v) => onChange({ ...value, content: { ...value.content, right: v } })} /> 
                    : <Drop onDrop={handleRightDrop} dnd={dnd}>{({ state }) => (
                        <Placeholder state={state} />
                )}</Drop>}
            </Flex>
        );
    },
    'text': ({ dnd, value, onChange }) => {
        return (
            <Text size={14} color={colors.text} weight={400}>Some Text</Text>
        );
    },
};

const Node = ({ dnd, value, onChange }) => {
    const Component = COMPONENTS[value.type];

    return (
        <Component dnd={dnd} value={value} onChange={onChange} />
    );
};

export default ({ dnd, ...props }) => {
    const [value, setValue] = React.useState({
        type: 'root',
        content: null,
    });

    console.log(value)

    return (
        <Base {...props}>
            <Container>
                <Text mb="18px" size={32} weight={800} color={colors.text}>
                    UI builder
                </Text>

                <Text mb="18px" mw="600px" size={16} weight={400} color={colors.text}>
                    Webflow-like drag and drop editor.
                </Text>
            </Container>

            <RelativeBase w="100%" h="800px" background="linear-gradient(217deg, #3F51B5AA, #03A9F4AA)">
                <Overlay p="12px">
                    <Text mb="8px" size={22} weight={800} color={colors.text}>
                        Components
                    </Text>

                    <Text mb="18px" size={16} weight={400} color={colors.text}>
                        Select a component and drag it in the blue area.
                    </Text>

                    <Flex gap="12px" justify="flex-start">
                        {Object.keys(COMPONENTS).map((key) => (
                            <Drag data={key} key={key} dnd={dnd}>{() => (
                                <Card p="6px">
                                    <Flex direction="column">
                                        <StickyFill size={20} color="#999999" />

                                        <Text size={14} weight={400}>{key}</Text>
                                    </Flex>
                                </Card>
                            )}</Drag>
                        ))}
                    </Flex>
                </Overlay>

                <Node dnd={dnd} value={value} onChange={setValue} />
            </RelativeBase>
        </Base>
    );
};

// {/* <Drop style={{ height: '100%' }} onShadow={shadow} onDrop={drop} dnd={dnd}>{({ state }) => (
//                     <Zone movement={movement}>
//                         {blocks.map((block) => (
//                             <Block zIndex={2} position={block.position} data={block.id} movement={movement}>
//                                 <Card>
//                                     <Text size={22} weight={800}>{block.title}</Text>
//                                     <Text size={16} weight={400}>{block.description}</Text>
//                                 </Card>
//                             </Block>
//                         ))}
//                     </Zone>
//                 )}</Drop>

// {/* <Flex gap="12px" justify="flex-start">
//     

//     <Drag data="note" dnd={dnd}>{() => (
//         <Card p="6px" w="60px">
//             <Flex direction="column">
//                 <NoteSticky size={20} color="#999999" />

//                 <Text size={14} weight={400}>Note</Text>
//             </Flex>
//         </Card>
//     )}</Drag>
// </Flex> */} */}
