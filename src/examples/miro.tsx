import React from 'react';
import styled from 'styled-components';

import { Flex, Base, Card, Text } from '../extra/atoms';
import { colors } from '../extra/theme';

import { Zone, Drop, Drag, Block, useMovement } from '../lib';

import { StickyFill } from '@styled-icons/bootstrap/StickyFill';
import { NoteSticky } from '@styled-icons/fa-regular/NoteSticky';

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

const snap = (x: number, base: number) => x - (x % 10);

export default ({ dnd, ...props }: any) => {
    const baseRef = React.useRef(null);

    const [blocks, setBlocks] = React.useState([
        { id: 1, title: 'Movable Sticker', description: 'Try to move me around!', position: { x: 540, y: 20 } },
        // { id: 2, title: 'I am a movable sticker too!', description: 'Try to move me around!' },
    ]);

    const movement = useMovement({
        // onStart: (data) => console.log('start', data),
        // onMove: (data) => console.log('move', data),
        // onStop: (data) => console.log('stop', data),
        onOffset: (position) => {
            return {
                x: snap(position.x, 10),
                y: snap(position.y, 10),
            }
        },
    });

    const shadow = React.useCallback((e) => {
        // console.log(e)
    }, []);

    const drop = React.useCallback(({ data, position }) => {

        const rect = baseRef.current.getBoundingClientRect();

        setBlocks(($) => $.concat([{
            id: $.length,
            title: `Movable ${data}`,
            description: 'Try to move me around too',
            position: {
                x: snap(position.x - rect.left, 10),
                y: snap(position.y - rect.top, 10),
            },
        }]));
    }, []);

    return (
        <Base {...props}>
            <Base p="20px">
                <Text mb="18px" size={32} weight={800} color={colors.text}>
                    Miro
                </Text>

                <Text mb="18px" mw="600px" size={16} weight={400} color={colors.text}>
                    Moving Area inside Drag and Drop context.
                </Text>
            </Base>

            <RelativeBase ref={baseRef} w="100%" h="800px" background="linear-gradient(217deg, #3F51B5AA, #03A9F4AA)">
                <Overlay p="12px">
                    <Text mb="8px" size={22} weight={800} color={colors.text}>
                        Components
                    </Text>

                    <Text mb="18px" size={16} weight={400} color={colors.text}>
                        Select a component and drag it in the blue area.
                    </Text>

                    <Flex gap="12px" justify="flex-start">
                        <Drag data="sticker" dnd={dnd}>{() => (
                            <Card p="6px">
                                <Flex direction="column">
                                    <StickyFill size={20} color="#999999" />

                                    <Text size={14} weight={400}>Sticker</Text>
                                </Flex>
                            </Card>
                        )}</Drag>

                        <Drag data="note" dnd={dnd}>{() => (
                            <Card p="6px" w="60px">
                                <Flex direction="column">
                                    <NoteSticky size={20} color="#999999" />

                                    <Text size={14} weight={400}>Note</Text>
                                </Flex>
                            </Card>
                        )}</Drag>
                    </Flex>
                </Overlay>

                <Drop style={{ height: '100%' }} onShadow={shadow} onDrop={drop} dnd={dnd}>{({ state }) => (
                    <Zone movement={movement}>
                        {blocks.map((block) => (
                            <Block zIndex={2} position={block.position} data={block.id} movement={movement}>
                                <Card>
                                    <Text size={22} weight={800}>{block.title}</Text>
                                    <Text size={16} weight={400}>{block.description}</Text>
                                </Card>
                            </Block>
                        ))}
                    </Zone>
                )}</Drop>
            </RelativeBase>
        </Base>
    );
};
