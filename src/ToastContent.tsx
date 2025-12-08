import React from "react";
import type { ToastProps } from "./types/miscTypes";
import "./styles/ToastContent.scss";

// component for toast notification
const CustomToastContent: React.FC<ToastProps> = ({ from, message, group }) => {
  return (
    <div className="message-container">
      {group ? (
        <>
          <h4 className="message-group">{group}</h4>
          <small className="message-sender">
            <b>From: </b>
            {from}
          </small>
        </>
      ) : (
        <h4 className="message-sender">{from}</h4>
      )}
      <p className="message-content"> {message}</p>
    </div>
  );
};

export default CustomToastContent;
