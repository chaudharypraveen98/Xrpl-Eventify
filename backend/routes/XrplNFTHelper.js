import xrpl from "xrpl";

export class XrplNFTHelper {
  constructor(details) {
    this.transactionDetails = details;
    // this.clientDetails = "wss://xrplcluster.com/:51233"; //nft-devnet *Change as needed
    // this.clientDetails = "wss://s.devnet.rippletest.net/:51233"
    this.clientDetails = "wss://s.altnet.rippletest.net:51233";
    this.connectionTimeout = 15000
  }

  /* Mint Single token

* @Params (required)
-TransactionType: this.transactionDetails.TransactionType,
-Account: this.transactionDetails.Account,
-URI: this.transactionDetails.URI,
-Flags: this.transactionDetails.Flags,
 -NFTokenTaxon: this.transactionDetails.NFTokenTaxon,
 
@returns array of NFTokenID strings
* @returns NFTokenID string
*/
  async mintToken() {
    try {
      const wallet = xrpl.Wallet.fromSeed(this.transactionDetails.Secret); //secret
      const client = new xrpl.Client(this.clientDetails);
      await client.connect();
      console.log("Connected to server..minting single token.");

      const transactionData = {
        TransactionType: this.transactionDetails.TransactionType,
        Account: this.transactionDetails.Account,
        URI: this.transactionDetails.URI,
        Flags: this.transactionDetails.Flags,
        NFTokenTaxon: this.transactionDetails.NFTokenTaxon,
      };

      //submit minting transaction
      const tx = await client.submitAndWait(transactionData, { wallet });

      const result = await client.request({
        method: "account_nfts",
        account: this.transactionDetails.Account,
      });

      return result?.result?.account_nfts[
        result.result?.account_nfts?.length - 1
      ].NFTokenID;
    } catch (err) {
      console.log("Error occured during minToken() call" + err);
      return;
    }
  }

  async mintTickets(tickets, MINTER_KEY) {
    const client = new xrpl.Client("wss://xrplcluster.com/:51233");
    const wallet = xrpl.Wallet.fromSeed(MINTER_KEY);

    await client.connect();

    let ticketArr = [];

    for (let i = 0; i < tickets.length; i++) {
      ticketArr[i] = tickets[i].TicketSequence;
    }

    for (let i = 0; i < ticketArr.length; i++) {
      const transactionBlob = {
        TransactionType: "NFTokenMint",
        Account: wallet.classicAddress,
        URI: xrpl.convertStringToHex("www.testing.com"),
        Flags: 8,
        Sequence: 0,
        TicketSequence: ticketArr[i],
        NFTokenTaxon: 6666,
      };

      console.log("Minting " + ticketArr[i]);
      const tx = client.submit(transactionBlob, { wallet: wallet });
    }

    let nfts = await client.request({
      method: "account_nfts",
      account: this.transactionDetails.Account,
    });

    return nfts;
  }

  // https://xrpl.org/batch-minting.html
  async batchX() {
    try {
      const client = new xrpl.Client(this.clientDetails);
      const wallet = xrpl.Wallet.fromSeed(this.transactionDetails.Secret); //secret

      await client.connect();

      const nftokenCount = this.transactionDetails.Memos.numberOfTokens;

      const account_info = await client.request({
        command: "account_info",
        account: wallet.classicAddress,
      });

      let my_sequence = account_info.result.account_data.Sequence;
      const ticketTransaction = await client.autofill({
        TransactionType: "TicketCreate",
        Account: wallet.classicAddress,
        TicketCount: nftokenCount,
        Sequence: my_sequence,
      });

      const signedTransaction = wallet.sign(ticketTransaction);
      const tx = await client.submitAndWait(signedTransaction.tx_blob);

      let response = await client.request({
        command: "account_objects",
        account: wallet.classicAddress,
        type: "ticket",
      });

      let tickets = [];

      for (let i = 0; i < nftokenCount; i++) {
        tickets[i] = response.result.account_objects[i]?.TicketSequence;
      }
      console.log("Tickets generated, minting NFTokens.");

      for (let i = 0; i < nftokenCount; i++) {
        const transactionBlob = {
          TransactionType: "NFTokenMint",
          Account: wallet.classicAddress,
          URI: this.transactionDetails.URI,
          Flags: this.transactionDetails.Flags,
          Sequence: 0,
          TicketSequence: tickets[i],
          NFTokenTaxon: 5555,
        };

        const tx = client.submit(transactionBlob, { wallet: wallet });
        console.log("nft transaction->", tx, "nft ->", i)

      }
      let nfts = await client.request({
        method: "account_nfts",
        account: wallet.classicAddress,
        limit: 400,
      });

      // continuing from the last fetched nft
      for (let i = 0; i <= nftokenCount; i++) {
        nfts = await client.request({
          method: "account_nfts",
          account: wallet.classicAddress,
          limit: 400,
          marker: nfts.result.marker,
        });
      }
      console.log("retrieved all the nfts", nfts)

      return nfts.result.account_nfts;
    } catch (err) {
      console.log("Error occured during batchX() call" + err);
      console.log(err.data);
      return;
    }
  }

