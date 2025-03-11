// import required modules
const express = require('express'); // frakework for handling server requests
const fs = require('fs'); // file system module to read files and directories
const path = require('path'); // module to handle file paths

// create an express app
const app = express();

// Serve static files (HTML, JS, CSS)
app.use(express.static(__dirname));

// define the path to the lyrics directory
const lyricsDir = path.join(__dirname, 'lyrics');

// endpoint to get all albums and their songs
app.get('/get-albums', (req, res) => {

    // object to store albums and their songs
    let albums = {}

    // read all album folders inside the lyrics directory
    fs.readdirSync(lyricsDir).forEach(album => {
        let albumPath = path.join(lyricsDir, album); 

        // check if the item is a directory (an album)
        if (fs.lstatSync(albumPath).isDirectory()) {

            // read all song files inside the album directory
            albums[album] = fs.readdirSync(albumPath)
                // only keep .txt files
                .filter(file => file.endsWith('.txt'))
                // clean file names (the file extensions and underscores)
                .map(file => file.replace('.txt', '').replace(/_/g, ' ')); 
            
        }
    }); 

    // send the albums and songs as a JSON response
    res.json(albums);

}); 

// endpoint to get the lyrics of a song
app.get('/get-lyrics', (req, res) => {
    const { album, song } = req.query;
    const filePath = path.join(lyricsDir, album, `${song.replace(/ /g, '_')}.txt`);

    if (fs.existsSync(filePath)) {
        let lyrics = fs.readFileSync(filePath, 'utf8');

        // Try different ways to detect new lines
        if (!lyrics.includes('\n')) {
            // If there are no actual new lines, try splitting by double spaces or punctuation
            lyrics = lyrics.replace(/([.!?])\s/g, '$1<br>'); 
            lyrics = lyrics.replace(/  +/g, '<br>');
        } else {
            // Normal case: replace actual line breaks
            lyrics = lyrics.replace(/\r\n/g, '<br>').replace(/\n/g, '<br>').replace(/\r/g, '<br>');
        }

        res.send(lyrics);
    } else {
        res.status(404).send('Lyrics not found.');
    }
});

// start the server and listen on port 3000
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});