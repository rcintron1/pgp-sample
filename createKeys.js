const openpgp = require('openpgp');
const fs = require('fs');
require('dotenv').config()

const getPGPkey = async () => {
    const { privateKeyArmored, publicKeyArmored, revocationCertificate } = await openpgp.generateKey({
        userIds: [{ name: process.env.NAME, email: process.env.EMAIL }], // you can pass multiple user IDs
        curve: 'ed25519',                                           // ECC curve name
        // passphrase: 'super long and hard to guess secret'           // protects the private key
    });

    return {public:publicKeyArmored, private:privateKeyArmored}
}

const writeKey = (key)=>{
    console.log("writing keys")
    fs.writeFileSync('private_key.json',JSON.stringify(key.private, null, 2)) 
    fs.writeFileSync('public_key.json',JSON.stringify(key.public, null, 2)) 
}

getPGPkey().then(writeKey)