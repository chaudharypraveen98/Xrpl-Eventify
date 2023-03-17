import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

function QrModal2({ qr_png, uuid, closeModal }) {
  useEffect(() => {
    let timer = 45;

    let interval = setInterval(async () => {
      console.log(timer);

      if (timer < 1) {
        clearInterval(interval);
        closeModal();
      } else {
        let body = {
          uuid: uuid,
        };

        const headers = { body: JSON.stringify(body) };

        await axios.get("/api/getPayloadInfo", { headers }).then((data) => {
          if (data.data.meta.signed) {
            clearInterval(interval);
            closeModal();
            toast.success('🦄 Mint Successfull', {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          }
        });

        timer = timer - 3;
      }
    }, 3000);
  });

  return (
    <div>
      <h4>Please scan with Xumm app to verify transaction.</h4>
      <h4>You have only 45 seconds</h4>

      <div>
        <img src={qr_png} alt="mint qr code" />
      </div>
    </div>
  );
}

export default QrModal2;
