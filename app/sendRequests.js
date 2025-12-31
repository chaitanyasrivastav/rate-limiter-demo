import axios from "axios";
import http from "http";

// Read CLI arguments
const [, , pathArg, portArg, countArg] = process.argv;

// Defaults
const port = portArg || 3000;
const count = Number(countArg) || 10;
const URL = `http://localhost:${port}/${pathArg || ""}`;

// const agent = new http.Agent({
//   keepAlive: true,
//   maxSockets: 100,        // concurrency cap
//   maxFreeSockets: 50,     // idle sockets to keep
//   keepAliveMsecs: 30000  // keep idle socket alive
// });


async function run() {
  const requests = [];

  for (let i = 0; i < count; i++) {
    requests.push(
      axios.get(URL)
        .then(res => {
          console.log(`Response ${i + 1}:`, res.data);
        })
        .catch(err => {
  console.log(`\nResponse ${i + 1} FAILED`);

  console.log("  message:", err.message);
  console.log("  code:", err.code);

  if (err.response) {
    console.log("  type: HTTP RESPONSE");
    console.log("  status:", err.response.status);
    console.log("  headers:", err.response.headers);
  } 
  else if (err.request) {
  console.log(`Response ${i + 1} FAILED`);
  console.log("  type: NETWORK / SOCKET ERROR");
  console.log("  message:", err.message);
  console.log("  code:", err.code);

  const socket = err.request.socket;
  if (socket) {
    console.log("  localPort:", socket.localPort);
    console.log("  remotePort:", socket.remotePort);
    console.log("  localAddress:", socket.localAddress);
    console.log("  remoteAddress:", socket.remoteAddress);

    console.log("  destroyed:", socket.destroyed);
    console.log("  bytesWritten:", socket.bytesWritten);
    console.log("  bytesRead:", socket.bytesRead);

    console.log("  connecting:", socket.connecting);
    console.log("  pending:", socket.pending);

    console.log("  hadError:", socket._hadError);
    console.log("  timeout:", socket.timeout);
  }

  console.log("  stack:", err.stack?.split("\n")[0]);
} else {
  console.log("  type: AXIOS SETUP ERROR");
}
}));
  }

  console.log(`Sent ${count} parallel requests`);
  
  // wait for all to finish
  await Promise.all(requests);

  console.log("All requests completed");
}

run();