import React, { useState, useEffect, createRef } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useLocation, Navigate, useParams } from "react-router";
import Card from "../components/base/Card";
import "../styles/NFTDetail.css";
import { ColorExtractor } from "react-color-extractor";
import Button from "../components/base/Button";
// import { FaEthereum } from "react-icons/fa";
import { SiXrp } from "react-icons/si";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
} from "react-icons/ai";
import { useMobile } from "../hooks/isMobile";
import { hotDropsData } from "../constants/MockupData";
import NFTCard from "../components/NFTCard";
import { useARStatus } from "../hooks/isARStatus";

const NFTDetail = () => {
  const isMobile = useMobile();
  const [colors, setColors] = useState([]);
  const [isLike, setIsLike] = useState(false);
  const like = () => setIsLike(!isLike);
  const getColors = (colors) => {
    setColors((c) => [...c, ...colors]);
  };

  const navigate = useNavigate();

  const { state } = useLocation();
  const importedExploreListXrpl = JSON.parse(
    localStorage.getItem("exploreListXrpl")
  );
  const { id } = useParams();

  const nftState = state ? state : importedExploreListXrpl[id];

  useEffect(() => {
    setColors([]);
  }, [state]);

  const isARSupport = useARStatus(nftState.item.src);
  return (
    <div className="detail-page-container">
      <Header />
      <div id="nft-detail-card-wrapper">
        <Card
          width={isMobile ? "100%" : "80vw"}
          height={"auto"}
          blurColor={colors[0]}
          child={
            <div id="detail-content">
              <div className="detail-content-main">
                {isARSupport ? (
                  // @ts-ignore
                  <model-viewer
                    ar-scale="auto"
                    ar
                    ar-modes="webxr scene-viewer quick-look"
                    id="arDetail"
                    loading="eager"
                    camera-controls
                    auto-rotate
                    src={nftState.item.src}
                  />
                ) : (
                  <>
                    <ColorExtractor getColors={getColors}>
                      <img
                        id="detail-image"
                        src={nftState.item.src}
                        alt="nft banner"
                      />
                    </ColorExtractor>
                  </>
                )}

                <div id="detail-info">
                  <div id="detail-info-container">
                    {/* <p id="collection"> {nftState.item.name} </p>
                  <p id="name"> {nftState.item.name} </p> */}
                    <p id="collection"> XRPL LANUCH PARTY </p>
                    <p id="name"> {nftState.item.name} </p>
                    <p id="description"> {nftState.item.description} </p>
                    <p id="description"> Event Date -> <b>{nftState.item.date}</b> </p>
                </div>

                <div id="detail-controls">
                  <Button
                    width={isMobile ? "70%" : "70%"}
                    height="50px"
                    child={
                      <div id="button-child">
                        <SiXrp color="white" size={24} />
                        {/* <FaEthereum size="28px" /> */}
                        <p id="price">Mark your presence</p>
                      </div>
                    }
                  ></Button>
                  <div className="like-container">
                    <button className="like" onClick={like}>
                      {!isLike ? (
                          <AiOutlineHeart size="36" color="white" />
                      ) : (
                        <AiFillHeart
                          size="45"
                          style={{
                            stroke: `-webkit-linear-gradient(
                    to bottom,
                    #38ef7d,
                    #11998e
                  )`,
                          }}
                          color="#00f5c966"
                        />
                      )}
                    </button>
                      <p className="like-count">{isLike ? 124 : 123}</p>
                  </div>
                </div>
                </div>
              </div>
              <iframe
                id="nft-video"
                width="80%"
                height="500px"
                src={`https://www.youtube.com/embed/${nftState?.item?.eventLink?.split("?v=")[1]}?autoplay=1&mute=0`}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default NFTDetail;
