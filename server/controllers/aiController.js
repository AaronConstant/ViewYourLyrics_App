const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const geminiPrompt = express.Router();

const API_KEY = process.env.GEMINI_API_KEY; 
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "You are a lyricist and must create a song based on the provided prompt and mood. Structure the song with an intro, chorus, verses, and a bridge. Be Creative and pull inspiration from other artists."
});

function getTemperature(){
    const temperatures = [0.5, 1, 1.5, 2];
    
 return temperatures[Math.floor(Math.random() * temperatures.length)]
}
const generationConfig = {
    temperature: getTemperature(),
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

geminiPrompt.get('/', (req, res) => {
    res.send('Welcome to the Gemini Prompt API!');
});

geminiPrompt.post('/', async (req, res) => {
    const { prompt, mood } = req.body;

    try {

        if (!prompt || !mood) {
            return res.status(400).json({ error: "Both 'prompt' and 'mood' are required." });
        }

        const structuredPrompt = `
        ${prompt}
        Create the Name for the song based on the context of the prompt and mood.
        Format the output as a JSON object with the following structuring for the song:
        {
            "mood": "${mood}",
            "name": "Song Name",
            "intro": "The intro of the song",
            "chorus": "The chorus of the song",
            "verses": ["Verse 1", "Verse 2", "Verse 3"],
            "bridge": "The bridge of the song"
        }
        Return only the JSON object without any additional text or markdown formatting.
        `;

        const response = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: structuredPrompt }] }],
            generationConfig
        });

        const song = response.response.text(); 

        let jsonResponse = song.trim();

        if (jsonResponse.startsWith('```json')) {
            jsonResponse = jsonResponse.slice(7); 
        }
        if (jsonResponse.endsWith('```')) {
            jsonResponse = jsonResponse.slice(0, -3); 
        }
        console.log("Generated song:", song);
        let parsedSong;

        try {
            parsedSong = JSON.parse(jsonResponse); 
            console.log("PARSED SONG:", parsedSong);
            console.log(generationConfig)

        } catch (error) {
            return res.status(500).json({ error: "Failed to parse song response as JSON." });
        }

        res.json(parsedSong); 
    } catch (error) {
        console.error("Error generating lyrics:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = geminiPrompt;
