import React, { Fragment, createContext, useContext, useState, ReactElement } from 'react';
import { Transition, TransitionGroup } from 'react-transition-group';

import * as styled from './index.styled';

const duration = 400; // ms

const SheetsContext = createContext(null);

export class SheetOptions {
    public readonly side?: 'left' | 'right' | 'bottom' | 'top';
    public readonly size?: number;

    constructor(side?, size?) {
        this.side = side || 'right';
        this.size = size || 50;
    }
}

class Sheet {
    // property using for swap operation (read-only)
    public readonly defaultOptions?: SheetOptions;

    constructor(
        public readonly Element: ReactElement,
        public options?: SheetOptions,
        public readonly previousOptions?: SheetOptions
    ) {
        this.defaultOptions = options;
    }

    updateOptions(options: SheetOptions) {
        this.options = {
            ...this.options,
            ...options,
        };
    }
}

export function SheetsProvider({ children }) {
    const [queue, setQueue] = useState<Sheet[]>([]);

    function push(Element: ReactElement, options?: SheetOptions, previousOptions?: SheetOptions) {
        const lastSheet = queue.slice(-1)[0];
        const newQueue = queue.slice(0, -1);

        // if last element exists - overwrite options in previous element
        if (lastSheet) {
            lastSheet.updateOptions(previousOptions);
            newQueue.push(lastSheet);
        }

        newQueue.push(new Sheet(Element, options, previousOptions));

        setQueue(newQueue);
    }

    function pop() {
        const beforeLastSheet = queue[queue.length - 2];

        // if before last element exists - undo to default options and remove last element
        if (beforeLastSheet) {
            beforeLastSheet.updateOptions(beforeLastSheet.defaultOptions);

            setQueue([...queue.slice(0, -2), beforeLastSheet]);
        } else {
            setQueue([]);
        }
    }

    return (
        <SheetsContext.Provider value={[push, pop]}>
            {children}
            <Transition component={null} in={queue.length > 0} timeout={{ enter: 0, exit: duration }}>
                {(state) => (
                    <styled.Container visible={!['exited'].includes(state)}>
                        <TransitionGroup>
                            {queue.map((sheet, index) => {
                                const $sheet = (state) => (
                                    <styled.Sheet state={state} {...sheet.options}>
                                        <sheet.Element options={sheet.options} />
                                    </styled.Sheet>
                                );

                                return (
                                    <Transition key={index} component={null} timeout={{ enter: 0, exit: duration }}>
                                        {(state) => (
                                            <Fragment>
                                                <styled.Backdrop state={state} onClick={pop} />
                                                {$sheet(state)}
                                            </Fragment>
                                        )}
                                    </Transition>
                                );
                            })}
                        </TransitionGroup>
                    </styled.Container>
                )}
            </Transition>
        </SheetsContext.Provider>
    );
}

export function useSheetsQueue() {
    const [push, pop] = useContext(SheetsContext);

    return [push, pop];
}
