const chaiExec = require("@jsdevtools/chai-exec").chaiExecSync;
const md5File = require('md5-file')
const chai = require("chai");
const expect = chai.expect

chai.use(chaiExec);

describe("Testing creating PGP Keys", () => {
    let myCLI = chaiExec('npm run-script createkeys');
    it("should exit with a zero exit code", () => {
        expect(myCLI).to.exit.with.code(0);
    })

    it("should contain writing keys", ()=>{
        expect(myCLI).stdout.to.contain("writing keys")
    });
});

describe("Testing encrypting binary file", () => {
    let myCLI = chaiExec('npm run-script encrypt');
    it("should exit with a zero exit code", () => {
        expect(myCLI).to.exit.with.code(0);
    })

    it("should contain writing encrypted file to disk", ()=>{
        expect(myCLI).stdout.to.contain("Writing encrypted file to disk")
    });
});
describe("Testing decrypting binary file", () => {
    let myCLI = chaiExec('npm run-script decrypt');
    it("should exit with a zero exit code", () => {
        expect(myCLI).to.exit.with.code(0);
    })

    it("should contain File Decrypted", ()=>{
        expect(myCLI).stdout.to.contain("File Decrypted")
    });
});

describe("Testing File pre and post encryption", ()=>{
    const origFile = md5File.sync('./orig.mpg')
    const newFile = md5File.sync('./unencrypted.mpg')

    it("Orignal file and file after process should have the same MD5 Sum", ()=>{
        expect(origFile).to.be.a.equal(newFile);
    })
})
function cleanup(){
    const fs = require('fs')

    const path = ['./public_key.json','./private_key.json','./orig.mpg.encrypted', './unencrypted.mpg']

    try {
        path.forEach(file=>{
            fs.unlinkSync(file)
        })
        // fs.unlinkSync(path)
        //file removed
    } catch(err) {
        console.error(err)
    }

}
cleanup()
