var bar = 0;
var beats = {};
var muted = false;

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
    $("a#mute").click(function() {
        muted = !muted;
    });

    $("td").click(function(event) {
        drum_type = $(this).parent().attr("id");
        console.log("clicked: " + drum_type + " " + event.target.id);

        if (!(drum_type in beats)) {
            beats[drum_type] = [false, false, false, false, false, false, false, false];
        }
        if (beats[drum_type][event.target.id] == true) {
            beats[drum_type][event.target.id] = false;
            $(this).removeClass("active");
        } else {
            beats[drum_type][event.target.id] = true;
            $(this).addClass("active");
        }

    });

   playBeats();
});
