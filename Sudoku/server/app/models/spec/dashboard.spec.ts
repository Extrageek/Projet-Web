// import { expect } from "chai";
// import { Dashboard } from "./../dashboard/dashboard";
// import { Activity, Type } from "./../dashboard/activity";

// describe("Dashboard should allow to", () => {
//     let _activity: Activity;

//     it("construct a dashboard correctly", () => {
//         let constructor = () => Dashboard.getInstance();
//         expect(constructor).to.be.deep.equals(Dashboard);
//     });

//     it("get the list of activities correctly", () => {
//         let activities = () => Dashboard.getInstance().activities;
//         expect(activities).to.be.deep.equals(Array<Activity>());
//     });

//     it("add no more than 100 activies", () => {
//         _activity = new Activity(new Date(), Type.GRID_DEMAND, "0");
//         let overMaxIndex = 105;
//         for (let index = 0; index < overMaxIndex; index++) {
//             Dashboard.getInstance().addActivity(_activity);
//             let lenghtArray = () => Dashboard.getInstance().activities.length;
//             expect(lenghtArray).to.be.above(0).and.below(100);
//         }
//     });
// });
