<<<<<<< Updated upstream
# happiest-taylor-album
a personal project from October 2023 analyzing the happiness levels of Taylor Swift's 10 albums (up to Taylor's Version of 1989); used Taylor's Versions and Deluxe editions where available, and included vault tracks when applicable
=======
# for-the-swifties

A personal project started in October 2023 (continuously updated with new releases) that lets Swifties rate each song on a scale of 1-5, discover their favorite albums, and explore what their preferences say about them. The program also automatically adjusts rankings for ties and allows users to view lyrics for each song with a dynamic toggle.

This project combines web design and JavaScript logic to create an interactive user experience, dynamically displaying album themes while maintaining user ratings across sessions.

Using Taylor’s Versions and Deluxe Editions where available, including vault tracks when applicable.

🕰️ Total Time Spent: 30+ hours

🚀 Technologies Used
HTML, CSS, JavaScript – Frontend
Node.js & Express – Backend for dynamically serving content
Local Storage – Preserving user data across page refreshes
Web Design & Custom Styling – Unique styling for each album

💡 What I Learned
This project was a huge learning experience. Here are some of the key takeaways:

1) Design & Aesthetic Brainstorming
Each album has custom styling that matches its era and vibe.
Challenges included:
- Ensuring text color contrasts properly with backgrounds.
- Making sure background images swap out correctly when navigating between albums.

2) Local Storage Issue: Not Retaining All Rankings When Re-ranking
After re-ranking only the most recent ratings counted.
Fix: 
- Ensure past ratings persist in local storage and new votes get added instead of overwriting the old ones.

3) Lyrics Not Showing for “Forever & Always” & “Miss Americana & The Heartbreak Prince”
The & symbol was breaking the URL when fetching lyrics.
Fix: 
- Used encodeURIComponent() to properly handle special characters in the URL.

🚀 Future Improvements
🔹 Add tabs for skipping ahead/back between albums instead of clicking through all of them.
🔹 Integrate audio playback so users can listen to each song while rating.


>>>>>>> Stashed changes
