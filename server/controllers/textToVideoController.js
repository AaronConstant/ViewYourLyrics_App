const express = require('express');
const textToVideoController = express.Router();
const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

ffmpeg.setFfmpegPath(ffmpegStatic);

const videosDir = path.join(__dirname, 'videos');
console.log("Videos directory:", videosDir);
if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
}

textToVideoController.use(express.json());
textToVideoController.use(express.urlencoded({ extended: true }));

textToVideoController.post('/', (req, res) => {
  let lyrics;

  try {
    if(typeof req.body.lyrics === 'string') {
      lyrics = JSON.parse(req.body.lyrics);
      console.log("Parsed lyrics:", lyrics);
    } else {
      lyrics = req.body.lyrics;
    }
    if(lyrics.generatedLyrics) {
      lyrics = lyrics.generatedLyrics
    }
  } catch (error) {
    return res.status(400).json({ error: 'Invalid lyrics format' });
  }

  if (!lyrics || !lyrics.name || !lyrics.intro || !lyrics.chorus || !lyrics.verses || !lyrics.bridge) {
    return res.status(400).json({ error: 'Lyrics object is missing required properties' });
  }

  try {
    const timestamp = Date.now();
    const outputPath = `${videosDir}/output-${timestamp}.mp4`;
    console.log("Output path:", outputPath);
    const videoPath = path.join(__dirname, 'videos', `output-${timestamp}.mp4`);
    console.log("Video path:", videoPath);

    const lyricsLines = [
      `${lyrics.name.toUpperCase()}`,
      "",
      "INTRO:",
      ...lyrics.intro.split('\n'),
      "",
      "VERSE 1:",
      ...lyrics.verses[0].split('\n'),
      "",
      "CHORUS:",
      ...lyrics.chorus.split('\n'),
      "",
      "VERSE 2:",
      ...lyrics.verses[1].split('\n'),
      "",
      "CHORUS:",
      ...lyrics.chorus.split('\n'),
      ""
    ];
    const duration = Math.max(30, Math.min(180, Math.ceil(lyricsLines.length * 1.5)));
    console.log("Video duration:", duration); 



    if (lyrics.verses[2]) {
      lyricsLines.push("VERSE 3:");
      lyricsLines.push(...lyrics.verses[2].split('\n'));
      lyricsLines.push("");
    }

    lyricsLines.push("BRIDGE:");
    lyricsLines.push(...lyrics.bridge.split('\n'));
    lyricsLines.push("");
    lyricsLines.push("CHORUS:");
    lyricsLines.push(...lyrics.chorus.split('\n'));
    console.log("FFmpeg Outpath:", outputPath);
    ffmpeg()
      .input(`color=c=black:s=1280x720:d=${duration}`)
      .inputFormat('lavfi')
      .complexFilter(lyricsLines.map((line, index) => {
        const safeText = line.replace(/:/g, '\\:').replace(/'/g, "’").replace(/"/g, '\"');
        const yPos = 120 + index * 50;
        return `drawtext=text='${safeText}':fontcolor=white:fontsize=24:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:x=(w-text_w)/2:y=${yPos}:shadowcolor=black:shadowx=2:shadowy=2`;
      }).join(','))
      .outputOptions(['-c:v libx264', '-pix_fmt yuv420p'])
      .output(outputPath)
      .on('start', (commandLine) => {
              })
      .on('end', () => {
        if(fs.existsSync(videoPath)) {
          console.log("Video file exists:", videoPath);
        res.json({ 
          success: true,
          videoUrl: `/videos/${path.basename(outputPath)}`,
          message: 'Video created successfully'
        });
      }
        console.log(`${path.basename(outputPath)} created successfully`);;
      })
      .on('error', (error) => {
        console.error("Error processing video:", error);
        res.status(500).json({ error: error.message });
      })
      .run();
  } catch (error) {
    console.error("General server error: ", error);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
});

textToVideoController.use('/videos', express.static(videosDir));
console.log("Serving static files from:", videosDir);

module.exports = textToVideoController;