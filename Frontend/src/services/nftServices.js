import React from 'react';
import api from '../services';
import { hex_to_ascii } from '../common-functions';

const activateSearch = async (accountAddress) => {
    let body = {
        account: accountAddress,
    };
    try {
        const res = await api.post("/api/getTokensFromLedger", { metadata: body });
        let decodedData = [];
        console.log("res", res)
        if (res?.data) {
            res?.data?.forEach((nft, index) => {
                nft.Src = hex_to_ascii(nft?.URI);
                decodedData.push({
                    name: `Test NFT #${index}`,
                    description:
                        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                    src: hex_to_ascii(nft?.URI),
                });
            });
            // https://ipfs.io/ipfs/cid
            localStorage.setItem("exploreListXrpl", JSON.stringify(decodedData));
            localStorage.setItem(
                "searchResults",
                JSON.stringify({ results: res?.data, showButtons: true })
            );
            return [decodedData, { results: res?.data, showButtons: true }]
        } else {
            return [[], { results: [], showButtons: true }]
        }
    } catch (error) {
        console.log("error", error);
        return [[], { results: [], showButtons: true }]
    }
}

export { activateSearch };