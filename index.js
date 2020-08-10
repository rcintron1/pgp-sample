const openpgp = require('openpgp');

const createkeys = async ({name, email, passphrase}) => {
    const params = {
        userIds: [{ name: name, email: email }], // you can pass multiple user IDs
        curve: 'ed25519',                                           // ECC curve name
        passphrase: passphrase           // protects the private key
    }
    
    const { privateKeyArmored, publicKeyArmored, revocationCertificate } = await openpgp.generateKey(params);

    return {public:publicKeyArmored, private:privateKeyArmored}
}
const encrypt = async (data, publicKey) =>{
    // console.log(publicKey)
    const message = openpgp.message.fromBinary(data)
    // console.log((await openpgp.key.readArmored(publicKey)).keys)
    const options = {
        message: message,
        publicKeys: (await openpgp.key.readArmored(publicKey)).keys,
    }

    const response = await openpgp.encrypt(options)
    return response
}

const decrypt = async (data, privateKey, passphrase) => {
    const privKeyObj = (await openpgp.key.readArmored(privateKey).catch(()=> console.log)).keys[0]
    let message
    if (passphrase){
        try {
            privKeyObj.decrypt(passphrase).catch((e)=>{});
        }catch(err){
            throw err
        }

    }
    message = await openpgp.message.readArmored(data).catch(()=> console.log)
    const options = {
        message: message,
        privateKeys: [privKeyObj],
        format: 'binary'
    }
    
    const response = await openpgp.decrypt(options)
    
    return response
}

module.exports = {decrypt, encrypt,createkeys}

