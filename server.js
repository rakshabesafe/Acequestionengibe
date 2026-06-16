const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK;
const submissions = {};
const correctAnswers = {
    "What does ACE stand for?": "Agent Certification Engine",
    "What is the primary purpose of AgentCert?": "To run certification experiments and produce formal reliability reports for AI agents",
    "Which open source benchmark framework from Microsoft Research does ACE extend?": "AIOpsLab",
    "What is the underlying chaos engineering layer in ACE built on?": "LitmusChaos",
    "According to Presentation, , what is the #1 unresolved challenge in production AI deployment?": "Reliability",
    "How many independent runs per failure scenario does ACE typically perform for statistical rigor?": "30+",
    "Which of these is NOT one of the 3 steps of the ACE pipeline?": "Manually review log samples",
    "What command is used to bring up the entire ACE stack via Docker?": "docker compose up -d",
    "In the context of Healthcare & Life Sciences, what is a silent degradation of an agent considered as?": "A missed diagnosis",
    "What is the first agent that was certified using AgentCert?": "An SRE (Site Reliability Engineering) agent",
    "What module represents the fault library": "SRE library",
    "What is the sandbox environment supported ? A. Kubernetes, B. Azure foundry C. AWS agentcore D. Openstack": "A. Kubernetes"
};

const questionsList = [
    "What does ACE stand for?",
    "What is the primary purpose of AgentCert?",
    "Which open source benchmark framework from Microsoft Research does ACE extend?",
    "What is the underlying chaos engineering layer in ACE built on?",
    "According to Presentation, , what is the #1 unresolved challenge in production AI deployment?",
    "How many independent runs per failure scenario does ACE typically perform for statistical rigor?",
    "Which of these is NOT one of the 3 steps of the ACE pipeline?",
    "What command is used to bring up the entire ACE stack via Docker?",
    "In the context of Healthcare & Life Sciences, what is a silent degradation of an agent considered as?",
    "What is the first agent that was certified using AgentCert?",
    "What module represents the fault library",
    "What is the sandbox environment supported ? A. Kubernetes, B. Azure foundry C. AWS agentcore D. Openstack"
];

const questionOptions = {
    "What does ACE stand for?": [
        "Artificial Computing Environment",
        "Agent Certification Engine",
        "Automated Cloud Execution",
        "Advanced Control Engine"
    ],
    "What is the primary purpose of AgentCert?": [
        "To build new Large Language Models",
        "To deploy applications to Kubernetes automatically",
        "To run certification experiments and produce formal reliability reports for AI agents",
        "To replace human software developers"
    ],
    "Which open source benchmark framework from Microsoft Research does ACE extend?": [
        "AutoGen",
        "LiteLLM",
        "LitmusChaos",
        "AIOpsLab"
    ],
    "What is the underlying chaos engineering layer in ACE built on?": [
        "Gremlin",
        "Chaos Mesh",
        "LitmusChaos",
        "AWS Fault Injection Simulator"
    ],
    "According to Presentation, , what is the #1 unresolved challenge in production AI deployment?": [
        "High latency",
        "Inference cost",
        "Data privacy",
        "Reliability"
    ],
    "How many independent runs per failure scenario does ACE typically perform for statistical rigor?": [
        "1",
        "5",
        "30+",
        "100+"
    ],
    "Which of these is NOT one of the 3 steps of the ACE pipeline?": [
        "Break things on purpose",
        "Measure what actually happens",
        "Manually review log samples",
        "Receive a report you can stand behind"
    ],
    "What command is used to bring up the entire ACE stack via Docker?": [
        "npm start",
        "kubectl apply -f manifest.yaml",
        "docker compose up -d",
        "python run.py"
    ],
    "In the context of Healthcare & Life Sciences, what is a silent degradation of an agent considered as?": [
        "A minor UI bug",
        "Expected behavior",
        "A missed diagnosis",
        "A network timeout"
    ],
    "What is the first agent that was certified using AgentCert?": [
        "A Healthcare diagnostic agent",
        "An E-commerce recommendation agent",
        "A Legal contract review agent",
        "An SRE (Site Reliability Engineering) agent"
    ],
    "What module represents the fault library": [
        "SRE library",
        "ITOps",
        "Kubernetes",
        "Chaos Mesh"
    ],
    "What is the sandbox environment supported ? A. Kubernetes, B. Azure foundry C. AWS agentcore D. Openstack": [
        "A. Kubernetes",
        "B. Azure foundry",
        "C. AWS agentcore",
        "D. Openstack"
    ]
};


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/submit', async (req, res) => {
    const { email, answers } = req.body;

    if (!email || !answers || !Array.isArray(answers)) {
        return res.status(400).json({ error: 'Invalid submission data. Must include email and answers array.' });
    }

    if (submissions[email] === undefined) {
        submissions[email] = 0;
    }

    if (submissions[email] >= 3) {
        return res.status(400).json({ error: 'You have already submitted and you have 0 turns to resubmit.' });
    }

    submissions[email]++;
    const turnsLeft = 3 - submissions[email];
    const successMessage = `Thank you! Your answers have been submitted successfully. You have ${turnsLeft} turns left to resubmit.`;

    if (!SLACK_WEBHOOK_URL) {
        console.warn('SLACK_WEBHOOK_URL is not set. Submission received but not sent to Slack.');
        return res.status(200).json({ message: successMessage });
    }

    let correctCount = 0;
    const choiceLetters = ['A', 'B', 'C', 'D'];
    const selectedChoices = [];

    questionsList.forEach((qText) => {
        const userAnswerObj = answers.find(a => a.question === qText);
        const userAnswer = userAnswerObj ? userAnswerObj.answer : null;

        if (userAnswer && userAnswer === correctAnswers[qText]) {
            correctCount++;
        }

        if (userAnswer && questionOptions[qText]) {
            const index = questionOptions[qText].indexOf(userAnswer);
            if (index !== -1) {
                selectedChoices.push(choiceLetters[index]);
            } else {
                selectedChoices.push('');
            }
        } else {
            selectedChoices.push('');
        }
    });

    const choicesString = selectedChoices.join(',');
    const slackMessage = `${email} + ${correctCount} + ${choicesString}`;

    try {
        await axios.post(SLACK_WEBHOOK_URL, {
            text: slackMessage
        });
        res.status(200).json({ message: successMessage });
    } catch (error) {
        console.error('Error posting to Slack:', error.message);
        res.status(500).json({ error: 'Failed to post submission to Slack.' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
