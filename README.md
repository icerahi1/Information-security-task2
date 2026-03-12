# AES Encryption Homework

Here is my web app to encrypt and decrypt files using AES.

## What is AES?

AES is a block cipher. It does not encrypt one letter at a time. It takes your text and cuts it into blocks of exactly 128 bits. Then it scrambles the data in steps called "rounds". The number of rounds changes based on the key size.

## Key Sizes

* **AES-128:** Has 10 rounds. It is fast and secure for normal things.
* **AES-192:** Has 12 rounds. Better security.
* **AES-256:** Has 14 rounds. This is the most secure one, very hard to break.

## Modes of Operation

* **ECB:** Encrypts every block alone. It is simple but bad for security because repeating text makes repeating patterns.
* **CBC:** Mixes each block with the last encrypted block. We use an IV (Initialization Vector) for the first block so the result is always different and safe.
* **CFB:** Works like a stream cipher instead of blocks. It also needs an IV to work safely.

## Key Handling

The AES library needs the secret key to be exactly 128, 192, or 256 bits. If a user types a password like "cat", it will fail. So, my code takes the password, hashes it with SHA-256, and then cuts it to the exact bit size we selected.


