import React, { Fragment, createContext, useContext, useState } from 'react';
import styled, { css } from 'styled-components';
import { Transition, TransitionGroup } from 'react-transition-group';

const duration = 400; // ms

const Container = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    display: ${({ visible }) => (visible ? 'block' : 'none')};
`;

const Backdrop = styled.div`
    position: absolute;
    background-color: #000;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: ${({ state }) => (state === 'entered' ? 0.32 : 0)};
    transition: opacity ${duration}ms;
`;

const sides = {
    top: [1, 1, 0, 1],
    right: [1, 1, 1, 0],
    bottom: [0, 1, 1, 1],
    left: [1, 0, 1, 1],
};

const Sheet = styled.div`
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

type Options = {
    side?: 'left' | 'right' | 'bottom' | 'top';
    size?: number;
};

const SheetsContext = createContext([
    (Element, options: Options) => {}, // push
    () => {}, // pop
]);

export function SheetsProvider({ children }) {
    const [queue, setQueue] = useState<
        {
            Element: any;
            defaultOptions: Options;
            options?: Options;
        }[]
    >([]);

    function push(Element, options?: Options, previousOptions?: Options) {
        const defaultOptions: Options = {
            side: 'right',
            size: 50,
        };
        const lastElement = queue.slice(-1)[0];
        const newQueue = [...queue.slice(0, -1)];

        // if last element exists - overwrite options in previous element
        if (lastElement) {
            newQueue.push({
                ...lastElement,
                options: {
                    ...lastElement.options,
                    ...previousOptions,
                },
            });
        }

        newQueue.push({
            Element,
            // property using for swap operation (read-only)
            defaultOptions: options,
            options: {
                ...defaultOptions,
                ...options,
            },
        });

        setQueue(newQueue);
    }

    function pop() {
        const beforeLast = queue[queue.length - 2];

        // if before last element exists - undo to default options and remove last element
        setQueue(
            beforeLast
                ? [
                      ...queue.slice(0, -2),
                      {
                          ...beforeLast,
                          // swap operation
                          options: beforeLast.defaultOptions,
                      },
                  ]
                : []
        );
    }

    return (
        <SheetsContext.Provider value={[push, pop]}>
            {children}
            <Transition component={null} in={queue.length > 0} timeout={{ enter: 0, exit: duration }}>
                {(state) => (
                    <Container visible={!['exited'].includes(state)}>
                        <TransitionGroup>
                            {queue.map(({ Element, options }, index) => {
                                const sheet = (state) => (
                                    <Sheet state={state} {...options}>
                                        <Element options={options} />
                                    </Sheet>
                                );

                                return (
                                    <Transition key={index} component={null} timeout={{ enter: 0, exit: duration }}>
                                        {(state) => (
                                            <Fragment>
                                                <Backdrop state={state} onClick={pop} />
                                                {sheet(state)}
                                            </Fragment>
                                        )}
                                    </Transition>
                                );
                            })}
                        </TransitionGroup>
                    </Container>
                )}
            </Transition>
        </SheetsContext.Provider>
    );
}

export function useSheetsQueue() {
    const [push, pop] = useContext(SheetsContext);

    return [push, pop];
}
