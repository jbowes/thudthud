console.log("HI THERE");

jQuery(function() {
    $("td").click(function(event) {
        drum_type = $(this).parent().attr("id");
        console.log("clicked: " + drum_type + " " + event.target.id);
        $("audio#snd-" + drum_type).get(0).play();
    });
});
