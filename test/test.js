const chaiExec = require("@jsdevtools/chai-exec").chaiExecSync;
const chai = require("chai");

const expect = chai.expect

chai.use(chaiExec);

describe("My CLI", () => {
    let myCLI = chaiExec('ping -c 2 localhost');
    it("should exit with a zero exit code", () => {
        expect(myCLI).to.exit.with.code(0);
    })

    it("should contain icmp_seq", ()=>{
        expect(myCLI).stdout.to.contain("icmp_seq")
    });
});
