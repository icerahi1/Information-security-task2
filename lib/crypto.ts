import CryptoJS from "crypto-js";

// Transforms string key to exact bit length (128/192/256) via hashing
const processKey = (key: string, bitLength: number) => {
  const hash = CryptoJS.SHA256(key);
  return CryptoJS.lib.WordArray.create(hash.words, bitLength / 32);
};

export const processData = (
  text: string,
  keyStr: string,
  operation: "Encrypt" | "Decrypt",
  mode: string,
  keySize: number,
) => {
  const key = processKey(keyStr, keySize);
  const cryptoMode = (CryptoJS.mode as any)[mode];

  if (operation === "Encrypt") {
    const iv = CryptoJS.lib.WordArray.random(16);
    const options = {
      mode: cryptoMode,
      padding: CryptoJS.pad.Pkcs7,
      iv: mode !== "ECB" ? iv : undefined,
    };
    const encrypted = CryptoJS.AES.encrypt(text, key, options);
    return mode === "ECB"
      ? encrypted.toString()
      : `${iv.toString()}:${encrypted.toString()}`;
  } else {
    let ciphertext = text;
    let iv = undefined;
    if (mode !== "ECB") {
      const parts = text.split(":");
      if (parts.length !== 2)
        throw new Error("Invalid ciphertext format for this mode.");
      iv = CryptoJS.enc.Hex.parse(parts[0]);
      ciphertext = parts[1];
    }
    const options = { mode: cryptoMode, padding: CryptoJS.pad.Pkcs7, iv };
    const decrypted = CryptoJS.AES.decrypt(ciphertext, key, options);
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
};
