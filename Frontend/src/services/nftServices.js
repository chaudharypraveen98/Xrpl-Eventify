import React from 'react';
import api from '../services';
import { hex_to_ascii, mimeTypeMapping } from '../common-functions';
import axios from 'axios';

const getNftMetaData = async (nfts) => {
    console.log("nfts", nfts)
    const fetchedData = []
    nfts?.forEach(async (nft) => {
        const nftUrl = hex_to_ascii(nft?.URI)
        const { data: metaData } = await axios.get(nftUrl);
        const imageExt = metaData?.name?.split(".")[1]
        const contentType = imageExt in mimeTypeMapping ? mimeTypeMapping[imageExt] : "image/png";
        console.log("metaData", metaData)
        fetchedData.push({
            name: metaData?.name,
            description: metaData?.description,
            src: `data:${contentType};base64,${metaData?.file}`,
            eventLink: metaData?.eventLink,
            date: metaData?.date
        })
        localStorage.setItem("exploreListXrpl", JSON.stringify(fetchedData));
    })
    console.log("fetchedData2", fetchedData)
    // localStorage.setItem("exploreListXrpl", JSON.stringify(fetchedData));

}

const activateSearch = async (accountAddress) => {
    let body = {
        account: accountAddress,
    };
    try {
        const res = await api.post("/api/getTokensFromLedger", { metadata: body });
        console.log("fetched from ledger", res)
        if (res?.data) {
            // https://ipfs.io/ipfs/cid
            localStorage.setItem(
                "searchResults",
                JSON.stringify({ results: res?.data, showButtons: true })
            );

            return res?.data
        } else {
            return []
        }
    } catch (error) {
        console.log("error", error);
        return []
    }
}

export { activateSearch, getNftMetaData };