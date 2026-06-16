# Acequestionengibe

This is a web application created for participants of an Open Source Summit session about the ACE (Agent Certification Engine) framework.

The application allows participants to answer a 10-question multiple-choice quiz about ACE and submit their answers along with their email address. Upon submission, the application formats the answers and posts them to a configured Slack channel.

## Requirements

* Node.js
* npm

## Setup

1.  Clone the repository and install dependencies:
    \`npm install\`

2.  Configure your Slack Webhook URL. You can set this as an environment variable before starting the application:
    \`export SLACK_WEBHOOK_URL="your_slack_webhook_url_here"\`

3.  Start the server:
    \`node server.js\`

4.  Access the application in your web browser at http://localhost:3000.

## Features

*   **10-Question Quiz:** Automatically generated questions based on the ACE framework features.
*   **Slack Integration:** Submits quiz results directly to your designated Slack channel.
*   **Responsive UI:** Clean, readable format styled for ease of use.
*   **Repository Information:** Contains a prominent link to the [ACE Monorepo](https://agentcert.github.io/ace-monorepo/).
