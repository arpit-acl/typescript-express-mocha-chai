
import {expect} from 'chai'
import  {add}  from '../../helpers/utils.helper';


describe('add function', () => {
    it('should return the sum of two numbers', () => {
        const result = add(3, 5);
        expect(result).to.equal(8); // Assertion using Chai's expect
    });

    it('should return 0 if both numbers are 0', () => {
        const result = add(0, 0);
        expect(result).to.equal(0);
    });

    it('should return the number itself if added to 0', () => {
        const result1 = add(5, 0);
        const result2 = add(0, 10);
        expect(result1).to.equal(5);
        expect(result2).to.equal(10);
    });
});