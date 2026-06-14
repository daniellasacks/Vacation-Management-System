# Vacation Management System

A full-stack web application for managing vacations with user authentication, like/unlike functionality, and admin management features.

## Features

### User Features
- User registration and login
- View vacations with pagination (9 per page)
- Like/unlike vacations
- Filter vacations (All, Liked, Active, Upcoming)
- Responsive design

### Admin Features
- Add, edit, and delete vacations
- Upload vacation images
- View vacation reports with charts
- Export reports to CSV
- Manage all vacation data

## Technology Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: MySQL
- **Frontend**: React, TypeScript
- **Authentication**: JWT tokens
- **Charts**: Recharts
- **File Upload**: Multer

## Project Structure

```
Final Project/
├── Database/
│   └── schema.sql
├── Backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── index.ts
│   ├── uploads/
│   ├── package.json
│   └── tsconfig.json
└── Frontend/
    ├── src/
    │   ├── components/
    │   ├── contexts/
    │   ├── pages/
    │   ├── services/
    │   ├── types/
    │   └── utils/
    ├── public/
    ├── package.json
    └── tsconfig.json
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE vacation_management;
```

2. Import the schema:
```bash
mysql -u root -p vacation_management < Database/schema.sql
```

3. Update database credentials in `Backend/config.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=vacation_management
```

### Backend Setup

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Update the JWT secret in `config.env`:
```
JWT_SECRET=your_secure_jwt_secret_here
```

4. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the Frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Default Credentials

### Admin User
- Email: `admin@vacation.com`
- Password: `admin123`

### Regular Users
- Email: `john.doe@email.com`
- Password: `password123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Vacations
- `GET /api/vacations` - Get vacations (with pagination and filters)
- `GET /api/vacations/:id` - Get vacation by ID
- `POST /api/vacations` - Create vacation (Admin only)
- `PUT /api/vacations/:id` - Update vacation (Admin only)
- `DELETE /api/vacations/:id` - Delete vacation (Admin only)
- `POST /api/vacations/:id/like` - Like vacation
- `DELETE /api/vacations/:id/like` - Unlike vacation
- `GET /api/vacations/report` - Get vacation report (Admin only)

## Sample Data

The database includes 14 sample vacations with real destinations and data:
- Paris, France
- Tokyo, Japan
- New York City, USA
- Rome, Italy
- Barcelona, Spain
- Sydney, Australia
- London, England
- Dubai, UAE
- Bali, Indonesia
- Amsterdam, Netherlands
- Santorini, Greece
- Machu Picchu, Peru
- Reykjavik, Iceland
- Cape Town, South Africa

## Features Implemented

✅ User registration and login
✅ JWT authentication
✅ Vacation CRUD operations
✅ Like/unlike functionality
✅ Pagination (9 vacations per page)
✅ Filtering (All, Liked, Active, Upcoming)
✅ Admin role management
✅ Image upload for vacations
✅ Vacation reports with charts
✅ CSV export functionality
✅ Responsive design
✅ TypeScript implementation
✅ Error handling and validation

## Development

### Backend Development
```bash
cd Backend
npm run dev  # Start with nodemon
npm run build  # Build for production
npm start  # Start production build
```

### Frontend Development
```bash
cd Frontend
npm start  # Start development server
npm run build  # Build for production
```

## Production Deployment

1. Build the frontend:
```bash
cd Frontend
npm run build
```

2. Build the backend:
```bash
cd Backend
npm run build
```

3. Start the backend:
```bash
npm start
```

4. Serve the frontend build files through a web server or the backend static file serving.

## License

This project is created for educational purposes as part of a Full Stack Web Developer course.
