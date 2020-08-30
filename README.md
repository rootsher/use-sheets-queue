# @rootsher/use-sheets-queue

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

function App() {
    return (
        <SheetsProvider>
            {/* app */}
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
