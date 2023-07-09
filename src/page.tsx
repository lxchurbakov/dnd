import React from 'react';
import styled from 'styled-components';
import { useBetween } from 'use-between';

import { Flex, Base, Card, Container, Text } from './atoms';

import { colors } from './theme';

import { useMovement, Zone, Block } from './lib';
import { useDND, Overlayer, Drag, Drop } from './lib';

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
    const [message, setMessage] = React.useState('');

    const handleDrop = React.useCallback((data) => {
        setMessage(`Just dropped ${data}!`);
        setTimeout(() => {
            setMessage('');
        }, 5000);
    }, [setMessage]);

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
                    dragged, we will create a clone block inside that zone. Let's see how that works.
                </Text>

                <Base p="12px" mb="18px" w="100%" bc="#f0f0f0" br="4px">
                    <Flex gap="12px" justify="flex-start">
                        <Drag data={1} dnd={dnd}>{({ state }) => (
                            <Card>
                                <Text size={22} weight={800}>Card you can take</Text>
                                <Text size={16} weight={400}>Try to move me around! State: {state}</Text>
                            </Card>
                        )}</Drag>

                        <Drag data={2} dnd={dnd}>{({ state }) => (
                            <Card>
                                <Text size={22} weight={800}>Another one!</Text>
                                <Text size={16} weight={400}>Try to move me around! State: {state}</Text>
                            </Card>
                        )}</Drag>
                    </Flex>
                </Base>

                <Text mb="18px" mw="600px" size={16} weight={400} color={colors.text}>
                    That looks good too, but now we want to actually drop them somewhere. 
                    Let's add {'<Drop />'} element and make it behave like the dropzone.
                </Text>

                <Drop dnd={dnd} onDrop={handleDrop}>{({ state }) => (
                    <Base p="24px" mb="18" w="100%" bc="#f0f0f0" br="4px">
                        <Text size={16} weight={400}>{message} Dropzone, state: {state}</Text>
                    </Base>
                )}</Drop>

                <Text mb="32px" mw="600px" size={16} weight={400} color={colors.text}>
                    Yep, that's it! That's actually a full synthetic drag and drop on top of
                    moving zone in less than 100 lines of code! By separating these actions and
                    making it possible to use them together we've achieved the superpower. Let's see what we can do.
                </Text>
            </Container>
        </>
    );
};  



