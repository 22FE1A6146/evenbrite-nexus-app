
# Event Management System - Backend

A comprehensive Node.js/Express backend for an event management system with MongoDB.

## Features

- 🔐 JWT Authentication & Authorization
- 👥 User Management (Organizers & Attendees)
- 🎫 Event Management (CRUD Operations)
- 🎟️ Ticket Purchase & Management
- 📧 Email Notifications
- 📊 Analytics & Reporting
- 🏢 Venue Management
- 📱 QR Code Generation & Validation
- 🔒 Security Middleware
- 📝 Request Validation
- 📁 File Upload Support

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd event-management-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/event-management
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CLIENT_URL=http://localhost:5173
MAX_FILE_SIZE=5000000
UPLOAD_PATH=./uploads
```

5. Create uploads directory:
```bash
mkdir uploads
```

6. Start MongoDB service on your system

7. Seed the database with sample data:
```bash
npm run seed
```

8. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/dashboard` - Get dashboard data

### Events
- `GET /api/events` - Get all published events (with filtering)
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create new event (Organizers only)
- `PUT /api/events/:id` - Update event (Organizers only)
- `DELETE /api/events/:id` - Delete event (Organizers only)
- `GET /api/events/organizer/my-events` - Get organizer's events
- `POST /api/events/:id/publish` - Publish event

### Tickets
- `POST /api/tickets/purchase` - Purchase tickets
- `GET /api/tickets/my-tickets` - Get user's tickets
- `GET /api/tickets/:id` - Get single ticket
- `POST /api/tickets/:id/check-in` - Check in ticket
- `POST /api/tickets/validate-qr` - Validate QR code
- `GET /api/tickets/event/:eventId` - Get event tickets (Organizers only)

### Venues
- `GET /api/venues` - Get all venues
- `GET /api/venues/:id` - Get single venue
- `POST /api/venues` - Create venue (Organizers only)

### File Upload
- `POST /api/upload/image` - Upload image file

## Database Models

### User
- Authentication & profile information
- Role-based access (organizer/attendee)
- Password hashing with bcrypt

### Event
- Complete event information
- Organizer relationship
- Capacity & ticket tracking
- Status management (draft/published/cancelled)

### Ticket
- User-event relationship
- QR code generation
- Purchase tracking
- Check-in management

### Venue
- Venue information & facilities
- Address & contact details
- Capacity & layout information

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Request rate limiting
- Input validation & sanitization
- CORS protection
- Helmet security headers
- File upload restrictions

## Email Integration

The system includes email notifications for:
- Ticket purchase confirmation
- Event reminders
- Check-in confirmations

Configure your email provider in the `.env` file.

## Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

### Sample Data
After running the seed script, you can use these test accounts:
- **Organizer**: `organizer@example.com` / `password123`
- **Attendee**: `attendee@example.com` / `password123`

## File Structure

```
backend/
├── models/          # Database models
├── routes/          # API routes
├── middleware/      # Custom middleware
├── utils/           # Utility functions
├── scripts/         # Database scripts
├── uploads/         # File uploads directory
├── server.js        # Main server file
├── package.json     # Dependencies
└── README.md        # This file
```

## Error Handling

The API uses consistent error responses:
```json
{
  "message": "Error description",
  "errors": [] // Validation errors if applicable
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
```

