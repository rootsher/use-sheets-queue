# [@rootsher/use-sheets-queue](https://github.com/rootsher/use-sheets-queue)

[![npm version](https://img.shields.io/npm/v/@rootsher/use-sheets-queue.svg)](https://www.npmjs.com/package/@rootsher/use-sheets-queue)
[![npm downloads](https://img.shields.io/npm/dm/@rootsher/use-sheets-queue.svg)](https://www.npmjs.com/package/@rootsher/use-sheets-queue)
[![GitHub issues](https://img.shields.io/github/issues/rootsher/use-sheets-queue.svg)](https://github.com/rootsher/use-sheets-queue/issues)
[![GitHub PRs](https://img.shields.io/github/issues-pr/rootsher/use-sheets-queue.svg)](https://github.com/rootsher/use-sheets-queue/pulls)
[![ISC license](https://img.shields.io/npm/l/@rootsher/use-sheets-queue.svg)](https://opensource.org/licenses/ISC)

## installation

```sh
$ npm install --save @rootsher/use-sheets-queue
```

## demo

<img src="https://raw.githubusercontent.com/rootsher/use-sheets-queue/master/docs/assets/img/demo.gif">

## usage

* sheets provider:

```tsx
import { SheetsProvider } from 'use-sheets-queue';

function Main() {
    return (
        <SheetsProvider>
            {/* App */}
        </SheetsProvider>
    );
}
```

* sheets management (LIFO - push, pop):

```tsx
import { useSheetsQueue } from 'use-sheets-queue';

import { A } from './sheets';

function App() {
    const [ push ] = useSheetsQueue();
    
    return (
        <Button onClick={() => push(A)}>push</Button>
    );
}
```

## API

```ts
type Options = {
    side?: 'left' | 'right' | 'bottom' | 'top';
    size?: number;
};

function push(Element, options?: Options, previousOptions?: Options);
function pop();
```
