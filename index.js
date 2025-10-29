//Initialize the express 'app' object
let express = require('express');
let app = express();
app.use('/', express.static('public'));

//Initialize the actual HTTP server
let http = require('http');
let server = http.createServer(app);
// env --> there's no guarantee that once the code is deployed the port is going to be 3000, in case choose the best posrt
let port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log("Server listening at port: " + port);
});

//Initialize socket.io
let io = require('socket.io');
io = new io.Server(server);

//Listen for individual clients/users to connect
io.sockets.on('connection', function (socket) {
    console.log("We have a new client: " + socket.id);

    //Listen for this client to disconnect
    socket.on('disconnect', function () {
        console.log("A client has disconnected: " + socket.id);
    });



    socket.on('vote', function (data) {
        console.log(`Received vote: ${data}`);
    
        // Invia a tutti i client il messaggio del voto
        io.emit('newMessage', data);
    
        // Invia anche la notifica "1 user has voted"
        io.emit('userVoted', "1 user has voted");
    });
    

    //When a client disconnects
    socket.on('disconnect', function () {
        console.log("A client has disconnected: " + socket.id);
    });
});

