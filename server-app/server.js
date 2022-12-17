const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const url = require("url");
const bodyParser = require("body-parser");

const PORT = process.env.YOUR_PORT || process.env.PORT || 3000;

app.use(bodyParser());

let clientResponseRef;

app.get("/*", (req, res) => {
  const pathname = url.parse(req.host).pathname;

  const obj = {
    pathname,
    method: "get",
    params: req.query,
  };

  io.emit("page-request", obj);
  clientResponseRef = res;
});

app.post("/*", (req, res) => {
  const pathname = url.parse(req.host).pathname;

  const obj = {
    pathname,
    method: "post",
    params: req.body,
  };

  io.emit("page-request", obj);
  clientResponseRef = res;
});

io.on("connection", (socket) => {
  console.log("info: a node connected");
  socket.on("page-response", (response) => {
    clientResponseRef.send(response);
  });
});

http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
