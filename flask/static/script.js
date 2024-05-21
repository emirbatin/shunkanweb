var socket = io.connect('http://' + document.domain + ':' + location.port);

socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('sentence_update', function(data) {
    document.getElementById('sentence').innerText = data.sentence;
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

