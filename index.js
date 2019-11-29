var socket = new WebSocket("ws://localhost:5000")

socket.onopen = function(event) {
  console.log("connected to socket", event);
  socket.send("HELLO");
};

socket.onmessage = function(event) {
  console.log("received message: ", event);
};
