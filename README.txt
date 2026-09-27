UMUT CAN KUCUKTURHAN — MUSIC PORTFOLIO
========================================

WHAT IS INSIDE
--------------
index.html     Main portfolio page
styles.css     Visual design
script.js      Track names + audio player
audio/         Web-ready MP3 versions of your four tracks

HOW TO RENAME THE TRACKS
------------------------
Open script.js with any text editor.

Near the top you will see:

title: "TRACK NAME 02"
title: "TRACK NAME 04"

Replace only those names and save.

You can also edit:
genre: "..."
note: "..."

HOW TO OPEN IT ON YOUR COMPUTER
-------------------------------
Double-click index.html.

If your browser blocks local audio playback for any reason,
run a simple local server from this folder:

Python:
  python -m http.server 8000

Then open:
  http://localhost:8000

HOW TO PUT IT ONLINE FOR FREE WITH GITHUB PAGES
-----------------------------------------------
1. Create a GitHub account if you do not already have one.
2. Create a PUBLIC repository named:
      music-portfolio
3. Upload ALL files and folders from this portfolio folder.
   Important: index.html must be at the repository root.
4. Open the repository:
      Settings > Pages
5. Under "Build and deployment":
      Source: Deploy from a branch
      Branch: main
      Folder: /(root)
6. Click Save.
7. GitHub will give you an address similar to:
      https://YOURUSERNAME.github.io/music-portfolio/

Use that URL in job applications as your Portfolio / Work Samples link.

BEFORE PUBLISHING
-----------------
- Rename TRACK NAME 02 and TRACK NAME 04 in script.js.
- Check your email address in index.html.
- If you want to add LinkedIn later, add it to the header/contact section.
- Listen to every MP3 once after publishing to make sure playback works.

The MP3 files were created from your original WAV files for faster web loading.
Your original WAV files were not modified.
