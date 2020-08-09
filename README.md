<a href="http://fvcproductions.com"><img src="pgp.png" title="FVCproductions" alt="FVCproductions"></a>

# pgp-sample
## Introduction
I found it difficult to find a sample use of PGP encryption using a binary file that I can use fairly quickly.  Well, after some headaches, I wrote my own.

I hope this repo will assist in figuring out how to encrypt and decrypt a binary file

## Contents
- Code to create keys without passphrase
- Code to create keys with passphrase
- Simple sample that encrypts and decrypts an mpg file
- A module you can import and use to easily encrypt and decrypt files (or text)

## Instructions
_Note that this repo is to serve as reference material and not actual code you would import._

You can run `npm test` to verify that all is working as expected.

To create sample PGP keys, run `npm run-script createkeys`. This will actually run node createKeys.js. This will create two files on your folder: 
- `private_key.json`
- `public_key.json`

To use your public key to encrypt an mpg (in this example, it's orig.mpg), run `npm run-script encrypt`. This will run node encryptFile.js. It should produce a file called orig.mpg.encrypted.
If you take a look at the file, it will be text starting with:
```
-----BEGIN PGP MESSAGE-----
Version: OpenPGP.js v4.10.7
Comment: https://openpgpjs.org
```

This is the mpg file encrypted with the public PGP key.

Finally, to decrypt the file, run `npm run-script decrypt`. This will run `node decryptFile.js`. This will produce a new file called `unencrypted.mpg`.  You can visually check to see that the files are exactly the same.
To verify that the files are exactly the same, I added a test that checks the md5 Hash of the files. Generally speaking, md5 hash is a great way to check that the files are exactly the same.