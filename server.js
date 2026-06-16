const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/submit', async (req, res) => {
    const { email, answers } = req.body;

    if (!email || !answers || !Array.isArray(answers)) {
        return res.status(400).json({ error: 'Invalid submission data. Must include email and answers array.' });
    }

    if (!SLACK_WEBHOOK_URL) {
        console.warn('SLACK_WEBHOOK_URL is not set. Submission received but not sent to Slack.');
        return res.status(200).json({ message: 'Submission received, but Slack integration is not configured.' });
    }

    let slackMessage = `*New ACE Quiz Submission*\n*Email:* ${email}\n\n*Answers:*\n`;
    answers.forEach((ans, index) => {
        slackMessage += `Q${index + 1}: ${ans.question}\nAns: ${ans.answer}\n\n`;
    });

    try {
        await axios.post(SLACK_WEBHOOK_URL, {
            text: slackMessage
        });
        res.status(200).json({ message: 'Submission successful and posted to Slack.' });
    } catch (error) {
        console.error('Error posting to Slack:', error.message);
        res.status(500).json({ error: 'Failed to post submission to Slack.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
