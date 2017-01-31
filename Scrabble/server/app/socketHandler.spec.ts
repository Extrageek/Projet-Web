import { expect } from "chai";
import * as http from "http";
import { IoConnection } from "./socketHandler";

describe("create socket handler", () => {

    let httpServer = http.createServer();
    httpServer.listen(3002);

    it("should create socketHandler", () => {
        let socketHandler = new IoConnection(httpServer);
        expect(socketHandler).to.be.instanceof(IoConnection);
    });

    it("should not create socketHandler", () => {
        expect(IoConnection.bind(null)).to.throw(Error);
    });
});
