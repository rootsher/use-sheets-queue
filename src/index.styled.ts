import styled, { css } from 'styled-components';

const duration = 400; // ms
const sides = {
    top: [1, 1, 0, 1],
    right: [1, 1, 1, 0],
    bottom: [0, 1, 1, 1],
    left: [1, 0, 1, 1],
};

export const Container = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    display: ${({ visible }) => (visible ? 'block' : 'none')};
`;

export const Backdrop = styled.div`
    position: absolute;
    background-color: #000;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: ${({ state }) => (state === 'entered' ? 0.32 : 0)};
    transition: opacity ${duration}ms;
`;

export const Sheet = styled.div`
    position: absolute;
    box-shadow: 0 0 10px -5px rgba(0, 0, 0, 0.2), 0 0 24px 2px rgba(0, 0, 0, 0.14), 0 0 30px 5px rgba(0, 0, 0, 0.12);
    background-color: #f1f3f4;
    overflow: auto;
    ${({ side, size }) =>
        ['top', 'bottom'].includes(side)
            ? css`
                  height: ${size}%;
              `
            : css`
                  width: ${size}%;
              `};
    ${(props) =>
        ['top', 'right', 'bottom', 'left'].map(
            (side, index) => css`
                ${side}: ${sides[props.side][index] ? 0 : 'auto'};
            `
        )}
    transform: ${({ state, side }) => css`
        ${['left', 'right'].includes(side) &&
        `translateX(
          ${state === 'entered' ? 0 : `${`${(side === 'left' ? -1 : 1) * 100}%`}`}
        )`}
        ${['top', 'bottom'].includes(side) &&
        `translateY(
          ${state === 'entered' ? 0 : `${`${(side === 'top' ? -1 : 1) * 100}%`}`}
        )`}
    `};
    transition: width ${duration}ms, height ${duration}ms, transform ${duration}ms;
`;
