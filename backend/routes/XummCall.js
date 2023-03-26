import XummSdk from "xumm-sdk";
import dotenv from 'dotenv'
dotenv.config()

const XUMM_API = process.env.XUMM_API
const XUMM_SECRET = process.env.XUMM_SECRET;

const sdk = new XummSdk.XummSdk(XUMM_API, XUMM_SECRET);

export const xummCall = async (payload) => {
    try {
        console.log("pinging..", payload);
        //  const newPayload = await sdk.payload.create(payload, true)
        const data = await sdk.payload.create(payload);
        // console.log("payload: " + JSON.stringify(payload) )

        console.log("data: " + data);
        return data;
    } catch (err) {
        console.log("Error occured during xummCall call" + err);
        return;
    }
}