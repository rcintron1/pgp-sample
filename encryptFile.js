const openpgp = require('openpgp')
const publicKey = require('./public_key.json')


const fs = require("fs")
const encrypt = async (data) =>{
    
    const options = {
        message: data,
        publicKeys: (await openpgp.key.readArmored(publicKey)).keys,
    }

    const response = await openpgp.encrypt(options)
    return response
}
(async ()=>{
    /**
     * Encrypting
     */

    const file = await fs.readFileSync('orig.mpg');
    const fileForOpenpgpjs = new Uint8Array(file);

    const message = openpgp.message.fromBinary(fileForOpenpgpjs)

    const data = await encrypt(message)
    console.log("Writing encrypted file to disk")
    fs.writeFileSync('orig.mpg.encrypted',data.data)
    
})()