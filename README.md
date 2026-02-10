# Real-Time Collaborative Task Board

A full-stack kanban-style task management application with real-time collaboration using Socket.io.

![Task Board Demo](./demo.gif)

## 🚀 Features

- **Real-time Collaboration**: Multiple users can work on the same board simultaneously
- **Drag & Drop**: Intuitive kanban-style interface with drag-and-drop functionality
- **Task Management**: Create, edit, delete, and organize tasks
- **Board System**: Create multiple boards for different projects
- **Priority & Status**: Assign priorities and track task status
- **Tags**: Organize tasks with custom tags
- **User Authentication**: Secure JWT-based authentication
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Tailwind CSS
- Socket.io Client
- React Beautiful DnD
- Axios
- React Router

**Backend:**
- Node.js
- Express.js
- MongoDB
- Socket.io
- JWT Authentication
- Bcrypt
- Nodemon

## 📸 Screenshots

### Board View
![Board View](./screenshots/board.png)

### Create Task
![Create Task](./screenshots/create-task.png)

### Boards List
![Boards List](./screenshots/boards.png)

## 🏃‍♂️ Running Locally

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- Git

### Backend Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/task-board.git
cd task-board
```

2. Install backend dependencies
```bash
cd server
npm install
```

3. Create `.env` file in server folder
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

4. Start backend server
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Install frontend dependencies
```bash
cd client
npm install
```

2. Create `.env` file in client folder
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

3. Start frontend
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## 🌐 Live Demo

- **Frontend**: [https://task-board-demo.vercel.app](https://your-vercel-url.vercel.app)
- **Backend**: [https://task-board-api.onrender.com](https://your-render-url.onrender.com)

## 📁 Project Structure
```
task-board/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React Context (Auth, Board, Task)
│   │   ├── pages/         # Page components
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                # Node.js backend
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Auth middleware
│   ├── socket/           # Socket.io handlers
│   ├── server.js
│   └── package.json
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Boards
- `GET /api/boards` - Get all boards
- `POST /api/boards` - Create board
- `GET /api/boards/:id` - Get board by ID
- `PUT /api/boards/:id` - Update board
- `DELETE /api/boards/:id` - Delete board

### Tasks
- `GET /api/tasks/:boardId` - Get all tasks for a board
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## 🔌 Socket.io Events

### Client → Server
- `join-board` - Join a board room
- `leave-board` - Leave a board room
- `task-created` - Broadcast new task
- `task-updated` - Broadcast task update
- `task-deleted` - Broadcast task deletion
- `task-moved` - Broadcast task drag & drop

### Server → Client
- `task-created` - Receive new task
- `task-updated` - Receive task update
- `task-deleted` - Receive task deletion
- `task-moved` - Receive task movement

## 🎯 Key Features Explained

### Real-Time Collaboration
Uses Socket.io to broadcast task updates to all connected users in real-time. When one user creates, updates, or moves a task, all other users see the change instantly.

### Drag & Drop
Implemented using `react-beautiful-dnd` library. Tasks can be dragged between columns (To Do, In Progress, Done) with smooth animations.

### Optimistic UI Updates
Task movements are updated immediately in the UI (optimistic update) before the server confirms, providing a snappy user experience.

## 🚧 Future Enhancements

- Add comments to tasks
- File attachments
- Due dates and reminders
- Board templates
- Activity log/history
- Search and filter tasks
- Dark mode
- Email notifications
- Task assignments to specific users
- Board permissions/roles

## 📝 License

MIT License - feel free to use this project for learning or building your own applications.

## 👤 Author

**Your Name**
- GitHub: [@GRaman8](https://github.com/GRaman8)
- LinkedIn: [Ganapathi Deivanayagam](www.linkedin.com/in/ganapathi-raman)

<!-- - Portfolio: [yourwebsite.com](https://yourwebsite.com) -->

## 🙏 Acknowledgments

- Built as part of my portfolio to demonstrate full-stack development skills
- Inspired by tools like Trello and Jira