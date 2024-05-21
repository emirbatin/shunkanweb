import React from "react";
import { useState } from "react";
import { Typography } from "@mui/material";

const StatisticCards = ({ CardTitle, UserStatisticData, cardIconType, CardImageSrc, CardIconBGColor }) => {

  return (
    <div className="flex w-full h-24 bg-white justify-left items-center text-center shadow-md rounded-lg p-4 mr-8   ">
      <div className="flex flex-row">
      <div className={`flex ${CardIconBGColor} w-16 h-16 rounded-lg`}>
            <img
                src={CardImageSrc || "https://cdn.pixabay.com/photo/2015/04/18/11/03/profile-728591_1280.jpg"}
                alt="icon"
                className="w-full h-full m-auto object-contain rounded-lg p-2"
            />
        </div>
        <div className="flex flex-col mx-4 text-left justify-center items-left">
          <Typography variant="h6">{CardTitle}</Typography>
          <Typography variant="subtitle1">{UserStatisticData}</Typography>
        </div>
      </div>
    </div>
  );
};

export default StatisticCards;
