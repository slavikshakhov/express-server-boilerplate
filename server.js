const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const errorHandler = require('./middleware/error');
const dotenv = require('dotenv');
dotenv.config({path: './config/config.env'})

const connectDB = require('./config/db')
connectDB()

const courses = require('./routes/courses');
const professors = require('./routes/professors');
const auth = require('./routes/auth');
const users = require('./routes/users');

const app = express()

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

app.use(cors());
//app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/api/courses', courses)
app.use('/api/professors', professors)
app.use('/api/auth', auth);
app.use('/api/users', users);


app.use(errorHandler);

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`))
// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
