
//Construktor function, der skaber objekterne vi skal bruge senere
function Album(artist, album, totalTracks, releaseYear, trackList) {
    this.artist = artist;
    this.album = album;
    this.totalTracks = totalTracks;
    this.releaseYear = releaseYear;
    this.trackList = trackList; // Inkluderer tracklisten, så den kan bruges med knapperne
}

function addDivWithAlbum(album, parentid, index) { //Funktion, der sætter album info og tracklist knap ind i venstre div
    const parentElement = document.getElementById(parentid);
    const uniqueButtonId = `btn_${album.album.replace(/\s+/g, '')}_${album.releaseYear}_${index}`;
    // ^ Måden man laver et unikt id til hver knap

    // Create the album container
    const albumDiv = document.createElement("div"); //Sørger for dataene kommer i en div
    albumDiv.innerHTML = ` 
        ${album.artist} | 
        ${album.album} | 
        Total tracks: ${album.totalTracks} | 
        Release: ${album.releaseYear} | 
    `; // ^ 'formular' for hvilke data og hvordan det skal stå i div
        // ^ $ bruges som identifikator for objekterne

    // Her laver jeg knapperne, og får dem til at vise den tilsvarende tracklist ovre i den anden div
    const button = document.createElement("button");
    button.id = uniqueButtonId; // Her gives hver knap et unikt id
    button.classList.add("tracklist-button"); // Tilføjer en fælles class for alle knapper, så der er nemmere at style dem
    button.textContent = "Tracklist (press here)"; // Tilføjer tekst til knappen
    button.addEventListener("click", () => displayTracklist(album)); // Det der får tracklisten vist når man trykker på knappen

    albumDiv.appendChild(button); // Sætter knappen sammen med albumdiv
    parentElement.appendChild(albumDiv); // Sætter albumdiv sammen med parentElement
}

function displayTracklist(album) { // Funktion for at få vist tracklisten
    const tracklistDiv = document.getElementById("tracklist"); // Finder div med ID "tracklist"
    tracklistDiv.innerHTML = ""; // Fjerner den tracklist, der bliver vist når man trykker på en anden knap

    // Laver div til hver index+sangtitel
    album.trackList.forEach((track, index) => {
        const trackInfo = document.createElement("div");
        trackInfo.textContent = `${index + 1}. ${track.trackTitle}`; // Formlen for hvordan index og sangtitel skrives i div
        tracklistDiv.appendChild(trackInfo); // Kobler div sammen med tracklist-dataene
    });
}

async function fetchContent(url) { // Her fetcher vi sætter vi den op til at skulle hente json-data
    try {
        const request = await fetch(url);
        const json = await request.json();
        return json;
    } catch (error) { // Fanger hvis der sker en fejl, og derefter sender en fejlkode til console
        console.error("Error fetching content:", error);
    }
}

fetchContent("albums.json") // Her fetcher vi data fra albums.json
    .then((albums) => { 
        if (!albums) {
            console.error("No albums data available."); // Melder fejlkode i console, hvis den ik kan hente dataene
            return;
        }

        const albumObjects = albums.map((albumData) => /* Map funktionen gennemgår hvert element i albums arrayet og 
        derefter kører en funktion på hvert element og til sidst returnerer et nyt album objekt*/
            new Album( // Her laver jeg nye album objekter
                albumData.artistName,
                albumData.albumName,
                albumData.trackList.length,
                albumData.productionYear,
                albumData.trackList // Overfører hver trackliste fra hvert album
            )
        );

        albumObjects.forEach((album, index) => { // Kører albumobjects for hvert element i arrayet
            addDivWithAlbum(album, "content", index); // Tilføjer dataene til div
        });
    });
