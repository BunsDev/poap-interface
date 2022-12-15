// Next.js API route support: https://nextjs.org/docs/api-routes/introduction


const { recoverAddress } = require('ethers').utils;
import { ethers } from 'ethers';

let pubKey = '0xcE4cD6a9A8076e107828eBAC42b8a8a73124fa53';
let msg = "sample"

export default function handler(req, res) {
    // The hash that was signed
    const hash = ethers.utils.hashMessage(msg);

    // The signature of the hash (in the format "0x${signature}")
    const signature = req.body.sig;;

    // Get the public address that created the signature
    const address = recoverAddress(hash, signature);

    console.log(`The public address that created the signature is: ${address}`);
    console.log(pubKey == address);
    res.status(200).json({ name: 'John Doe' })
}
