const questions = [
    {
        id: "q1",
        text: "What does ACE stand for?",
        options: [
            "Artificial Computing Environment",
            "Agent Certification Engine",
            "Automated Cloud Execution",
            "Advanced Control Engine"
        ]
    },
    {
        id: "q2",
        text: "What is the primary purpose of AgentCert?",
        options: [
            "To build new Large Language Models",
            "To deploy applications to Kubernetes automatically",
            "To run certification experiments and produce formal reliability reports for AI agents",
            "To replace human software developers"
        ]
    },
    {
        id: "q3",
        text: "Which open source benchmark framework from Microsoft Research does ACE extend?",
        options: [
            "AutoGen",
            "LiteLLM",
            "LitmusChaos",
            "AIOpsLab"
        ]
    },
    {
        id: "q4",
        text: "What is the underlying chaos engineering layer in ACE built on?",
        options: [
            "Gremlin",
            "Chaos Mesh",
            "LitmusChaos",
            "AWS Fault Injection Simulator"
        ]
    },
    {
        id: "q5",
        text: "According to Presentation, , what is the #1 unresolved challenge in production AI deployment?",
        options: [
            "High latency",
            "Inference cost",
            "Data privacy",
            "Reliability"
        ]
    },
    {
        id: "q6",
        text: "How many independent runs per failure scenario does ACE typically perform for statistical rigor?",
        options: [
            "1",
            "5",
            "30+",
            "100+"
        ]
    },
    {
        id: "q7",
        text: "Which of these is NOT one of the 3 steps of the ACE pipeline?",
        options: [
            "Break things on purpose",
            "Measure what actually happens",
            "Manually review log samples",
            "Receive a report you can stand behind"
        ]
    },
    {
        id: "q8",
        text: "What command is used to bring up the entire ACE stack via Docker?",
        options: [
            "npm start",
            "kubectl apply -f manifest.yaml",
            "docker compose up -d",
            "python run.py"
        ]
    },
    {
        id: "q9",
        text: "In the context of Healthcare & Life Sciences, what is a silent degradation of an agent considered as?",
        options: [
            "A minor UI bug",
            "Expected behavior",
            "A missed diagnosis",
            "A network timeout"
        ]
    },
    {
        id: "q10",
        text: "What is the first agent that was certified using AgentCert?",
        options: [
            "A Healthcare diagnostic agent",
            "An E-commerce recommendation agent",
            "A Legal contract review agent",
            "An SRE (Site Reliability Engineering) agent"
        ]
    },
    {
        id: "q11",
        text: "What module represents the fault library",
        options: [
            "SRE library",
            "ITOps",
            "Kubernetes",
            "Chaos Mesh"
        ]
    },
    {
        id: "q12",
        text: "What is the sandbox environment supported ? A. Kubernetes, B. Azure foundry C. AWS agentcore D. Openstack",
        options: [
            "A. Kubernetes",
            "B. Azure foundry",
            "C. AWS agentcore",
            "D. Openstack"
        ]
    }
];

const quizContainer = document.getElementById('quiz-container');

// Render questions
questions.forEach((q, index) => {
    const questionBlock = document.createElement('div');
    questionBlock.className = 'question-block';

    const questionText = document.createElement('div');
    questionText.className = 'question-text';
    questionText.textContent = `${index + 1}. ${q.text}`;
    questionBlock.appendChild(questionText);

    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'options';

    q.options.forEach(opt => {
        const label = document.createElement('label');
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = q.id;
        radio.value = opt;


        label.appendChild(radio);
        label.appendChild(document.createTextNode(opt));
        optionsDiv.appendChild(label);
    });

    questionBlock.appendChild(optionsDiv);
    quizContainer.appendChild(questionBlock);
});

// Handle form submission
document.getElementById('quiz-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('submit-btn');
    const statusMessage = document.getElementById('status-message');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    statusMessage.className = '';
    statusMessage.textContent = '';

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const answers = [];

    questions.forEach(q => {
        answers.push({
            question: q.text,
            answer: formData.get(q.id)
        });
    });

    try {
        const response = await fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, answers })
        });

        const data = await response.json();

        if (response.ok) {
            statusMessage.className = 'success';
            statusMessage.textContent = data.message || 'Thank you! Your answers have been submitted successfully.';
            e.target.reset(); // clear form
        } else {
            statusMessage.className = 'error';
            statusMessage.textContent = data.error || 'Failed to submit quiz. Please try again.';
        }
    } catch (error) {
        statusMessage.className = 'error';
        statusMessage.textContent = 'Network error. Please try again.';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Quiz';
    }
});
