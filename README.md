# @rootsher/use-sheets-queue

## installation

```sh
$ npm install --save @rootsher/use-sheets-queue
```

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
