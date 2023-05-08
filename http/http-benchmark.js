const axios = require("axios");
const fs = require("fs");

const messages = [];
const binCount = 100;
const binSize = 100;
const increaseIncrement = 10_000;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const benchmark = async () => {
  console.log("Starting HTTP benchmark...");

  count = 0;
  for (let i = 0; i < binCount; i++) {
    let message = "x".repeat(increaseIncrement * (i + 1));

    for (let j = 0; j < binSize; j++) {
      await axios.post("http://localhost:8080/", message);

      messages.push({
        size: message.length,
        time: new Date(),
      });

      // await sleep(10) // optional 10 ms delay for normalization testing
    }
  }

  console.log(messages);

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
      return `${size / 1_000},${latencyAvg.toFixed(3)}`;
    })
    .filter(line => !line.endsWith(",NaN"))
    .join("\n");

  fs.writeFileSync("messages.csv", "size,latency\n" + csvData);

  console.log("All messages sent and saved to CSV file");
};

benchmark();
