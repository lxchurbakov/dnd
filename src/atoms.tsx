import React from 'react';
import styled, { css } from 'styled-components';

import * as theme from './theme';

const MAPPING = {
    mt: 'margin-top',
    mb: 'margin-bottom',
    mw: 'max-width',
    w: 'width',
    bc: 'background-color',
    h: 'height',
    br: 'border-radius',
} as const;

type MappingKey = keyof typeof MAPPING;
export type BaseProps = Map<MappingKey, string>;

export const Base = styled.div<any>`
    ${(props) => {
        const mapped = Object.keys(props as any).reduce((acc, key) => {
            if (MAPPING[key]) {
                return { ...acc, [MAPPING[key]]: props[key] };
            } else {
                return acc;
            }
        }, {});

        const str = Object.keys(mapped).reduce((acc, key) => {
            return acc + `${key}: ${mapped[key]};`;
        }, '');

        return css`${str}`;
    }};
`;

export const Flex = styled(Base)<{ gap?: string, align: string, justify?: string }>`
    display: flex;
    gap: ${props => props.gap};
    align-items: ${props => props.align};
    justify-content: ${props => props.justify};
`;

export const Card = styled(Base)`
    background: white;
    padding: 12px;
    border-radius: 4px;
    border: 1px solid #ddd;
`;

export const Text = styled(Base)<{ color?: string, size: number, weight: number, lineHeight?: string }>`
    font-family: ${theme.fontFamily};
    font-size: ${props => props.size}px;
    font-weight: ${props => props.weight};
    line-height: ${props => props.lineHeight || '160%'};
    color: ${props => props.color};
`;

export const Container = styled(Base)`
    max-width: ${theme.bodyWidth}px;
    padding: 80px 20px;
    margin: 0 auto;
`;