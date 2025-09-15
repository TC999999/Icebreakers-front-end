import { type JSX } from "react";

const RequestError = (): JSX.Element => {
  return (
    <div id="chat-request-error">
      <h1>403 Error</h1>
      <h2>Cannot make a chat request with yourself!</h2>
    </div>
  );
};

export default RequestError;
