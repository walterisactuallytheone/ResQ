# ResQ - Healthcare Management System

ResQ is a comprehensive healthcare management system designed to help users manage their medical needs, appointments, and reminders.

## Features

- User Authentication (Login/Signup)
- Medical Reminders
- Appointment Scheduling
- User Profile Management
- Responsive Design

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Frontend**: EJS Templates
- **Authentication**: JWT, bcrypt
- **Email**: Nodemailer

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/resq.git
cd resq
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
PORT=3000
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
ResQ/
├── server/           # Backend server code
│   ├── models/      # Database models
│   └── routes/      # API routes
├── views/           # Frontend templates
│   ├── layouts/     # Layout templates
│   ├── partials/    # Reusable components
│   └── components/  # UI components
├── public/          # Static assets
└── index.js         # Application entry point
```

## API Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/reminders` - Get all reminders
- `POST /api/reminders` - Create a new reminder
- `PUT /api/reminders/:id` - Update a reminder
- `DELETE /api/reminders/:id` - Delete a reminder

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to all contributors
- Special thanks to the hackathon organizers 