import React, { Fragment, createContext, useContext, useState, FC, ComponentType } from 'react';
import { Transition, TransitionGroup } from 'react-transition-group';
import { TransitionStatus } from 'react-transition-group/Transition';

import * as styled from './use-sheets-queue.styled';

const duration = 400; // ms

const SheetsContext = createContext([
    (Element: ComponentType<{ options?: SheetOptions }>, options?: SheetOptions, previousOptions?: SheetOptions) => {},
    () => {},
]);

type Side = 'left' | 'right' | 'bottom' | 'top';

export class SheetOptions {
    public readonly side: Side;
    public readonly size: number;

    constructor(side?: Side, size?: number) {
        this.side = side || 'right';
        this.size = size || 50;
    }
}

class Sheet {
    // property using for swap operation (read-only)
    public readonly defaultOptions: SheetOptions = new SheetOptions();

    constructor(
        public readonly Element: ComponentType<{ options?: SheetOptions }>,
        public options?: SheetOptions,
        public readonly previousOptions?: SheetOptions
    ) {
        if (options) {
            this.defaultOptions = options;
        }
    }

    updateOptions(options: SheetOptions) {
        this.options = {
            ...this.options,
            ...options,
        };
    }
}

export const SheetsProvider: FC = ({ children }) => {
    const [queue, setQueue] = useState<Sheet[]>([]);

    function push(
        Element: ComponentType<{ options?: SheetOptions }>,
        options?: SheetOptions,
        previousOptions?: SheetOptions
    ) {
        const lastSheet = queue.slice(-1)[0];
        const newQueue = queue.slice(0, -1);

        // if last element exists - overwrite options in previous element
        if (lastSheet) {
            if (previousOptions) {
                lastSheet.updateOptions(previousOptions);
            }

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
                {(status) => (
                    <styled.Container visible={!['exited'].includes(status)}>
                        <TransitionGroup>
                            {queue.map((sheet, index) => {
                                const $sheet = (status: TransitionStatus) => (
                                    <styled.Sheet status={status} {...sheet.options}>
                                        <sheet.Element options={sheet.options} />
                                    </styled.Sheet>
                                );

                                return (
                                    <Transition key={index} component={null} timeout={{ enter: 0, exit: duration }}>
                                        {(status) => (
                                            <Fragment>
                                                <styled.Backdrop status={status} onClick={pop} />
                                                {$sheet(status)}
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
};

export function useSheetsQueue() {
    const [push, pop] = useContext(SheetsContext);

    return [push, pop];
}
