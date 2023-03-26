import express from "express";
import xrpl from "xrpl";
import fetch from "node-fetch";
import axios from "axios";
import XrplNFTHelper from "./XrplNFTHelper.js";
import XummSdk from "xumm-sdk";
import FormData from "form-data";
import formidable from "formidable";
import fs from "fs";
import dotenv from 'dotenv'
import { xummCall } from "./XummCall.js";
dotenv.config()

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;
const XUMM_API = process.env.XUMM_API
const XUMM_SECRET = process.env.XUMM_SECRET;

const tempAddr = "rfRZeyG8YfSmKPqdX6PVLFJ5bdPCraDAsA";

const minterAddress = "rQErS3ksic12vcat9HNiPA2Gsdse5i1gb1";
const MINTER_KEY = process.env.MINTER_KEY;

const router = express.Router();


router.route("/mintTickets").post((req, res) => {
  const nftManager = new XrplNFTHelper({
    Account: req.body.metadata.account,
  });

  nftManager.getTicketInfo().then((tickets) => {
    nftManager.mintTickets(tickets, MINTER_KEY).then((nfts) => {
      res.send(nfts);
    });
  });
});

// It will create sequence in the ledger to be filled in a required manner
router.route("/createTickets").post((req, res) => {
  const nftManager = new XrplNFTHelper({
    Account: req.body.metadata.account,
  });

  nftManager.acctInfo().then((info) => {
    const my_sequence = info?.result?.account_data.Sequence;
    let payload = {
      TransactionType: "TicketCreate",
      TicketCount: parseInt(req.body.metadata.TicketCount),
      Account: req.body.metadata.account,
      Sequence: my_sequence,
    };
    console.log("payload", payload)
    try {
      xummCall(payload).then((xummInfo) => {
        let response = JSON.stringify(xummInfo);
        console.log("create tickets", response, xummInfo)

        res.send(response);
      });
    } catch (error) {
      console.log(error);
    }
  })


});

router.route("/xummCancelOffer").post((req, res) => {
  let offers = [];

  offers.push(req.body.metadata.offerID);

  let payload = {
    TransactionType: "NFTokenCancelOffer",
    NFTokenOffers: offers,
  };

  try {
    let result = xummCall(payload).then((xummInfo) => {
      let response = JSON.stringify(xummInfo);

      res.send(response);
    });
  } catch (error) {
    console.log(error);
  }
});

router.route("/xummAcceptOffer").post((req, res) => {
  let payload = {
    TransactionType: "NFTokenAcceptOffer",
    NFTokenSellOffer: req.body.metadata.NFTokenSellOffer,
  };

  try {
    xummCall(payload).then((xummInfo) => {
      let response = JSON.stringify(xummInfo);

      res.send(response);
    });
  } catch (error) {
    console.log(error);
  }
});

router.route("/xummCreateBuyOffer").post((req, res) => {
  let payload = {
    TransactionType: "NFTokenCreateOffer",
    Owner: req.body.metadata.owner,
    NFTokenID: req.body.metadata.NFTokenID,
    Amount: req.body.metadata.Amount,
  };

  try {
    xummCall(payload).then((xummInfo) => {
      let response = JSON.stringify(xummInfo);
      res.send(response);
    });
  } catch (error) {
    console.log(error);
  }
});

router.route("/xummCreateSellOffer").post((req, res) => {
  let payload = {
    TransactionType: "NFTokenCreateOffer",
    NFTokenID: req.body.metadata.NFTokenID,
    Amount: req.body.metadata.Amount,
    Flags: 1,
  };

  try {
    xummCall(payload).then((xummInfo) => {
      let response = JSON.stringify(xummInfo);

      res.send(response);
    });
  } catch (error) {
    console.log(error);
  }
});

