const openpgp = require('openpgp')
const publicKey = require('./public_key.json')
const privateKey = require('./private_key.json')

const fs = require("fs")
const encrypt = async (data) =>{
    
    const options = {
        message: data,
        publicKeys: (await openpgp.key.readArmored(publicKey)).keys,
    }

    const response = await openpgp.encrypt(options)
    return response
}
const decrypt = async (data) => {
    const privKeyObj = (await openpgp.key.readArmored(privateKey)).keys[0]
    
    const options = {
        message: await openpgp.message.readArmored(data.data),
        publicKeys: (await openpgp.key.readArmored(publicKey)).keys,
        privateKeys: [privKeyObj],
        format: 'binary'
    }

    const response = await openpgp.decrypt(options)
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
    
    fs.writeFileSync('orig.mpg.encrypted',data.data)


    /**
     * Decrypting
     */
    const encrypted_data_from_file=fs.readFileSync('orig.mpg.encrypted', 'utf-8')
    const unencryptedFile= await decrypt({data:encrypted_data_from_file})
    // openpgp.message.
    fs.writeFileSync("unencrypted.mpg", unencryptedFile.data)
})()