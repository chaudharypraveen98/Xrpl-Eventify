import React, { useEffect, useState } from "react";
import "../styles/NFTCard.css";
import { SiXrp } from "react-icons/si";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { ColorExtractor } from "react-color-extractor";
import Card from "./base/Card";
import Button from "./base/Button";
import { Colors } from "../constants/Colors";

import { ModelViewerElement } from "@google/model-viewer";
import { useARStatus } from "../hooks/isARStatus";

const NFTCard = ({
  username,
  nftName,
  price,
  nftSrc,
  likeCount,
  gradient,
  onClick,
}) => {
  const [isLike, setIsLike] = useState(false);
  const [colors, setColors] = useState([]);

  const isARSupport = useARStatus(nftSrc);

  useEffect(() => {
    console.log(isARSupport);
  }, []);

  const like = () => setIsLike(!isLike);

  const getColors = (colors) => {
    setColors((c) => [...c, ...colors]);
    //console.log(colors);
  };

  return (
    <Card
      blurColor={colors[0]}
      height={"340px"}
      child={
        <>
          {isARSupport ? (
            <model-viewer
              ar-scale="auto"
              ar
              ar-modes="webxr scene-viewer quick-look"
              id="reveal"
              loading="eager"
              camera-controls
              auto-rotate
              src={nftSrc}
            >
            </model-viewer>
          ) : (
            <>
              <ColorExtractor getColors={getColors}>
                <img className="nft-image" src={nftSrc} />
              </ColorExtractor>
            </>
          )}
          <div className="wrapper">
            <div className="info-container">
              <p className="owner"> PRAVEEN.DARK.NFT</p>
              <p className="name">{nftName ? nftName : "Alien"}</p>
            </div>

            <div className="price-container">
              <p className="price-label">Price</p>
              <p className="price">
                <SiXrp color="white" />
                {price ? price : 4.55}
              </p>
            </div>
          </div>
          <div className="buttons">
            {/* <button className="buy-now">Buy Now</button> */}
            <Button
              color={Colors.buttons.primary}
              textContent="Join"
              onClick={onClick}
            />
            <div className="like-container">
              <button className="like" onClick={like}>
                {!isLike ? (
                  <AiOutlineHeart size="30" color="white" />
                ) : (
                    <AiFillHeart
                      size="30"
                      style={{
                        stroke: `-webkit-linear-gradient(
                    to bottom,
                    #38ef7d,
                    #11998e
                  );`,
                    }}
                    color="#00f5c966"
                  />
                )}
              </button>
              <p className="like-count">123</p>
            </div>
          </div>
        </>
      }
    ></Card>
  );
};

export default NFTCard;
