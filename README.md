# Zapier Approval Integration

A full-stack application that allows users to approve Zapier connections via a custom OAuth flow. Built with **React.js + Vite** for the frontend and **Node.js + Express + MongoDB** for the backend.

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Setup](#setup)  
- [Environment Variables](#environment-variables)  
- [Usage](#usage)  
- [API Endpoints](#api-endpoints)  
- [Ngrok for Local Testing](#ngrok-for-local-testing)  

---

## Features

- User approval flow for Zapier integrations.  
- Secure token generation for access and refresh tokens.  
- Structured error handling with detailed backend messages.  
- Redirect users to frontend approval page with parameters.  
- Display backend errors directly to the user in alerts.  

---

## Tech Stack

- **Frontend:** React.js, Vite, JavaScript, HTML, CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose)  
- **Authentication:** Bearer tokens, Authorization Code flow   

---

## Setup

1. Clone the repository:

```bash
git clone <your-repo-url>
cd <repo-folder>

# Install backend dependencies:
cd server
npm install

Environment Variables

Create a .env file in the server folder with the following:
PORT=5000
DATABASE_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>
ZAPIER_CLIENT_ID=your_zapier_client_id
ZAPIER_CLIENT_SECRET=your_zapier_client_secret
FRONTEND_APPROVE_URL=http://localhost:5173/zapier/authorize



node index.js

Server will run at http://localhost:5000.

Ngrok for Local Testing

To test the Zapier integration locally, your APIs need to be publicly accessible. Use Ngrok
 to expose your local server:
ngrok http 5000
https://b8a1d502540a.ngrok-free.app
| Endpoint     | Description                                       |
| ------------ | ------------------------------------------------- |
| `/authorize` | Starts the OAuth flow                             |
| `/approve`   | Approve user from client side                     |
| `/token`     | Exchanges the authorization code for access token |
| `/me`        | Fetches user details after authentication         |

Full URLs with Ngrok:
https://b8a1d502540a.ngrok-free.app/api/zapier/authorize
https://b8a1d502540a.ngrok-free.app/api/zapier/approve
https://b8a1d502540a.ngrok-free.app/api/zapier/token
https://b8a1d502540a.ngrok-free.app/api/zapier/me

This makes your local server accessible to Zapier for testing the OAuth flow.


## Frontend
Install frontend dependencies:
cd client
npm install
npm run dev

App will run at http://localhost:5173.
Open the frontend URL in your browser.
Click Approve Connection to authorize Zapier.
Backend handles token generation and redirects the user.
Any backend errors will be displayed in alerts on the frontend.








