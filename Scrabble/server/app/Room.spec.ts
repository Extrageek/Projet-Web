import { assert, expect} from 'chai';
import { Room } from './Room';

describe('Room tester', () => {
    it('should throw error as constructing a room', done => {
        let func = function fn(){new Room(0)};
        expect(func).to.throw(RangeError);
        func = function fn(){new Room(5)};
        expect(func).to.throw(RangeError);
        done();
    });

    it('should not throw error as constructing a room', done => {
        let func = function fn(){new Room(3)};
        expect(func).to.not.throw(RangeError);
        done();
    })
})