router.route("/xummMint").post((req, res) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  console.log("req.body.", req, res);

  axios
    .post(url, req.body, {
      headers: {
        "Content-Type": `application/json; boundary= ${req.body.metadata._boundary}`,
        pinata_api_key: PINATA_API_KEY,
        PINATA_SECRET_API_KEY: PINATA_SECRET_API_KEY,
      },
    })
    .then(function (ipfsData) {
      let payload = {
        TransactionType: "NFTokenMint",
        URI: xrpl.convertStringToHex(
          `https://gateway.pinata.cloud/ipfs/${ipfsData.data.IpfsHash}`
        ),
        Flags: 8,
        NFTokenTaxon: 1111,
        Memos: [
          {
            MemoType: xrpl.convertStringToHex("https://bit.lo/5555"),
            MemoData: xrpl.convertStringToHex("t-shirt-1"),
          },
        ],
      };

      try {
        xummCall(payload).then((xummInfo) => {
          let response = JSON.stringify(xummInfo);

          res.end(response);
        });
      } catch (error) {
        console.log(error);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
});
router.route("/xummMintV1").post((req, res) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    console.log("fields: ", fields);
    console.log("files: ", files);
    const formData = new FormData();

    const metadata = JSON.stringify({
      name: fields?.filename,
      keyvalues: {
        date: fields?.date,
        description: fields?.description,
        location: fields?.location,
      },
    });
    const MemoDataNft = [
      {
        "Memo": {
          MemoType: xrpl.convertStringToHex("name"),
          MemoData: xrpl.convertStringToHex(fields?.filename),
        }
      }
      ,
      {
        "Memo": {
          MemoType: xrpl.convertStringToHex("date"),
          MemoData: xrpl.convertStringToHex(fields?.date),
        }
      },
      {
        "Memo": {
          MemoType: xrpl.convertStringToHex("description"),
          MemoData: xrpl.convertStringToHex(fields?.description),
        }
      },
      {
        "Memo": {
          MemoType: xrpl.convertStringToHex("location"),
          MemoData: xrpl.convertStringToHex(fields?.location),
        }
      }
    ]
    formData.append("pinataMetadata", metadata);
    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("file", fs.createReadStream(files?.file?.filepath));
    formData.append("pinataOptions", options);
    console.log("formData", formData);
    // res.send({ success: true });

    axios
      .post(url, formData, {
        maxBodyLength: "Infinity",
        headers: {
          // 'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          "Content-Type": `multipart/form-data; boundary=${formData?._boundary}`,
          // "Content-Type": `application/json; boundary= ${req.body.metadata._boundary}`,
          pinata_api_key: PINATA_API_KEY,
          PINATA_SECRET_API_KEY: PINATA_SECRET_API_KEY,
        },
      })
      .then(function (ipfsData) {
        let payload = {
          TransactionType: "NFTokenMint",
          URI: xrpl.convertStringToHex(
            `https://gateway.pinata.cloud/ipfs/${ipfsData.data.IpfsHash}`
          ),
          Flags: 8,
          NFTokenTaxon: 1111,
          Memos: MemoDataNft,
        };

        try {
          xummCall(payload).then((xummInfo) => {
            let response = JSON.stringify(xummInfo);

            res.end(response);
          });
        } catch (error) {
          console.log(error);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  });
});
router.route("/xummMintV2").post((req, res) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    console.log("fields: ", fields);
    console.log("files: ", files);
    const formData = new FormData();
    const MemoDataNft = [
      {
        "Memo": {
          MemoType: xrpl.convertStringToHex("name"),
          MemoData: xrpl.convertStringToHex(fields?.name),
        }
      }
      ,
      {
        "Memo": {
          MemoType: xrpl.convertStringToHex("date"),
          MemoData: xrpl.convertStringToHex(fields?.date),
        }
      },
      {
        "Memo": {
          MemoType: xrpl.convertStringToHex("description"),
          MemoData: xrpl.convertStringToHex(fields?.description),
        }
      },
      {
        "Memo": {
          MemoType: xrpl.convertStringToHex("location"),
          MemoData: xrpl.convertStringToHex(fields?.location),
        }
      }
    ]
    const file_buffer = fs.readFileSync(files?.file?.filepath);
    //encode contents into base64
    const contents_in_base64 = file_buffer.toString('base64');
    var data = JSON.stringify({
      pinataOptions: {
        cidVersion: 1,
      },
      pinataMetadata: {
        name: fields?.name,
        keyvalues: {
          date: fields?.date,
        },
      },
      pinataContent: {
        file: contents_in_base64,
        eventLink: fields?.location,
        description: fields?.description,
        date: fields?.date,
        name: fields?.name,
      }
    })
    console.log(data)

    axios
      .post(url, data, {
        headers: {
          // 'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          'Content-Type': 'application/json',
          // "Content-Type": `application/json; boundary= ${req.body.metadata._boundary}`,
          pinata_api_key: PINATA_API_KEY,
          PINATA_SECRET_API_KEY: PINATA_SECRET_API_KEY,
        },
      })
      .then(function (ipfsData) {
        let payload = {
          TransactionType: "NFTokenMint",
          URI: xrpl.convertStringToHex(
            `https://gateway.pinata.cloud/ipfs/${ipfsData.data.IpfsHash}`
          ),
          Flags: 8,
          NFTokenTaxon: 1111,
          Memos: MemoDataNft,
        };

        try {
          xummCall(payload).then((xummInfo) => {
            let response = JSON.stringify(xummInfo);

            res.end(response);
          });
        } catch (error) {
          console.log(error);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  });
});

router.route("/xummBurn").post((req, res) => {
  let payload = {
    TransactionType: "NFTokenBurn",
    NFTokenID: req.body.metadata.NFTokenID,
  };

  try {
    xummCall(payload).then((xummInfo) => {
      let response = JSON.stringify(xummInfo);

      res.send(response);
    });
  } catch (error) {
    console.log(error);
  }
});

/* Get all NFT's from ledger.

Returns:
Array of NFTokenID strings that currently exist on the ledger

*/
router.route("/getTokenInfo").post((req, res) => {
  console.log("req.body.metadata.account", req.body);
  const nftManager = new XrplNFTHelper({
    Account: req.body.metadata.account,
  });
  console.log("nftManager", nftManager);

  nftManager
    .getTokenInfo(req.body.metadata.nft_id)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      console.log("error =>", error);
      res.send(error);
    });
});

