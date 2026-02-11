# Real-Time Collaborative Task Board

A full-stack kanban-style task management application with real-time collaboration using Socket.io.


## Demo

> **Live Demo:** [Real Time Collaborative Task Board](https://real-time-collaborative-task-board-tau.vercel.app/)


## Features

- **Real-time Collaboration**: Multiple users can work on the same board simultaneously via Socket.io
- **Drag & Drop**: Intuitive kanban-style interface with drag-and-drop (react-beautiful-dnd)
- **Task Management**: Create, edit, delete, and organize tasks across columns
- **Board System**: Create multiple boards for different projects
- **Priority & Status**: Assign priorities (Low, Medium, High) and track status (To Do, In Progress, Done)
- **Tags**: Organize tasks with custom tags
- **User Authentication**: Secure JWT-based authentication with Bcrypt password hashing
- **Input Validation**: Client and server-side validation using Zod
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

**Frontend:**
- React 18 (Vite)
- Tailwind CSS v4
- Socket.io Client
- React Beautiful DnD
- Axios
- React Router v7
- Recoil (state management)
- Zod (input validation)

**Backend:**
- Node.js
- Express.js v5
- MongoDB (Mongoose)
- Socket.io
- JWT Authentication
- Bcrypt.js
- Zod (request validation)

## Running Locally

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)
- Git

### Backend Setup

1. Clone the repository
```bash
git clone https://github.com/GRaman8/Real-time-collaborative-task-board.git
cd Real-time-collaborative-task-board
```

2. Install backend dependencies
```bash
cd server
npm install
```

3. Create `.env` file in the server folder
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
CLIENT_URL=http://localhost:5173
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

2. Create `.env` file in the client folder
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

3. Start frontend
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Project Structure
```
task-board/
├── client/                          # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── api/                     # Axios instance & API functions
│   │   │   ├── axios.js
│   │   │   ├── auth.js
│   │   │   ├── boards.js
│   │   │   └── tasks.js
│   │   ├── components/
│   │   │   ├── board/               # Board-related components
│   │   │   │   ├── BoardCard.jsx
│   │   │   │   ├── CreateBoardModal.jsx
│   │   │   │   └── EditBoardModal.jsx
│   │   │   ├── layout/              # Layout & auth components
│   │   │   │   ├── AuthInitializer.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── task/                # Task-related components
│   │   │   │   ├── CreateTaskModal.jsx
│   │   │   │   ├── EditTaskModal.jsx
│   │   │   │   ├── TaskCard.jsx
│   │   │   │   └── TaskColumn.jsx
│   │   │   └── ui/                  # Reusable UI components
│   │   │       ├── LoadingSpinner.jsx
│   │   │       └── Modal.jsx
│   │   ├── hooks/
│   │   │   └── useSocket.js         # Socket.io hook
│   │   ├── pages/
│   │   │   ├── BoardDetailPage.jsx  # Kanban board view
│   │   │   ├── BoardsPage.jsx       # Board list
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── store/                   # Recoil state atoms
│   │   │   ├── authAtom.js
│   │   │   ├── boardAtom.js
│   │   │   └── taskAtom.js
│   │   ├── validation/              # Zod schemas (client-side)
│   │   │   ├── authValidation.js
│   │   │   ├── boardValidation.js
│   │   │   └── taskValidation.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/                          # Node.js backend
│   ├── models/
│   │   ├── Board.js
│   │   ├── Task.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── boards.js
│   │   └── tasks.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── socket/
│   │   └── socketHandlers.js
│   ├── validation/                  # Zod schemas (server-side)
│   │   ├── authValidation.js
│   │   ├── boardValidation.js
│   │   └── taskValidation.js
│   ├── config.js
│   ├── server.js
│   └── package.json
└── README.md
```

## API Endpoints

All routes are prefixed with `/api/v1`.

### Authentication
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login user |
| GET | `/api/v1/auth/me` | Get current user (requires auth) |

### Boards
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/v1/boards` | Get all boards for user |
| POST | `/api/v1/boards` | Create board |
| GET | `/api/v1/boards/:id` | Get board by ID |
| PUT | `/api/v1/boards/:id` | Update board |
| DELETE | `/api/v1/boards/:id` | Delete board (cascades to tasks) |

### Tasks
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/v1/tasks/:boardId` | Get all tasks for a board |
| POST | `/api/v1/tasks` | Create task |
| PUT | `/api/v1/tasks/:id` | Update task |
| DELETE | `/api/v1/tasks/:id` | Delete task |

## Socket.io Events

### Client → Server
- `join-board` — Join a board room
- `leave-board` — Leave a board room
- `task-created` — Broadcast new task
- `task-updated` — Broadcast task update
- `task-deleted` — Broadcast task deletion
- `task-moved` — Broadcast task drag & drop

### Server → Client
- `task-created` — Receive new task
- `task-updated` — Receive task update
- `task-deleted` — Receive task deletion
- `task-moved` — Receive task movement

## Key Implementation Details

### Real-Time Collaboration
Socket.io broadcasts task updates to all connected users in the same board room. When one user creates, updates, or moves a task, all other users see the change instantly.

### Drag & Drop
Implemented using `react-beautiful-dnd`. Tasks can be dragged between columns (To Do, In Progress, Done) with optimistic UI updates — the interface responds immediately while the server persists the change in the background.

### Authentication Flow
JWT tokens are stored in localStorage. On app load, `AuthInitializer` verifies the token against `/auth/me` — user details are only kept in Recoil memory state, never in localStorage.

### Cascade Deletion
When a board is deleted, all associated tasks are automatically removed from the database via `Task.deleteMany()`.

## Deployment

- **Frontend**: Deployed on [Vercel](https://vercel.com) with automatic Git deploys
- **Backend**: Deployed on [Render](https://render.com) free tier with a `/health` endpoint for uptime monitoring

## Future Enhancements

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

## License

MIT License — feel free to use this project for learning or building your own applications.

## Author

**Ganapathi Raman**
- GitHub: [@GRaman8](https://github.com/GRaman8)
- LinkedIn: [Ganapathi Deivanayagam](https://linkedin.com/in/ganapathi-raman)

## Acknowledgments

- Built as part of my portfolio to demonstrate full-stack development skills
- Inspired by tools like Trello and Jira