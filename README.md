# Gadget Marketplace

A full-stack web application for buying and selling gadgets. Users can post their gadgets for sale, browse available gadgets, and contact sellers through phone or UPI.

## Features

- User authentication (login/register)
- Post gadgets for sale with images
- Browse available gadgets
- View personal listings
- Contact sellers via phone or UPI
- Responsive design
- Modern UI/UX

## Tech Stack

### Frontend
- React
- React Router
- Axios
- CSS3

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/Harsh6530/BTP-2.git
cd BTP-2
```

2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables
- Create `.env` file in backend directory
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

4. Run the application
```bash
# Run backend (from backend directory)
npm start

# Run frontend (from frontend directory)
npm run dev
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/) 