/* Get all NFT's from ledger.

Returns:
Array of NFTokenID strings that currently exist on the ledger

*/
router.route("/getTokensFromLedger").post((req, res) => {
  console.log("req.body.metadata.account", req.body);
  const nftManager = new XrplNFTHelper({
    Account: req.body.metadata.account,
  });
  console.log("nftManager", nftManager);

  nftManager
    .getTokensFromLedger()
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      console.log("error =>", error);
      res.send(error);
    });
});

router.route("/getPayloadInfo").get((req, res) => {
  let body = JSON.parse(req.headers.body);

  const url = `https://xumm.app/api/v1/platform/payload/${body.uuid}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "X-API-Key": XUMM_API,
      "X-API-Secret": XUMM_SECRET,
    },
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => res.send(json))
    .catch((err) => console.error("error:" + err));
});

router.route("/account_info").post((req, res) => {
  const nftManager = new XrplNFTHelper({
    Account: req.body.metadata.account,
  });
  nftManager.acctInfo().then((info) => {
    let response = JSON.stringify(info);
    res.send(response);
  });
});

router.route("/ticket_info").post((req, res) => {
  const nftManager = new XrplNFTHelper({
    Account: req.body.metadata.account,
  });
  console.log("nftManager", nftManager)
  nftManager.getTicketInfo().then((info) => {
    let response = JSON.stringify(info);
    console.log("response", response)
    res.send(response);
  });
});

export default router;
