import CryptoJS from 'crypto-js';
import {config} from '../config/config';
import constants from '../config/constants';
import * as twofactor from 'node-2fa'; 
import Crypto from 'node:crypto';

export function add(a: number, b: number): number {
  return a + b;
}

export const otp = (length: number) => {
  const x = (Math.random() * 10).toString();
  return x.slice(2,length+2);
};

export const encryptString = (plainText: string) => {
  return CryptoJS.AES.encrypt(plainText, config.JWT_SECRET).toString();
};

export const decryptString = (cipherText: string) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, config.JWT_SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const oAuthSecret = (email: string, ApplicationName = constants.APPLICATION_AUTH_NAME) => {
  const secret = twofactor.generateSecret({ name: ApplicationName, account: email });
  return secret;
};

export const verifyOAuthCode = (secret: string, code: string) => {
  const isVerify = twofactor.verifyToken(secret, code);
  return isVerify?.delta == 0 ? true : false;
};


export const GenerateRandomString = (length: number) => {
  const result = Crypto.randomBytes(16).toString('base64');
  return result.slice(0, length);
};

export const sortJSON = (array: any, key: string) => {
  return array.sort((a: any, b: any) => {
    const x = a[key]; const y = b[key];
    return ((x > y) ? -1 : ((x < y) ? 1 : 0));
  });
};
 