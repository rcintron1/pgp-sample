const openpgp = require('openpgp');

const createkeys = async ({name, email, passphrase}) => {

    const { privateKeyArmored, publicKeyArmored, revocationCertificate } = await openpgp.generateKey({
        userIds: [{ name: process.env.NAME, email: process.env.EMAIL }], // you can pass multiple user IDs
        curve: 'ed25519',                                           // ECC curve name
        // passphrase: 'super long and hard to guess secret'           // protects the private key
    });

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

const decrypt = async (data, privateKey) => {
    const privKeyObj = (await openpgp.key.readArmored(privateKey)).keys[0]
    
    const options = {
        message: await openpgp.message.readArmored(data),
        privateKeys: [privKeyObj],
        format: 'binary'
    }

    const response = await openpgp.decrypt(options)
    return response
}

module.exports = {decrypt, encrypt,createkeys}

