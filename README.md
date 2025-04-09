# CyclePath Rentals - MERN Stack Bike Rental Application

A full-featured bike rental application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- User authentication and profile management
- Bike browsing with filtering options
- Booking system with date selection
- Admin dashboard for rental management
- Responsive design for all devices

## Technology Stack

### Backend
- **Node.js** and **Express**: Server-side framework
- **MongoDB**: Database with Mongoose ODM
- **JWT**: Authentication mechanism
- **bcryptjs**: Password hashing

### Frontend
- **React**: Frontend library
- **React Router**: Client-side routing
- **Context API**: State management
- **Axios**: HTTP client
- **React Toastify**: Notifications

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- MongoDB (local or Atlas connection)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/cyclepath-rentals.git
   cd cyclepath-rentals
   ```

2. Install server dependencies
   ```
   npm install
   ```

3. Install client dependencies
   ```
   cd client
   npm install
   cd ..
   ```

4. Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

5. Start the development server (concurrently runs backend and frontend)
   ```
   npm run dev
   ```

## Application Structure

```
cyclepath-rentals/
  ├── client/                 # React frontend
  │   ├── public/             # Static files
  │   └── src/                # React source code
  │       ├── components/     # React components
  │       ├── context/        # Context API state
  │       ├── utils/          # Utility functions
  │       └── App.js          # Main app component
  ├── models/                 # MongoDB models
  ├── routes/                 # API routes
  ├── middleware/             # Express middleware
  ├── server.js               # Express server
  └── package.json            # Project dependencies
```

## API Endpoints

### Auth Routes
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Authenticate user & get token
- `GET /api/users/me` - Get current user profile

### Cycles Routes
- `GET /api/cycles` - Get all cycles
- `GET /api/cycles/:id` - Get cycle by ID
- `POST /api/cycles` - Add a new cycle (admin only)
- `PUT /api/cycles/:id` - Update cycle (admin only)
- `DELETE /api/cycles/:id` - Delete cycle (admin only)

### Bookings Routes
- `GET /api/bookings` - Get all bookings (admin only)
- `GET /api/bookings/my` - Get user bookings
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings` - Create a booking
- `PUT /api/bookings/:id` - Update booking status
- `DELETE /api/bookings/:id` - Delete a booking

## License

This project is licensed under the MIT License.

## Acknowledgments

- Original design inspired by Royal Brothers Bike Rental
- Icons provided by Font Awesome
- Font family: Inter from Google Fonts
