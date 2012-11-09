var bar = 0;
var beats = {};
var muted = false;

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
}

function playBeats() {
    $("th").each(function(i) {
        if (i == bar) {
            $(this).addClass("active");
        } else {
            $(this).removeClass("active");
        }

    });

    $.each(beats, function(beat) {
        $(beats[beat]).each(function(i) {
            if (bar == i && beats[beat][i] == true) {
                if (!muted) {
                    console.log(beat + " " + bar);
                    $("audio#snd-" + beat + "-" + i).get(0).play();
                }
            }
        });
    });

    window.setTimeout(playBeats, 256);
    bar++;
    bar %= 8;
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
