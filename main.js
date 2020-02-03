function build_url(name, limit) {

    name = encodeURI(name)

    var base_url = "http://itunes.apple.com/search";
    var request_url = "?term=" + name + "&limit=" + limit;
    var url = base_url + request_url;
    console.log(url);
    return url;
}

$(document).ready(function () {

   
    var ctaForm = $("#ctaForm");

    var modal = $('#exampleModal');

    var results = $("#results")

    ctaForm.on("submit", function (e) {

        

        e.preventDefault();

        $("#launchBtn").attr("disabled", true);

        var artist_name = $("#artist_name").val();

        var no_of_tracks = $("#no_of_tracks").val();

        if (no_of_tracks >= 4) {
            no_of_tracks = 4
        }


         var spinner = $('<div>', {
             class: "spinner-border"
         });

        results.html(spinner);

        var url = build_url(artist_name, no_of_tracks);

        $.ajax({
            type: "GET",
            url: url,
            dataType: 'jsonp',
            crossDomain: true,
            success: function (data) {

                var card = $('<div>', {
                    class: "card mt-3 tab-card "
                });

                var card_header = $('<div>', {
                    class: "card-header tab-card-header"
                });

                var card_content = $('<div>', {
                    class: "tab-content"
                });

                var nav_tabs = $('<ul>', {
                    class: "nav nav-tabs card-header-tabs",
                    role: "tablist"
                });

               


                results.append(card);
                
                card.append(card_header);
                card_header.append(nav_tabs);


                card.append(card_content)


                for (var i = 0; i < no_of_tracks; i++) {

                    var UID = "id" + i;

                    var nav_item = $('<li>', {
                        class: "nav-item"
                    });

                    var nav_link = $('<a>', {
                        href: "#" + UID,
                        text: data.results[i].artistName,
                        class: "nav-link",
                        role: "tab",
                        'aria-controls': UID,
                        'data-toggle': "tab"

                    });

                     var spinner = $('<div>', {
                         class: "spinner-border"
                     });

                    nav_tabs.append(nav_item);
                    nav_item.append(nav_link);

                    var tab_pane = $('<div>', {
                        class: "tab-pane fade p-5",
                        id: UID,
                        role: "tabpanel",
                        'aria-labelledby': UID + "-tab"
                    });

                    
                    var pname = $('<p>', {
                        // html: "Artist: " + data.results[i].artistName,
                        class: "card-text singleArtist"
                    });

                    var ptrack = $('<p>', {
                        // html: "Track:   " + data.results[i].trackName,
                        class: "card-text singleTrack"
                    });

                    var artwork = $('<img>', {
                        src: ''
                    });

                    tab_pane.append(pname).append(ptrack).append(artwork).append(spinner);
                    card_content.append(tab_pane);


                }

                $("#launchBtn").attr("disabled", false);
                $(".spinner-border").first().hide()

            },
            error: function (errorMessage) {
                console.log(errorMessage);
            }
        })

        modal.modal('hide');

    })

    $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {

        var url2 = build_url(this.text, 1);

        var currentTab = $("#" + $(this).attr("aria-controls"));


        $.ajax({
            type: "GET",
            url: url2,
            dataType: 'jsonp',
            success: function (data) {

                currentTab.find(".spinner-border").fadeOut(300);
                currentTab.find(".singleArtist").text("Artist: " + data.results[0].artistName);
                currentTab.find(".singleTrack").text("Track: " + data.results[0].trackName);
                currentTab.find("img").attr('src', data.results[0].artworkUrl30);

            },
            error: function (errorMessage) {
                console.log(errorMessage);

            }
        })

    })


})