# ChatApp
Software that will let you chat with others in real time

ChatApp
A real-time chat application built using Node.js, Express, Socket.io, and MongoDB (local database).

Features
✅ Real-time messaging using Socket.io
✅ Room-based chat functionality
✅ Responsive UI with Tailwind CSS
✅ Local MongoDB database connection

Installation

1. Clone the Repository
    git clone https://github.com/mallicksoumik1711/ChatApp.git
    cd ChatApp
2. Install Dependencies
    npm install
3. Start MongoDB Locally (Make sure MongoDB is installed on your system and running):
    mongod --dbpath /path/to/data/db
    ------------------either start the mongodb server ------------
    net start MongoDB  # (For Windows)
    sudo systemctl start mongod  # (For Linux)
4. Start the server
    npx nodemon app.js
    -----or you can write your own scripts in the package.json file-------

Project Structure
ChatApp/
│── public/          # Static assets (CSS, JS)
│── views/           # EJS templates for frontend
│── models/          # Mongoose models
│── app.js        # Entry point
│── package.json     # Dependencies & scripts
└── README.md        # Project documentation

Tech Stack
Frontend: EJS, Tailwind CSS
Backend: Node.js, Express.js
Database: MongoDB (Local)
Real-time Communication: Socket.io