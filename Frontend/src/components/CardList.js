import React from "react";
import NFTCard from "./NFTCard";
import "../styles/CardList.css";
import { useNavigate } from "react-router-dom";
import Carousel from "react-elastic-carousel";
import { useRef } from "react";

const CardList = ({ list, type = "horizontal" }) => {
  let navigate = useNavigate();
  const carouselRef = useRef(null);
  let resetTimeout;

  const breakPoints = [
    { width: 1, itemsToShow: 1 },
    { width: 550, itemsToShow: 2, itemsToScroll: 2 },
    { width: 768, itemsToShow: 3 },
    { width: 1200, itemsToShow: 4 },
  ];
  function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  return (
    <div
      id="card-list"
      style={{ flexDirection: type === "horizontal" ? "row" : "column" }}
    >
      {list?.length > 0 &&
      <Carousel
        ref={carouselRef}
        enableAutoPlay={true}
        autoPlaySpeed={4000}
        isRTL={false}
        breakPoints={breakPoints}
        onNextEnd={({ index }) => {
          clearTimeout(resetTimeout);
          // resetTimeout = setTimeout(() => {
          //   carouselRef?.current?.goTo(0);
          // }, 4000); // same time
        }}
      >
          {list?.map((item, index) => (
          <NFTCard
            nftSrc={item.src}
            nftName={item.name}
            price={randomIntFromInterval(1, 9)}
            key={index}
            onClick={() => navigate(`/detail/${index}`, { state: { item: item } })}
          />
        ))}
      </Carousel>
      }
    </div>
  );
};

export default CardList;
