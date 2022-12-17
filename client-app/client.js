const socketServerUrl = "";
const hostToLive = "http://localhost";

const socket = require("socket.io-client")(socketServerUrl);
const superagent = require("superagent");

socket.on("connect", function () {
  console.log("log: connected");
});

socket.on("disconnect", function () {
  console.log("log: disconnect");
});

socket.on("page-request", function (data) {
  const path = data.pathname;
  const method = data.method;
  const params = data.params;

  const localhostUrl = hostToLive + path;

  switch (method) {
    case "get":
      executeGet(localhostUrl, params);
      break;
    case "post":
      executePost(localhostUrl, params);
    default:
      break;
  }
});

function executeGet(url, params) {
  superagent
    .get(url)
    .query(params)
    .end((err, response) => {
      if (err) {
        console.log(err);
        return;
      }
      socket.emit("page-response".response);
    });
}

function executePost(url, params) {
  superagent
    .post(url)
    .query(params)
    .end((err, response) => {
      if (err) {
        console.log(err);
        return;
      }
      socket.emit("page-response".response);
    });
}
