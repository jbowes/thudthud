var currentBar = 0;
var muted = false;
var beats = {};

function setupSocket(socket) {
    socket.on('connect', function() {
        console.log("connected to the server!");
    });
   
    socket.on('error', function() {
        console.log("got an error!");
    });

    socket.on('toggle', function(data) {
        console.log("got remote toggle");
        if (data.state) {
            $("#" + data.drum + "_" + data.bar).addClass("active");
        } else {
            $("#" + data.drum + "_" + data.bar).removeClass("active");
        }
        
        beats[data.drum][data.bar] = data.state;
    });

    // the full state of the table. recieved when we first connect
    socket.on('table', function(table) {
        beats = table;

        for (drum in table) {
            for (bar in table[drum]) {
                if (table[drum][bar]) {
                    $("#" + drum + "_" + bar).addClass("active");
                } else {
                    $("#" + drum + "_" + bar).removeClass("active");
                }
            }
        }
    });
}

function playBeats() {
    $("th").each(function(i) {
        if (i == currentBar) {
            $(this).addClass("active");
        } else {
            $(this).removeClass("active");
        }

    });

    $.each(beats, function(beat) {
        $(beats[beat]).each(function(i) {
            if (currentBar == i && beats[beat][i] == true) {
                if (!muted) {
                    console.log(beat + " " + currentBar);
                    $("audio#snd-" + beat + "-" + i).get(0).play();
                }
            }
        });
    });

    window.setTimeout(playBeats, 256);
    currentBar++;
    currentBar %= 8;
}

jQuery(function() {
    var socket = io.connect();

    // initialize the instrument matrix
    $("tr").each(function(index, row) {
        if (row.id) {
            beats[row.id] = [false, false, false, false, false, false, false, false];
        }
    });
   
    $("a#mute").click(function() {
        muted = !muted;
    });

    $("td").click(function(event) {
        drum_type = $(this).parent().attr("id");

        // figure out the bar of this cell
        var bar = "";
        classes = event.target.className.split(/\s+/);
        $.each(classes, function(index, item) {
            if (item != "active") {
                bar = item;
            }
        });

        console.log("clicked: " + drum_type + " " + bar);

        $(this).toggleClass("active")
        beats[drum_type][bar] = !beats[drum_type][bar];
        socket.emit("toggle", {drum: drum_type, bar: bar, state: beats[drum_type][bar]});
    });

    setupSocket(socket);
    playBeats();
});
