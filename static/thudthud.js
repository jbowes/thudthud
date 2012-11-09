var bar = 0;
var beats = {};
var muted = false;

function setupSocket(socket) {
    socket.on('connect', function() {
        console.log("connected to the server!");
    });
   
    socket.on('error', function() {
        console.log("anything");
    });
}

function playBeats() {
    $("th").each(function(i) {
        if (i == bar) {
            $(this).addClass("active");
            $(this).removeClass("inactive");
        } else {
            $(this).removeClass("active");
            $(this).addClass("inactive");
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
    if (bar == 8) {
        bar = 0;
    }   
}

jQuery(function() {
    var socket = io.connect();
   
    $("a#mute").click(function() {
        muted = !muted;
    });

    $("td").click(function(event) {
        drum_type = $(this).parent().attr("id");
        console.log("clicked: " + drum_type + " " + event.target.id);

        if (!(drum_type in beats)) {
            beats[drum_type] = [false, false, false, false, false, false, false, false];
        }
        var toggle_name = drum_type + "_" + event.target.id;
        if (beats[drum_type][event.target.id] == true) {
            beats[drum_type][event.target.id] = false;
            $(this).removeClass("active");
            socket.emit("toggle", {name: toggle_name, state: false});
        } else {
            beats[drum_type][event.target.id] = true;
            $(this).addClass("active");
            socket.emit("toggle", {name: toggle_name, state: true});
        }

    });

    setupSocket(socket);
    playBeats();
});
