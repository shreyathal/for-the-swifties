console.log("Script loaded successfully!");

// Fetch album data from project files
async function fetchAlbums() {
    const response = await fetch('/get-albums');
    const albumsData = await response.json(); 
    generateRankingUI(albumsData); 
    showIntroPage(); 
}

// Function to show the intro page
function showIntroPage() {
    document.getElementById('intro-page').style.display = 'block'; 
    document.getElementById('album-section').style.display = 'none';
}

// Function to start ranking by hiding the intro and showing the album ranking page
function startRanking() {
    document.getElementById("intro-page").style.display = "none"; 
    document.getElementById("album-section").style.display = "block"; 
    document.querySelectorAll('.album-container').forEach(album => {
        album.style.display = 'none';
    });
    
    document.getElementById('album1').style.display = 'block';

    let debutAlbum = document.getElementById('album1');
    let albumName = debutAlbum.querySelector('h1').innerText.trim();
    changeBackground(albumName);
}

function saveRating(album, song, rating, starsContainer) {
    let userRatings = JSON.parse(localStorage.getItem('userRatings')) || {};
    
    if (!userRatings[album]) userRatings[album] = {};
    
    if (userRatings[album][song] === rating) {
        delete userRatings[album][song]; // Remove rating if clicking the same rating
    } else {
        userRatings[album][song] = rating;
    }

    localStorage.setItem('userRatings', JSON.stringify(userRatings));
    restoreStars(starsContainer, album, song);
}

async function fetchLyrics(album, song, songDiv) {
    let lyricsContainer = songDiv.querySelector('.lyrics-container');
    let lyricsButton = songDiv.querySelector('button');

    if (lyricsContainer.hasAttribute("data-loaded")) {
        let isHidden = lyricsContainer.style.display === 'none';
        lyricsContainer.style.display = isHidden ? 'block' : 'none';
        lyricsButton.innerText = isHidden ? 'Hide Lyrics' : 'View Lyrics';
        lyricsButton.style.backgroundColor = isHidden ? '#FFD700' : '#4CAF50';
        return;
    }

    lyricsContainer.innerHTML = "Loading lyrics...";
    lyricsContainer.style.display = 'block';
    lyricsButton.innerText = 'Hide Lyrics';
    lyricsButton.style.backgroundColor = '#FFD700';

    // Encode album and song names to make sure songs with '&' are handled correctly
    let encodedAlbum = encodeURIComponent(album);
    let encodedSong = encodeURIComponent(song);

    const response = await fetch(`/get-lyrics?album=${encodedAlbum}&song=${encodedSong}`);
    const lyrics = await response.text();

    lyricsContainer.innerHTML = lyrics;
    lyricsContainer.setAttribute("data-loaded", "true");
}

function changeBackground(album) {
    console.log(`Switching to: ${album}`);

    // Strip leading numbers and fix capitalization
    album = album.replace(/^\d+\s*/, "").trim();
    album = album.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

    // Special case for the debut album
    if (album.toLowerCase() === "debut") {
        album = "Taylor Swift"; // Map "Debut" to "Taylor Swift"
    }

    // Remove any previously applied album class
    document.body.className = ""; // Reset all classes
    document.body.classList.add("album-theme"); // Ensure a base class is present

    const albumClassMap = {
        "Taylor Swift": "debut-theme",
        "Fearless": "fearless-theme",
        "Speak Now": "speaknow-theme",
        "Red": "red-theme",
        "1989": "nineteeneighty-nine-theme",
        "Reputation": "reputation-theme",
        "Lover": "lover-theme",
        "Folklore": "folklore-theme",
        "Evermore": "evermore-theme",
        "Midnights": "midnights-theme",
        "The Tortured Poets Department": "torturedpoets-theme"
    };

    if (albumClassMap[album]) {
        document.body.classList.add(albumClassMap[album]);
        console.log(`✅ Applied CSS class: ${albumClassMap[album]}`);
    } else {
        console.log(`❌ No matching album class found for: ${album}`);
    }
}

function nextAlbum(albumIndex) {
    document.querySelectorAll('.album-container').forEach(album => album.style.display = 'none');
    let nextAlbum = document.getElementById(`album${albumIndex + 1}`);
    if (nextAlbum) {
        nextAlbum.style.display = 'block';
        let albumName = nextAlbum.querySelector('h1').innerText.trim();
        changeBackground(albumName); 
    }
}

function goBack(albumIndex) {
    document.querySelectorAll('.album-container').forEach(album => album.style.display = 'none');
    let prevAlbum = document.getElementById(`album${albumIndex}`);
    if (prevAlbum) {
        prevAlbum.style.display = 'block';
        let albumName = prevAlbum.querySelector('h1').innerText.trim();
        changeBackground(albumName); 
}
}

