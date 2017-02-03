// import { ObjectCreaterService } from './object-creater.service';
// import { assert, expect } from 'chai';
// describe('ObjectCreaterService', function () {
//     let service: ObjectCreaterService;

//     beforeEach(() => {
//         chai.config.includeStack = true;
//     });

//     beforeEach(() => {
//         service = new ObjectCreaterService();
//     });

//     it('should return a valid Object3D', done => {
//         service.createArena()
//                 .then(obj => {expect(obj).to.not.be.undefined.and.to.be.a('Object3D');
//                 })
//                 .catch(x => {assert.fail(x);
//                 })
//                 .then(x => {done();
//                 });
//     });
// });

// describe('A failure', () => {
//     it('should always fail', done => {
//         let x = expect(true).to.be.false;
//         done();
//     });

//     // Comment the catch clause to see an ugly stacktrace :)
//     it('should print an ugly stacktrace if we do not handle exceptions', done => {
//         Promise.reject('Failed for unknown reasons.').then(x => {
//             expect('Something that will never occur');
//             done();
//         });
//     });
// });
