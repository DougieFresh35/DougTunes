$('form').submit(function (event) {
    event.preventDefault()
    var search = $('#search').val()
    $("form")[0].reset();

    $('#search').blur()


    $.ajax({
        url: "http://itunes.apple.com/search?term=" + search,
        dataType: 'JSONP'
    })
        .done(function (data) {
            console.log(data);
            $('#songs').html('')
            var ampArr = []
            // add code for when response from apple comes back.
            for (var i = 0; i < data.results.length; i++) {
                if (data.results[i].trackName) {
                    //$('#songs').append("<li>" + data.results[i].trackName + "</li>");
                    $('#songs').append(`
                    
                            <li>
                            <div class="collapsible-header"><img src='${data.results[i].artworkUrl30}'>${data.results[i].trackName}</div>
                            <div class="collapsible-body">
                
                            <img src='${data.results[i].artworkUrl100}'>
                            <div>
                               Price: ${data.results[i].trackPrice} <br>
                                Album: ${data.results[i].collectionName} <br>
                                Artist Name: ${data.results[i].artistName} <br>
                                <div class="amplitude-play-pause" amplitude-song-index="${i}"></div>
                            </audio>
                            </div>
                            <hr>
                            </div>
                            </li>
                    
                    `);
                    ampArr.push({
                        "name": data.results[i].trackName,
                        "artist": data.results[i].artistName,
                        "album": data.results[i].collectionName,
                        "url": data.results[i].previewUrl,
                        "cover_art_url": data.results[i].artworkUrl100
                    })
                }

            }
            Amplitude.init({ "songs": ampArr })
            $('.collapsible').collapsible();


            $('.slides').html("")
            $('.indicators').remove();
            $('.slider .slides').css('background-image', 'none')

            var seen = {}
            var covers = 0;
            for (var i = 0; i < data.results.length && covers < 5; i++) {
                var image = data.results[i].artworkUrl30
                if (seen[image] === undefined) {
                    seen[image] = true;
                    covers++
                    image = image.split("30x30bb.jpg")[0]
                    image += "1500x1500bb.jpg"
                    $('.slides').append(`
                        <li>
                        <img src="${image}"> <!-- random image -->
                        <div class="caption center-align">
                        <h3>${data.results[i].collectionName}</h3>
                        <h5 class="light grey-text text-lighten-3">${data.results[i].artistName}</h5>
                        </div>
                    </li>`)
                }

            }

            $('.slider').slider();




        })
        .fail(function (data) {
            console.log(data);
            $('#songs').append(data.status);
        })
});// End of on ready part