function goToIntro() {
    document.querySelectorAll('.album-container').forEach(album => album.style.display = 'none'); 
    showIntroPage();

    document.body.className = ""; 
    document.body.style.background = "url('/intro-page-background.png') center/cover no-repeat";
}

// Function to dynamically generate ranking UI for each album
function generateRankingUI(albumsData) {
    const albumContainer = document.getElementById('album-section'); 
    albumContainer.innerHTML = ''; // Clear existing content

    Object.keys(albumsData).forEach((album, index) => {
        let albumDiv = document.createElement('div');
        albumDiv.classList.add('album-container');
        albumDiv.id = `album${index + 1}`;
        if (index === 0) albumDiv.style.display = 'block';

        let albumTitle = document.createElement('h1');
        albumTitle.innerText = album.replace(/_/g, ' ');
        albumDiv.appendChild(albumTitle);

        let songList = document.createElement('div');
        songList.classList.add('song-list');

        albumsData[album].forEach(song => {
            let songDiv = document.createElement('div');
            songDiv.classList.add('song');
            songDiv.dataset.song = song;

            let songTitle = document.createElement('p');
            songTitle.innerText = song;
            songDiv.appendChild(songTitle);

            let starsContainer = document.createElement('div');
            starsContainer.classList.add('stars-container');

            for (let i = 1; i <= 5; i++) {
                let star = document.createElement('span');
                star.classList.add('stars');
                star.dataset.value = i;
                star.innerHTML = '★';
                star.onclick = function () { saveRating(album, song, i, starsContainer); };
                star.onmouseover = function () { previewStars(starsContainer, i); };
                star.onmouseout = function () { restoreStars(starsContainer, album, song); };
                starsContainer.appendChild(star);
            }
            songDiv.appendChild(starsContainer);
            restoreStars(starsContainer, album, song);

            let lyricsButton = document.createElement('button');
            lyricsButton.innerText = 'View Lyrics';
            lyricsButton.classList.add('lyrics-button'); // Ensure it uses the CSS class
            lyricsButton.onclick = function () { fetchLyrics(album, song, songDiv); };
            songDiv.appendChild(lyricsButton);

            let lyricsContainer = document.createElement('div');
            lyricsContainer.classList.add('lyrics-container');
            songDiv.appendChild(lyricsContainer);

            songList.appendChild(songDiv);
        });

        albumDiv.appendChild(songList); // Append the song list to the album

        let navButtons = document.createElement('div');
        navButtons.classList.add('nav-buttons');

        if (index === 0) {
            let introButton = document.createElement('button');
            introButton.innerText = 'Go Back to Intro';
            introButton.onclick = function () { goToIntro(); };
            navButtons.appendChild(introButton);
        }

        if (index > 0) {
            let backButton = document.createElement('button');
            backButton.innerText = 'Go Back';
            backButton.onclick = function () { goBack(index); };
            navButtons.appendChild(backButton);
        }

        let nextButton = document.createElement('button');
        if (index < Object.keys(albumsData).length - 1) {
            nextButton.innerText = 'Next Album';
            nextButton.onclick = function () { nextAlbum(index + 1); };
        } else {
            nextButton.innerText = 'Finish Ranking';
            nextButton.onclick = function () { calculateRankings(); };
        }
        navButtons.appendChild(nextButton);

        albumDiv.appendChild(navButtons);
        albumContainer.appendChild(albumDiv);

    });
}

// Function to update stars based on rating
function updateStars(starsContainer, value) {
    starsContainer.querySelectorAll('.stars').forEach(star => {
        star.style.color = star.dataset.value <= value ? 'gold' : 'gray';
    });
}

// Function to preview stars on hover
function previewStars(starsContainer, value) {
    starsContainer.querySelectorAll('.stars').forEach(star => {
        star.style.color = star.dataset.value <= value ? 'lightgoldenrodyellow' : 'gray';
    });
}

// Function to restore stars based on saved rating
function restoreStars(starsContainer, album, song) {
    let userRatings = JSON.parse(localStorage.getItem('userRatings')) || {};
    let rating = userRatings[album]?.[song] || 0;
    updateStars(starsContainer, rating);
}

