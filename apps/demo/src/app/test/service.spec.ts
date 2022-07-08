import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { createSpyFromClass } from 'jest-auto-spies';
import { take } from 'rxjs/operators';
import { TestService, ThirdPartyService } from './service';

function setup() {
  const mock = createSpyFromClass(ThirdPartyService);
  mock.getDataFromPromise.mockResolvedValue('test');
  mock.getDataFromObservable.nextWith('test');
  const service = new TestService(mock);
  return {
    service,
    mock,
  };
}

describe('TestService', () => {
  describe('when the mocked service uses promises', () => {
    it('works with subscribeSpyTo', () => {
      const { service, mock } = setup();
      const spy = subscribeSpyTo(service.getUserInfo(), { expectErrors: true });
      expect(mock.getDataFromPromise).toHaveBeenCalled(); // <--- this passes and proves the observable is subscribed to
      expect(spy.receivedError()).toBe(false); // <--- this passes and proves there are no errors in the stream
      expect(spy.receivedNext()).toBe(true); // <--- this fails, which means the stream created by `from` doesn't emit any values?
      expect(spy.getLastValue()).toEqual('test');
    });

    it('works with subscribe and done callback', (done: jest.DoneCallback) => {
      const { service, mock } = setup();
      service
        .getUserInfo()
        .pipe(take(1))
        .subscribe((result) => {
          expect(mock.getDataFromPromise).toHaveBeenCalled();
          expect(result).toEqual('test');
          done();
        });
    });
  });

  describe('when the mocked service uses observables', () => {
    it('works with subscribeSpyTo', () => {
      const { service, mock } = setup();
      const spy = subscribeSpyTo(service.getUserInfo2(), {
        expectErrors: true,
      });
      expect(mock.getDataFromObservable).toHaveBeenCalled(); // <--- this passes and proves the observable is subscribed to
      expect(spy.receivedError()).toBe(false); // <--- this passes and proves there are no errors in the stream
      expect(spy.receivedNext()).toBe(true); // <--- this fails, which means the stream created by `from` doesn't emit any values?
      expect(spy.getLastValue()).toEqual('test');
    });

    it('works with subscribe and done callback', (done: jest.DoneCallback) => {
      const { service, mock } = setup();
      service
        .getUserInfo2()
        .pipe(take(1))
        .subscribe((result) => {
          expect(mock.getDataFromObservable).toHaveBeenCalled();
          expect(result).toEqual('test');
          done();
        });
    });
  });
});
