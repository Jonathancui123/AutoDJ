for (let i = 0; i < 20 && matches < 3; i++) {
            console.log('matches: ', matches);
            console.log('i: ', i);
            var genres = [];
            console.log("i'th song: ", returnedSongs[i].name);
            genreLookup(access_token, returnedSongs[i].artists[0])
                .then((body) => {
                    genres =  JSON.parse(body).genres
                    // console.log("the genre is: ", genres);
                    // console.log({genres});


                    console.log("Artist genre: ", genres, " Seleced Genre: ", selectedGenre);
                    if (genres.includes(selectedGenre)) {
                        ++matches;
                        if (songBankLookup(returnedSongs[i].uri) >= 0) {
                            songBank[i].score++;
                        } else {
                            songBank.push(new Song(
                                nextSongId,
                                returnedSongs[i].name,
                                returnedSongs[i].artists[0],
                                genres,
                                1,
                                false,
                                returnedSongs[i].uri
                            ));
                            nextSongId++;
                        }
                    }
                })
                .catch((err)=>{
                    console.error(err);
                })
        }