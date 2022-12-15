// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ethers } from "ethers"

let msg = "sample"

export default function handler(req, res) {
    const msgHash = ethers.utils.hashMessage(msg);
    res.status(200).json({ hash: msgHash });
}
