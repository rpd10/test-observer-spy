# @hirez_io/observer-spy Example

This repo contains a minimal reproduction of an odd behavior/bug with observer-spy and jest-auto-spies.

## Setup

```bash
npm i
nx test demo
```

## The Bug

See `apps/demo/src/app/test/service.spec.ts` and associated code.

It seems like `@hirez_io/observer-spy` does not deal with Observables that are created `from` Promises?

```bash
> nx run demo:test

 FAIL   demo  apps/demo/src/app/test/service.spec.ts
  ● TestService › works with subscribeSpyTo

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false

      20 |     expect(mock.getData).toHaveBeenCalled(); // <--- this passes and proves the observable is subscribed to
      21 |     expect(spy.receivedError()).toBe(false); // <--- this passes and proves there are no errors in the stream
    > 22 |     expect(spy.receivedNext()).toBe(true); // <--- this fails, which means the stream created by `from` doesn't emit any values?
         |                                ^
      23 |     expect(spy.getLastValue()).toEqual('test');
      24 |   });
      25 |

      at src/app/test/service.spec.ts:22:32
```
