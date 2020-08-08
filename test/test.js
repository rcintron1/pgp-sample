const chaiExec = require("@jsdevtools/chai-exec").chaiExecSync;
const {createkeys, encrypt, decrypt} = require('../index.js');
const fs = require('fs')
const md5File = require('md5-file');
const chai = require("chai");
const chaiFiles = require('chai-files');
const file = chaiFiles.file;
const expect = chai.expect;

chai.use(chaiExec);
chai.use(chaiFiles);
let myCLI;

describe("Testing creation of keys", () => {
    
    it("should create a public and private key", async ()=>{
        const pgpkeys = await createkeys({
            name:"Test User",
            email:"someone@test.com"
        });

        
        expect(pgpkeys.public).to.contain("BEGIN PGP PUBLIC KEY BLOCK");
        expect(pgpkeys.private).to.contain("BEGIN PGP PRIVATE KEY BLOCK");
        fs.writeFileSync('private_key.json',JSON.stringify(pgpkeys.private, null, 2)) 
        fs.writeFileSync('public_key.json',JSON.stringify(pgpkeys.public, null, 2))
        expect()
    });

    it("should exit with a zero exit code", async(done) => {
        myCLI = await chaiExec('npm run-script encrypt');    
        expect(myCLI).to.exit.with.code(0);
        done()
    });

    it("should contain writing encrypted file to disk", (done)=>{
        expect(myCLI).stdout.to.contain("Writing encrypted file to disk")
        done()
    });
    myCLI = chaiExec('npm run-script decrypt');
    it("should exit with a zero exit code", () => {
        expect(myCLI).to.exit.with.code(0);
    });

    it("should contain File Decrypted", ()=>{
        expect(myCLI).stdout.to.contain("File Decrypted");
    });
});



// describe("Testing File pre and post encryption", ()=>{
//     const origFile = md5File.sync('./orig.mpg');
//     const newFile = md5File.sync('./unencrypted.mpg');

//     it("Orignal file and file after process should have the same MD5 Sum", ()=>{
//         expect(origFile).to.be.a.equal(newFile);
//     })
// })
function cleanup(){
    const fs = require('fs');

    const path = [
        './public_key.json',
        './private_key.json',
        './orig.mpg.encrypted',
        './unencrypted.mpg'
    ];

    try {
        path.forEach(file=>{
            fs.unlinkSync(file)
        });
        // fs.unlinkSync(path)
        //file removed
    } catch(err) {
        console.error(err);
    }

}

after(async ()=>{
    cleanup();
})

