import React from 'react';

import { Shadowed, Flex, Base, Card, Text } from '../atoms';
import { colors } from '../theme';

import { Drag, Drop } from '../lib';

export default ({ dnd }) => {
    const holdRef = React.useRef(null);
    const [sizes, setSizes] = React.useState([]);
    const [hint, setHint] = React.useState('');

    const [items, setItems] = React.useState([
        { id: 1, name: 'Alex', age: 27, description: 'Lazy student, but great sometimes' },
        { id: 2, name: 'Marcus', age: 24, description: 'Great student, but lazy sometimes' },
        { id: 3, name: 'Mikaela', age: 25, description: 'Always late' },
    ]);

    React.useEffect(() => {
        // To account for padding between elements we will count this
        // from rect.top to rect.top instead of using rect.height 
        // (we will for the first one though)
        let previousTop = null;

        setSizes(
            Array.from(holdRef.current.childNodes).map((node: any) => {
                const rect = node.getBoundingClientRect();
                const value = previousTop === null ? rect.height : rect.top - previousTop;

                previousTop = rect.top;

                return value;
            })
        );
    }, [items]);

    const arrange = React.useCallback(({ position, data }) => {
        if (data.type !== 'simple-cards') {
            setHint('You are trying to drop cards that do not belong here.');
        }

        const parentRect = holdRef.current.getBoundingClientRect();

        let offset = position.y - parentRect.top;
        let index = 0;

        while (offset > 0) {
            offset -= sizes[index++];
        }

        index -= 1;

        const id = data.value;
        
        const item = items.find((item) => item.id === id);
        const itemsWithoutTheOneBeingDragged = items.filter((item) => item.id !== id);
        const itemsWithTheOneBeingDraggedInPlace = itemsWithoutTheOneBeingDragged.slice(0, index).concat([item]).concat(itemsWithoutTheOneBeingDragged.slice(index));

        setItems(itemsWithTheOneBeingDraggedInPlace);
    }, [items, sizes]);

    return (
        <Base>
            <Text mb="18px" size={32} weight={800} color={colors.text}>
                Drag and Drop arrangement
            </Text>

            <Text mb="18px" mw="600px" size={16} weight={400} color={colors.text}>
                Classic drag and drop example. Sorting a list.
            </Text>

            <Drop dnd={dnd} onShadow={arrange}>{() => (
                <Base p="24px" mb="18" w="100%" bc="#f0f0f0" br="4px">
                    <Flex gap="12px" ref={holdRef} direction="column" align="flex-start">
                        {items.map((item) => (
                            <Drag data={{ type: 'simple-cards', value: item.id }} key={item.id} dnd={dnd}>{({ state }) => (
                                <Shadowed isShadowed={state === 'shadow'}>
                                    <Card>
                                        <Text size={22} weight={800} color={colors.text}>{item.name}, {item.age}</Text>
                                        <Text size={18} weight={400} color={colors.text}>{item.description}</Text>
                                    </Card>
                                </Shadowed>
                            )}</Drag>
                        ))}
                    </Flex>
                </Base>
            )}</Drop>

            {hint && <Text size={14} weight={400} color={colors.text}>{hint}</Text>}
        </Base>
    );
};