  /*getTokens
   *
   *@returns array of NFTokenID's
   */
  async getTokensFromLedger() {
    try {
      const client = new xrpl.Client(this.clientDetails, {
        connectionTimeout: this.connectionTimeout,
      });
      try {
        await client.connect();
      } catch (error) {
        console.log("error generated while connecting", error);
      }

      console.log("Connected to Sandbox..getting all NFT's.****");

      let nfts = await client.request({
        method: "account_nfts",
        account: this.transactionDetails.Account,
      });

      await client.disconnect();
      console.log("disconnecting", nfts.result);

      return nfts.result.account_nfts;
    } catch (err) {
      console.log("Error occured during getTokens() call" + err);
      return;
    }
  }

  /*getTokenInfo
   *
   *@returns array of NFTokenID's
   */
  async getTokenInfo(nftId) {
    try {
      const client = new xrpl.Client(this.clientDetails, {
        connectionTimeout: this.connectionTimeout,
      });
      try {
        await client.connect();
      } catch (error) {
        console.log("error generated while connecting", error);
      }

      console.log("Connected to Sandbox..getting all NFT's.****");
      console.log(
        nftId
          ? nftId
          : "000B0000651065175AAE92CB223CA1B9DF5850E00F9487F95B9749C800000004"
      );

      let nfts = await client.request({
        method: "nft_info",
        nft_id: nftId
          ? nftId
          : "000B0000651065175AAE92CB223CA1B9DF5850E00F9487F95B9749C800000004",
      });

      await client.disconnect();
      console.log("disconnecting", nfts.result);

      return nfts.result;
    } catch (err) {
      console.log("Error occured during getTokens() call" + err);
      return;
    }
  }
  catch(error) {
    console.log("error while get transactions", error);
    return error;
  }
  /* Burn specified NFT
* Params (required): 
          - TransactionType: this.transactionDetails.TransactionType,
          - Account: this.transactionDetails.Account,
          - NFTokenID: this.transactionDetails.NFTokenID
 
  Returns: Transaction Result string.
*
*/
  async burnNFT() {
    try {
      const wallet = xrpl.Wallet.fromSeed(this.transactionDetails.Secret);
      const client = new xrpl.Client(this.clientDetails, {
        connectionTimeout: this.connectionTimeout,
      });
      await client.connect();

      console.log("Connected to Sandbox..burning single NFT.");

      const transactionData = {
        TransactionType: this.transactionDetails.TransactionType,
        Account: this.transactionDetails.Account,
        NFTokenID: this.transactionDetails.NFTokenID,
      };

      const tx = await client.submitAndWait(transactionData, { wallet });

      client.disconnect();
      return tx.result.meta.TransactionResult;
    } catch (err) {
      console.log("Error occured during minToken() call" + err);
      return;
    }
  }

  /*Burn all NFTs in the account

Params (required): 
- transactionDetails.Secret
- transactionDetails.Account

Returns: 
Array of NFTokenID's for removal of metadata storage


*/

  async burnAllNFT() {
    try {
      const wallet = xrpl.Wallet.fromSeed(this.transactionDetails.Secret);
      const client = new xrpl.Client(this.clientDetails);
      await client.connect();

      console.log(
        "Connected to Sandbox..burning ALL NFT's for specified account."
      );

      let nfts = await client.request({
        method: "account_nfts",
        account: this.transactionDetails.Account,
      });

      console.log(
        "Attempting to burn " + nfts.result.account_nfts.length + " NFT's.."
      );

      for (let index = 0; index < nfts.result.account_nfts.length; index++) {
        const transactionData = {
          TransactionType: this.transactionDetails.TransactionType,
          Account: this.transactionDetails.Account,
          NFTokenID: nfts.result.account_nfts[index].NFTokenID,
        };

        const tx = await client.submitAndWait(transactionData, {
          wallet,
        });
        console.log("Burnt " + nfts.result.account_nfts[index].NFTokenID + " ");
      }

      console.log("END.. All NFT's burned");
      return nfts.result.account_nfts;
    } catch (err) {
      console.log("Error occured during burnAllNFT() call" + err);
      return;
    }
  }

  async acctInfo() {
    const client = new xrpl.Client(this.clientDetails, {
      connectionTimeout: this.connectionTimeout,
    });

    await client.connect();

    const account_info = await client.request({
      command: "account_info",
      account: this.transactionDetails.Account,
    });

    client.disconnect();

    return account_info;
  }

  async getTicketInfo() {
    const client = new xrpl.Client(this.clientDetails, {
      connectionTimeout: this.connectionTimeout,
    });

    await client.connect();

    let response = await client.request({
      command: "account_objects",
      account: this.transactionDetails.Account,
      type: "ticket",
    });
    console.log("getting ticket info from account", response)

    client.disconnect();

    return response.result.account_objects;
  }

  async cancelTicket() {
    const client = new xrpl.Client(this.clientDetails, {
      connectionTimeout: this.connectionTimeout,
    });

    await client.connect();

    let response = await client
      .request({
        TransactionType: "AccountSet",
        account: this.transactionDetails.Account,
        Sequence: 76166221,
      })
      .then((res) => {
        console.log(res);
      });
  }

  async lookupTx(txId) {
    try {
      const wallet = xrpl.Wallet.fromSeed(this.transactionDetails.Secret);

      const client = new xrpl.Client(this.clientDetails, {
        connectionTimeout: this.connectionTimeout,
      });
      await client.connect();

      console.log("getting transaction details");
    } catch (err) {
      console.log("error" + err);
      return;
    }
  }
}

export default XrplNFTHelper;
