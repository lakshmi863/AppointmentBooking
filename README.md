                                 ** AppointmentBooking System**
AppointmentBooking  System is a full-stack web application designed to facilitate doctor appointment scheduling.
It consists of a backend (Node.js, Express, MongoDB) and a frontend (React.js). Users can view available doctors, check appointment slots, and book appointments.

**Features**

Doctor management

Appointment booking with availability check

Overlapping appointment prevention

Frontend for easy appointment scheduling

**Tech Stack**

Backend: Node.js, Express, MongoDB

Frontend: React.js, Axios

Libraries Used: body-parser, mongoose, cors, date-fns

**Installation and Running the Project**

**1. Backend Setup**

Install dependencies:

cd backend
npm install

Start MongoDB (ensure MongoDB is running locally)

mongod

Start the backend server:

npm start

Runs on http://localhost:5000

**2. Frontend Setup**

Install dependencies:

cd frontend
npm install

Start the React frontend:

npm start

Runs on http://localhost:3000

**API Endpoints**

**Doctors API**

GET /doctors - Fetch all doctors

GET /doctors/:id/slots?date=YYYY-MM-DD - Fetch available slots for a doctor on a given date

**Appointments API**

GET /appointments - Fetch all appointments

POST /appointments - Book an appointment

PUT /appointments/:id - Update an appointment

DELETE /appointments/:id - Cancel an appointment

**Assumptions and Design Decisions**

Doctor working hours are stored per doctor and used for slot generation.

Appointments are booked in 30-minute slots to simplify scheduling.

Overlapping prevention: A new appointment is rejected if it conflicts with an existing one.

Frontend directly interacts with the backend API using Axios.