function calculateRankings() {
    let userRatings = JSON.parse(localStorage.getItem('userRatings')) || {};
    let albumScores = {};

    // Ensure ALL rated songs across sessions are included
    Object.keys(userRatings).forEach(album => {
        let ratings = Object.values(userRatings[album]);
        if (ratings.length > 0) {
            let avgScore = ratings.reduce((a, b) => a + b, 0) / ratings.length;
            albumScores[album] = avgScore;
        }
    });

    // Sort albums by score (descending order)
    let sortedAlbums = Object.keys(albumScores).sort((a, b) => albumScores[b] - albumScores[a]);

    document.getElementById("album-section").style.display = "none";
    document.getElementById("final-rankings").style.display = "block";
    document.body.className = "";
    document.body.style.background = "url('/intro-page-background.png') center/cover no-repeat";

    let rankingsList = document.getElementById("rankings-list");
    rankingsList.innerHTML = '';

    let rank = 1;
    let prevScore = null;
    let displayedRanks = 0;

    sortedAlbums.forEach((album, index) => {
        let score = albumScores[album].toFixed(2);

        // Format album name: Remove numbers, replace underscores, capitalize words
        let formattedAlbum = album.replace(/^\d+_/, "") // Remove leading numbers
                                  .replace(/_/g, " ") // Replace underscores with spaces
                                  .split(" ") // Capitalize each word
                                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                  .join(" ");

        // Adjust ranking in case of ties
        if (score !== prevScore) {
            rank = displayedRanks + 1;
        }

        rankingsList.innerHTML += `<h2>#${rank}: ${formattedAlbum} (${score} ⭐)</h2>`;
        prevScore = score;
        displayedRanks++;
    });

    let topAlbums = sortedAlbums.filter(album => albumScores[album] === albumScores[sortedAlbums[0]]);

    let albumBlurbs = {
        "Taylor Swift": "Your favorite album is Debut! You're all about nostalgia, storytelling, and a little bit of country charm! 🎸",
        "Fearless": "Your favorite album is Fearless! You love fairytales, romance, and golden-hued memories! ✨",
        "Speak Now": "Your favorite album is Speak Now! You're a dreamer, a poet, and someone who loves to express themselves freely! 💜",
        "Red": "Your favorite album is Red! You're bold, passionate, and embrace all the highs and lows of love! ❤️",
        "1989": "Your favorite album is 1989! You’re a pop-loving, city-roaming, style icon! 🎧",
        "Reputation": "Your favorite album is Reputation! You love the drama, the power, and the comeback story. 🐍",
        "Lover": "Your favorite album is Lover! You're soft, romantic, and always looking for the silver lining! 💖",
        "Folklore": "Your favorite album is Folklore! You’re introspective, poetic, and find beauty in simplicity. 🌲",
        "Evermore": "Your favorite album is Evermore! You love mystery, storytelling, and cozy winter nights. 🍂",
        "Midnights": "Your favorite album is Midnights! You're a night owl who thrives in deep thoughts and starry skies. 🌌",
        "The Tortured Poets Department": "Your favorite album is Tortured Poets! You appreciate deep emotions, poetic lyrics, and a touch of melancholy. 📖"
    };

    let blurbElement = document.getElementById("top-album-blurb");

    if (topAlbums.length > 1) {
        let tiedAlbumsText = topAlbums
            .map(album => album.replace(/^\d+_/, "").replace(/_/g, " ").split(" ")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")
            ).join(" and ");

        let tiedBlurbs = topAlbums
            .map(album => {
                let cleanAlbum = album.replace(/^\d+_/, "").replace(/_/g, " ").trim();
                let albumKey = Object.keys(albumBlurbs).find(
                    key => key.toLowerCase() === cleanAlbum.toLowerCase()
                );
                return albumKey ? albumBlurbs[albumKey] : null;
            })
            .filter(blurb => blurb !== null);

        let combinedBlurbs = tiedBlurbs.join("\n\n");

        blurbElement.innerText = `Wow! Your top albums are tied: ${tiedAlbumsText}.\n\n${combinedBlurbs}`;
    } else {
        let topAlbum = topAlbums[0].replace(/^\d+_/, "").replace(/_/g, " ").trim();
        let albumKey = Object.keys(albumBlurbs).find(
            key => key.toLowerCase() === topAlbum.toLowerCase()
        );

        if (albumKey) {
            blurbElement.innerText = albumBlurbs[albumKey];
        } else {
            console.warn(`⚠️ No matching blurb found for: "${topAlbum}"`);
            blurbElement.innerText = "You have a unique taste in music!";
        }
    }
}

function restartRanking() {
    // Do NOT remove userRatings, just reset the UI
    document.querySelectorAll('.album-container').forEach(album => {
        album.style.display = 'none';
    });

    document.getElementById("final-rankings").style.display = "none"; 
    document.getElementById("album-section").style.display = "none"; 
    document.getElementById("intro-page").style.display = "block"; 

    document.body.className = "";
    document.body.style.background = "url('/intro-page-background.png') center/cover no-repeat";
}

function continueRanking() {
    document.getElementById("intro-page").style.display = "none";
    document.getElementById("album-section").style.display = "block";
}

window.onload = function () {
    document.body.style.background = "url('/intro-page-background.png') center/cover no-repeat";
    fetchAlbums();
}