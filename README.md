# TaskFlow

A modern task management application with a clean and intuitive dashboard interface.

## Live Demo

- Frontend: [TaskFlow App](https://task-flow-five-xi.vercel.app/)
- Backend: [API Server](https://taskflow-backend.onrender.com) (Deployed on Render)

## Features

- **Modern Dashboard**: Clean and intuitive interface with task statistics
- **Task Management**: Create, update, and track tasks with priorities and due dates
- **Kanban Board**: Visual task organization with To Do, In Progress, and Completed columns
- **Real-time Updates**: Instant updates when tasks are created or modified
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Tech Stack

### Frontend
- React.js
- CSS3 with modern styling
- React Icons for UI elements
- Responsive design principles

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

## Deployment

### Frontend Deployment
- Deployed on [Vercel](https://task-flow-five-xi.vercel.app/)
- Automatic deployments from the main branch
- Optimized for production with static file serving

### Backend Deployment
- Hosted on [Render](https://taskflow-backend.onrender.com)
- Auto-scaling and high availability
- Secure HTTPS endpoints
- Environment variables managed through Render dashboard

## Local Development

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/sujith1976/TaskFlow.git
cd TaskFlow
```

2. Install dependencies for both frontend and backend
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Set up environment variables
Create a `.env` file in the server directory with:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5001
```

For local development, update the API base URL in the frontend to point to your local backend:
```javascript
// In client/src/config.js or similar
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://taskflow-backend.onrender.com'
  : 'http://localhost:5001';
```

4. Start the application
```bash
# Start backend server
cd server
npm start

# Start frontend in a new terminal
cd client
npm start
```

The application will be available at `http://localhost:3000` for local development.

## Features in Detail

### Dashboard
- Task statistics cards
- Visual representation of task progress
- Quick access to task creation
- Priority-based task organization

### Task Management
- Create new tasks with title, description, due date, and priority
- Update task status (To Do, In Progress, Completed)
- Priority levels (Low, Medium, High)
- Due date tracking

### User Interface
- Clean and modern design
- Intuitive navigation
- Responsive layout for all screen sizes
- Dark mode support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 