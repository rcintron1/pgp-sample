const chaiExec = require("@jsdevtools/chai-exec").chaiExecSync;
const {createkeys, encrypt, decrypt} = require('../index.js');
const fs = require('fs')
const md5File = require('md5-file');
const chai = require("chai");
const chaiFiles = require('chai-files');
const { async } = require("@jsdevtools/ez-spawn");
const file = chaiFiles.file;
const expect = chai.expect;

chai.use(chaiExec);
chai.use(chaiFiles);
let myCLI;
let pgpkeys;

describe("Testing the App", async () => {
    const pgpkeys = await createkeys({
        name:"Test User",
        email:"someone@test.com"
    });
    describe("Testing creation of keys", async () => {
        it("should create a public and private key", async ()=>{
            expect(pgpkeys.public).to.contain("BEGIN PGP PUBLIC KEY BLOCK");
            expect(pgpkeys.private).to.contain("BEGIN PGP PRIVATE KEY BLOCK");
        });    
    });
    
    const mpgFile = await fs.readFileSync('orig.mpg');
    const fileForOpenpgpjs = new Uint8Array(mpgFile);
        
    const data = await encrypt(fileForOpenpgpjs, pgpkeys.public );

    describe ("Encrypting an mpg file", async () => {
        // Convert file to a format readable to openpgp
        fs.writeFileSync('orig.mpg.encrypted',data.data);
        it("should write an encrypted file",()=>{
            expect(file('orig.mpg.encrypted')).to.exist;
        })
        it("should be a pgp file",()=>{
            expect(file('orig.mpg.encrypted')).to.contain("-----BEGIN PGP MESSAGE-----")
        })
    });

    const encryptedDataFromFile=fs.readFileSync('orig.mpg.encrypted', 'utf-8')
    const unencryptedFile= await decrypt(encryptedDataFromFile, pgpkeys.private)
    
    fs.writeFileSync("unencrypted.mpg", unencryptedFile.data)

    describe ("Decrypting mpg file", async () => {
        it("should have written an unencryptred file", ()=>{
            expect(file('unencrypted.mpg')).to.exist;
        })
        it("Files should match md5 hash", async () => {
            const origFile = md5File.sync('./orig.mpg')
            const newFile = md5File.sync('./unencrypted.mpg')
            expect(origFile).to.be.a.equal(newFile)
        })
    })
})

after(async ()=>{
    // cleanup();
})

function cleanup(){
    const path = [
        './orig.mpg.encrypted',
        './unencrypted.mpg'
    ];

    try {
        path.forEach(file=>{
            fs.unlinkSync(file)
        });
    } catch(err) {
        console.log(err);
    }
}



