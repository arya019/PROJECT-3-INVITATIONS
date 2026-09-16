images/  folder  —  WHAT TO PUT HERE
====================================

This folder holds the photos and small icons used by the site.
The site comes with PLACEHOLDER photos (random picsum images) so
you can see it working. To use your own, drop files here and point
config.js at them.

SUGGESTED FILES TO ADD (12 wedding photos + 4 icons + optional music):

  1. Your 12 photos  (swap the picsum links in config.js for these)
     --------------------------------------------------------------
       aiburo1.jpg   aiburo2.jpg   aiburo3.jpg   aiburo4.jpg
       holud1.jpg    holud2.jpg    holud3.jpg    holud4.jpg
       biye1.jpg     biye2.jpg     biye3.jpg     biye4.jpg
       bojhat1.jpg   bojhat2.jpg   bojhat3.jpg   bojhat4.jpg

     JPEG or PNG, any size (around 800x600 is best for the web).

  2. The 4 little theme icons
     --------------------------------------------------------------
       aiburo-icon.png     (bowl / rice bowl  - used on আইবুড়ো ভাত)
       marigold-icon.png   (marigold flower  - used on গায়ে হলুদ)
       kalash-icon.png     (kalash pot      - used on বিবাহ)
       ring-icon.png       (wedding rings   - used on বৌভাত)

     These are optional. If a file is missing the site shows a
     simple emoji drawing instead, so it still looks good.

  3. Background music (optional)
     --------------------------------------------------------------
       music.mp3           (turned on/off by the music toggle)

HOW THE PLACEHOLDER PHOTOS WORK
===============================
Right now config.js uses URLs like:
     https://picsum.photos/seed/aiburo1/800/600
These show random internet photos so the gallery works immediately.
To use YOUR photos, open config.js and replace each such URL with
your filename, e.g.:   "images/aiburo1.jpg"

That's it — no other file needs changing.