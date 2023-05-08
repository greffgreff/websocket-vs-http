const WebSocket = require("ws");
const fs = require("fs");

const ws = new WebSocket("ws://localhost:8080");

const messages = [];
const binCount = 100;
const binSize = 100;
const increaseIncrement = 10_000;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

ws.on("open", async function open() {
  console.log("Connected to WebSocket server");

  for (let i = 0; i < binCount; i++) {
    let message = "x".repeat(increaseIncrement * (i + 1));

    for (let j = 0; j < binSize; j++) {
      ws.send(message);

      messages.push({
        size: message.length,
        time: new Date(),
      });

      await sleep(10);
    }
  }

  ws.close();
});

ws.on("close", function close() {
  console.log("WebSocket connection closed");

  const sizeBins = {};
  messages.forEach(message => {
    if (!sizeBins[message.size]) {
      sizeBins[message.size] = {
        count: 0,
        sum: 0,
        firstTime: message.time,
      };
    }
    sizeBins[message.size].count++;
    sizeBins[message.size].sum += message.time - sizeBins[message.size].firstTime;
  });

  const csvData = Object.entries(sizeBins)
    .map(([size, { count, sum }]) => {
      const latencyAvg = sum / count;
      return `${size / 1_000},${(latencyAvg / binSize).toFixed(3)}`;
    })
    .filter(line => !line.endsWith(",NaN"))
    .join("\n");

  fs.writeFileSync("messages.csv", "size,latency\n" + csvData);

  console.log("All messages sent and saved to CSV file");
});
