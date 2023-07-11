import React from 'react';

import { BaseProps, Shadowed, Flex, Base, Card, Text } from '../extra/atoms';
import { colors } from '../extra/theme';

import { Drag, Drop } from '../lib';

export default ({ dnd, ...props }: any) => {
    const holdRef = React.useRef([]);
    const [sizes, setSizes] = React.useState([]);
    const [hint, setHint] = React.useState('');

    const [columns, setColumns] = React.useState([[
        { id: 1, name: 'Alex', age: 27, description: 'Lazy student, but great sometimes' },
        { id: 2, name: 'Marcus', age: 24, description: 'Great student, but lazy sometimes' },
    ], [
        { id: 3, name: 'Mikaela', age: 25, description: 'Always late' },
    ]]);

    const saveRef = React.useCallback((index) => (node) => {
        if (node) {
            holdRef.current[index] = node;
        }
    }, []);

    React.useEffect(() => {
        // To account for padding between elements we will count this
        // from rect.top to rect.top instead of using rect.height 
        // (we will for the first one though)
        let sizes = [];

        for (let i = 0; i < holdRef.current.length; ++i) {
            let previousTop = null;

            sizes.push(Array.from(holdRef.current[i].childNodes).map((node: any) => {
                const rect = node.getBoundingClientRect();
                const value = previousTop === null ? rect.height : rect.top - previousTop;

                previousTop = rect.top;

                return value;
            }))
        }

        setSizes(sizes);
    }, [columns, setSizes]);

    const arrange = React.useCallback(({ id: dropColumnIndex, position, data }) => {
        if (!data) {
            return;
        }

        if (data.type !== 'kanban') {
            setHint('You are trying to drop cards that do not belong here.');
        }

        // const columnIndex = data.columnIndex;
        // const columnIndex = id;
        const dropColumnRect = holdRef.current[dropColumnIndex].getBoundingClientRect();

        let offset = position.y - dropColumnRect.top;
        let index = 0;

        while (offset > 0) {
            offset -= sizes[dropColumnIndex][index++];
        }

        index -= 1;

        // Now we proceed to actually moving stuff phase

        const id = data.value;
        const sourceColumnIndex = columns.findIndex((c) => c.findIndex(($) => $.id === id) !== -1);

        if (sourceColumnIndex === dropColumnIndex) {
            // we're within one column, so just simply rearrange stuff
            const sourceColumn = columns[sourceColumnIndex];
            const item = sourceColumn.find((item) => item.id === id);

            const sourceColumnWithoutItem = sourceColumn.filter(($) => $.id !== id);
            const sourceColumnWithItemInPlace = sourceColumnWithoutItem.slice(0, index).concat([item]).concat(sourceColumnWithoutItem.slice(index));

            columns[sourceColumnIndex] = sourceColumnWithItemInPlace;

            setColumns([...columns]);
            // setColumns(($) => $.map(($$, index) => index === sourceColumnIndex ? sourceColumnWithItemInPlace : $$));
        } else {
            // Now we have to move it somewhere else
            const sourceColumn = columns[sourceColumnIndex];
            const item = sourceColumn.find((item) => item.id === id);

            const sourceColumnWithoutItem = sourceColumn.filter((item) => item.id !== id);
            const dropColumn = columns[dropColumnIndex];
            const dropColumnWithItem = dropColumn.slice(0, index).concat([item]).concat(dropColumn.slice(index));

            columns[sourceColumnIndex] = sourceColumnWithoutItem;
            columns[dropColumnIndex] = dropColumnWithItem;

            setColumns([...columns]);
        }
    }, [sizes, columns]);

    return (
        <Base {...props}>
            <Text mb="18px" size={32} weight={800} color={colors.text}>
                Kanban
            </Text>

            <Text mb="18px" mw="600px" size={16} weight={400} color={colors.text}>
                Same list but multiple.
            </Text>

            <Flex gap="24px" justify="flex-start" align="flex-start">
                {columns.map((column, index) => (
                    <Drop id={index} key={index} dnd={dnd} onShadow={arrange}>{() => (
                        <Base p="24px" w="100%" bc="#f0f0f0" br="4px">
                            <Flex gap="12px" ref={saveRef(index)} direction="column" align="flex-start">
                                {column.map((item) => (
                                    <Drag data={{ type: 'kanban', value: item.id }} key={item.id} dnd={dnd}>{({ state }) => (
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
                ))}
            </Flex>

            {hint && <Text size={14} weight={400} color={colors.text}>{hint}</Text>}
        </Base>
    );
};
