// llm.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

// Check if API key is loaded
const API_KEY = process.env.OPENROUTER_API_KEY;
if (!API_KEY) {
    console.error('ERROR: OPENROUTER_API_KEY not found in .env file');
    console.error('Please ensure .env file exists in project root with: OPENROUTER_API_KEY=your_key');
    process.exit(1);
} else {
    console.log('✓ OPENROUTER_API_KEY loaded successfully');
}

app.post('/api/generate-feedback', async (req, res) => {
    try {
        const { bio } = req.body;
        
        if (!bio) {
            return res.status(400).json({ error: 'Bio is required' });
        }

        console.log('🔵 Calling OpenRouter API with bio length:', bio.length);
        
        // Set a 35 second timeout for the entire request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            console.error('⏱️ Request timeout triggered');
            controller.abort();
        }, 17000);
        
        try {
            console.log('🔵 Fetching from OpenRouter...');
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`,
                    'HTTP-Referer': 'http://localhost:3000',
                    'X-Title': 'Axxess Heart Health'
                },
                body: JSON.stringify({
                    model: 'openrouter/free',
                    messages: [{ 
                        role: 'user', 
                        content: `You are a healthcare expert. Given this patient profile with their CVD risk, provide 3-4 specific lifestyle recommendations bulleted (1 - 4) slightly detailed avoid md. Dont do an introduction just start with the bullet points. :\n\n${bio}` 
                    }],
                    max_tokens: 5000,
                    temperature: 0.7
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            console.log("🟢 OpenRouter Response Status:", response.status);
            console.log("🟢 Response headers:", {
                contentType: response.headers.get('content-type'),
                contentLength: response.headers.get('content-length')
            });
            
            // Read response as text first for debugging
            console.log('🔵 Reading response body...');
            const text = await response.text();
            console.log('🟢 Response body length:', text.length);
            console.log('🟢 Response body (first 500 chars):', text.substring(0, 500));
            
            if (!text) {
                console.error('🔴 Empty response body');
                const fallbackFeedback = `• Schedule a check-up with your doctor\n• Aim for 150 minutes of moderate exercise weekly\n• Reduce salt and processed foods\n• Manage stress through relaxation techniques`;
                return res.json({ feedback: fallbackFeedback, source: 'fallback-empty' });
            }
            
            let data;
            try {
                data = JSON.parse(text);
                console.log('🟢 Successfully parsed JSON');
            } catch (parseError) {
                console.error('🔴 Failed to parse JSON:', parseError.message);
                const fallbackFeedback = `• Schedule a check-up with your doctor\n• Aim for 150 minutes of moderate exercise weekly\n• Reduce salt and processed foods\n• Manage stress through relaxation techniques`;
                return res.json({ feedback: fallbackFeedback, source: 'fallback-parse-error' });
            }
            
            if (!response.ok) {
                console.error("🔴 OpenRouter Error:", data);
                const fallbackFeedback = `• Schedule a check-up with your doctor\n• Aim for 150 minutes of moderate exercise weekly\n• Reduce salt and processed foods\n• Manage stress through relaxation techniques`;
                return res.json({ feedback: fallbackFeedback, source: 'fallback-api-error' });
            }
            
            const feedback = data.choices?.[0]?.message?.content || "No feedback received";
            console.log("🟢 Generated feedback length:", feedback.length);
            console.log("🟢 Feedback preview:", feedback.substring(0, 100));
            res.json({ feedback, source: 'openrouter' });
        } catch (fetchError) {
            clearTimeout(timeoutId);
            console.error('🔴 Fetch error:', fetchError.name, fetchError.message);
            if (fetchError.name === 'AbortError') {
                console.error('⏱️ OpenRouter API request timed out (35s)');
                const fallbackFeedback = `• Schedule a check-up with your doctor\n• Aim for 150 minutes of moderate exercise weekly\n• Reduce salt and processed foods\n• Manage stress through relaxation techniques`;
                return res.json({ feedback: fallbackFeedback, source: 'fallback-timeout' });
            }
            throw fetchError;
        }
    } catch (error) {
        console.error('🔴 Error in /api/generate-feedback:', error.message);
        console.error('🔴 Stack trace:', error.stack);
        // Return fallback recommendations on any error
        const fallbackFeedback = `• Schedule a check-up with your doctor\n• Aim for 150 minutes of moderate exercise weekly\n• Reduce salt and processed foods\n• Manage stress through relaxation techniques`;
        res.json({ feedback: fallbackFeedback, source: 'fallback-error' });
    }
});

// LLM Feedback service runs on port 5000
app.listen(5000, () => console.log('LLM Service running on http://localhost:5000'));