const express = require('express')
const textToVideoController = express.Router()
const ffmpeg = require('fluent-ffmpeg')
const path = require('path')
const fs = require('fs')
require('dotenv').config()



textToVideoController.use(express.json())
textToVideoController.use(express.urlencoded({ extended: true }))

textToVideoController.post('/', (req, res) => {
    const { lyrics } = req.body;
  
    if (!lyrics) {
      return res.status(400).json({ error: 'Lyrics are required' });
    }
  
    try {
      const outputPath = path.join(__dirname, 'videos', `output-${Date.now()}.mp4`);
      const tempTextFile = path.join(__dirname, 'lyrics.txt');
  
      fs.writeFileSync(tempTextFile, lyrics);
  
      ffmpeg()
        .input('color=c=black:s=1280x720')
        .inputOptions(['-framerate 30'])
        .input(tempTextFile)
        .inputFormat('lavfi')
        .complexFilter([`drawtext=textfile=${tempTextFile}:fontcolor=white:fontsize=30:x=(w-text_w)/2:y=(h-text_h)/2:enable='between(t,1,10)'`])
        .output(outputPath)
        .on('end', () => {
          fs.unlinkSync(tempTextFile);
          res.json({ videoUrl: `/videos/${path.basename(outputPath)}` });
        })
        .on('error', (error) => {
          fs.unlinkSync(tempTextFile);
          console.error("Error processing video:", error);
          res.status(500).json({ error: error.message });
        })
        .run();
    } catch (error) {
      console.error("General server error:", error);  
      res.status(500).json({ error: "An unexpected error occurred." });
    }
  });
  
textToVideoController.use('/videos', express.static(path.join(__dirname)));

module.exports = textToVideoController