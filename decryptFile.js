const openpgp = require('openpgp')
const privateKey = require('./private_key.json')

const fs = require("fs")

const decrypt = async (data) => {
    const privKeyObj = (await openpgp.key.readArmored(privateKey)).keys[0]
    
    const options = {
        message: await openpgp.message.readArmored(data.data),
        privateKeys: [privKeyObj],
        format: 'binary'
    }

    const response = await openpgp.decrypt(options)
    return response
}
(async ()=>{
    /**
     * Decrypting file
     */
    const encrypted_data_from_file=fs.readFileSync('orig.mpg.encrypted', 'utf-8')
    const unencryptedFile= await decrypt({data:encrypted_data_from_file})
    // openpgp.message.
    fs.writeFileSync("unencrypted.mpg", unencryptedFile.data)
    console.log("File Decrypted")
})()