import { expect } from "chai";

 import { UserSettingsService } from "./userSettingService";

 let service : UserSettingsService;

describe("User settings test properties", () => {

    beforeEach(() => {
        service = new UserSettingsService();
    });

    it("should return the correct username", () => {
        expect(service.userName).to.be.undefined;
        service.userName = "david";
        expect(service.userName).to.equal("david");
    });

    it("should set the correct username", () => {
        let usernameStub : string;
        expect(service.userName).to.be.undefined;
        service.userName = "david";
        usernameStub = service.userName;
        expect(usernameStub).to.equal("david");
    });
});


