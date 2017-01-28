import { assert } from 'chai';
import { Cell } from './cell';

describe('Cell tester', () => {
    it('should be hidden and contain "1, 2, 3"', done => {
        let cell1 = new Cell([3, 2, 1], true);
        assert(cell1.isHidden === true);
        assert(cell1.numbers.toString() === [1, 2, 3].toString());

        done();
    });

    it('should not be hidden and contain "1, 2, 3"', done => {
        let cell2 = new Cell([3, 2, 1], false);
        assert(cell2.isHidden === false);
        assert(cell2.numbers.toString() === [1, 2, 3].toString());
        cell2.addNumber(3);
        assert(cell2.numbers.toString() === [1, 2, 3].toString());

        done();
    });

     it('should be hidden and contain "1, 2, 3, 4"', done => {
        let cell3 = new Cell([4, 2, 1], false);
        assert(cell3.isHidden === false);
        assert(cell3.numbers.toString() === [1, 2, 3].toString());
        cell3.addNumber(4);

        assert(cell3.numbers.toString() === [1, 2, 3, 4].toString());

        done();
    });
});
