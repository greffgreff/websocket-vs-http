const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 8080 });

server.on("connection", ws => {
  console.log("WebSocket client connected");

  ws.on("message", () => {});

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
  });
});

console.log("WebSocket server started on port 8080");
