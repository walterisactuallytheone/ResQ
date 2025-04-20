<h1 align="center">ResQ – Healthcare Management System</h1>

<p align="center">
  <img src="https://res.cloudinary.com/dcd51y8m1/image/upload/v1745081757/ResQ/py9xbcsisb5trysxlu9e.png" alt="ResQ Banner" width="80%"/>
</p>

<h2 align="center">Problem Statement 5: Elderly Care Reminder System (WEB-004)</h2>

<p align="center">
  Imagine Rahul's grandpa, Mr. Sharma, who thinks his pills are on a secret mission because he keeps forgetting them—again and again! Meanwhile, Rahul's juggling deadlines, laundry, and grandma's famous but forgettable cookie recipes. It's like herding cats who forgot they're cats! What he needs is a sidekick that reminds grandpa about meds, nudges for appointments, and gives Rahul ultimate peace of mind.
  
  ⚠️ <strong>Under Construction:</strong> Currently more blueprint than building—ResQ isn't live yet, but here's what's coming!
</p>

---

## 🚧 Quick Overview (Implemented & Planned Features)

- **Authentication**: Sign up, login & logout (JWT, bcryptjs, sessions)
- **Appointment Management**: Schedule, view & cancel (doctor, specialty, date & time)
- **Medication Reminders**: Multi-dose meds & flexible frequency options
- **Responsive UI**: Built with EJS, Bootstrap, HTML5/CSS3, JavaScript & jQuery
- **Email Notifications**: SendGrid integration with delivery status tracking
- **Ambulance Services**: Emergency booking with location tracking
- **PWA Support** (Planned): Installable on desktop & mobile home screens
- **Push Notifications** (Planned): Web Push API implementation
- **Advanced Reminder System** (Planned): Custom schedules & recurring alerts
- **Medical Records & Directories** (Planned): Upload history, search doctors & hospitals
- **Quick-Med Delivery** (Planned): Under 20‑minute medicine delivery
- **Hospital Bed Availability** (Planned): Real‑time tracker of empty beds
- **Treatment Directory** (Planned): Browse all treatments offered by hospitals
- **Doctor Directory & Booking** (Planned): Doctor profiles with one‑click appointment

---

## 🧐 Detailed Features

### ✅ Implemented
- **User Authentication**  
  - Sign up / Login / Logout  
  - JWT, bcryptjs, express-session & cookie‑parser
- **Appointment Management**  
  - Schedule, view & cancel medical appointments  
  - Select doctor, specialty, date & time
  - Email reminders (day before, hour before, at appointment time)
  - Visual status indicators for reminder delivery status
- **Medication Reminders**  
  - Add medications with multiple dosage times  
  - Flexible frequency (daily, twice daily, custom…)
  - Email notifications with status tracking
- **Responsive UI**  
  - Works flawlessly across devices (mobile & desktop)
- **Emergency Services**
  - Ambulance booking with location details
  - Ambulance tracking functionality
- **Email Notifications** 
  - SendGrid integration for reliable delivery
  - Configurable notification preferences

### 🚧 Planned
- **Push Notifications** with Web Push API  
- **Progressive Web App (PWA)** support  
- **Advanced Reminder System** (custom schedules beyond current options)  
- **Medical Records** upload & history tracking  
- **Doctor/Hospital Directory** (search, profiles, services)  
- **Quick-Med Delivery** — under 20‑minute medicine delivery shop  
- **Hospital Bed Availability** — real‑time records of empty beds  
- **Treatment Directory** — list of all treatments available in hospitals  
- **Doctor Directory & Booking** — details of all doctors with appointment booking option

---

## 📸 Screenshots

<p align="center">
  <img src="https://res.cloudinary.com/dcd51y8m1/image/upload/v1745081756/ResQ/conkdvhnjbgw3r5llv0a.png" alt="Add Medication Reminder" width="30%"/>
  <img src="https://res.cloudinary.com/dcd51y8m1/image/upload/v1745081756/ResQ/l7jido6zwvduzcs8mlet.png" alt="Sign Up Page" width="30%"/>
  <img src="https://res.cloudinary.com/dcd51y8m1/image/upload/v1745081756/ResQ/sbbcxlnmym7e5bcptfbn.png" alt="Login Page" width="30%"/>
</p>
<p align="center">
  <img src="https://res.cloudinary.com/dcd51y8m1/image/upload/v1745081756/ResQ/etjnyzrrefenohp5yc6g.png" alt="Appointment Scheduling" width="30%"/>
  <img src="https://res.cloudinary.com/dcd51y8m1/image/upload/v1745081757/ResQ/i1lhcswew5vfhydv0zgk.png" alt="Medication Database" width="30%"/>
  <img src="https://res.cloudinary.com/dcd51y8m1/image/upload/v1745081756/ResQ/kzkxnhdvmxljfjsvoxs7.png" alt="Appointments in Database" width="30%"/>
</p>
<p align="center">
  <img src="https://res.cloudinary.com/dcd51y8m1/image/upload/v1745148593/Screenshot_2025-04-20_at_4.38.44_PM_fz7hat.png" alt="Appointments in Database" width="30%"/>
  <img src="https://res.cloudinary.com/dcd51y8m1/image/upload/v1745148593/Screenshot_2025-04-20_at_4.38.29_PM_o2viu6.png" alt="Appointment Scheduling" width="30%"/>
  <img src="https://res.cloudinary.com/dcd51y8m1/image/upload/v1745148594/Screenshot_2025-04-20_at_4.38.59_PM_f0i8pi.png" alt="Medication Database" width="30%"/>
</p>  
<p align="center">
  <img src="https://res.cloudinary.com/dcd51y8m1/image/upload/v1745148595/Screenshot_2025-04-20_at_4.39.44_PM_fix6du.png" alt="Medication Database" width="30%"/>
  <img src="https://res.cloudinary.com/dcd51y8m1/image/upload/v1745148597/Screenshot_2025-04-20_at_4.40.06_PM_uy2vnk.png" alt="Medication Database" width="30%"/>
<!--   <img src="" alt="Medication Database" width="30%"/>  -->
</p>


---

## 🛠️ Tech Stack

**Backend**  
- Node.js  
- Express.js  
- MongoDB (Mongoose)

**Frontend**  
- EJS Templating  
- HTML5 & CSS3  
- JavaScript & jQuery  
- Bootstrap

**Auth & Security**  
- JWT (JSON Web Tokens)  
- bcryptjs  
- express-session & cookie-parser

**Communication**  
- SendGrid API (Email notifications)  

**Utilities**  
- dotenv  
- body-parser  
- nodemon (dev)

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** v14+  
- **MongoDB** (local or Atlas)  
- **npm** or **yarn**

### Steps

1. **Clone the repo**  
   ```bash
   git clone https://github.com/your-username/ResQ.git
   cd ResQ
   ```

2. **Install dependencies**  
   ```bash
   npm install
   ```

3. **Configure environment**  
   Create a `.env` in the root:
   ```env
   MONGODB_URI=<your_mongodb_connection_string>
   PORT=3000
   JWT_SECRET=<your_jwt_secret>
   EMAIL_USER=<email_for_notifications>
   EMAIL_PASS=<email_password>
   ```

4. **Run the app**  
   - Development:  
     ```bash
     npm run dev
     ```
   - Production:  
     ```bash
     npm start
     ```

5. **Open in browser**  
   Navigate to `http://localhost:3000`

---

## 📂 Project Structure

```
ResQ/
├── public/              # Static assets (CSS, JS, images)
├── server/              # Backend code
│   ├── models/          # Mongoose schemas
│   └── routes/          # Express routes
├── views/               # EJS templates
│   ├── layouts/         # Main layouts
│   ├── partials/        # Reusable components
│   └── *.ejs            # Page templates
├── .env                 # Environment variables
├── .gitignore           # Git ignore rules
├── index.js             # App entry point
└── package.json         # Scripts & dependencies
```

---

## 🔌 API Endpoints

### Auth
- `POST /api/auth/signup` — Register a new user  
- `POST /api/auth/login` — Login

### Reminders
- `GET /api/reminders` — List all reminders  
- `POST /api/reminders` — Create reminder  
- `PUT /api/reminders/:id` — Update reminder  
- `DELETE /api/reminders/:id` — Delete reminder

### Appointments
- `GET /api/appointments` — List all appointments  
- `POST /api/appointments` — Schedule appointment  
- `PUT /api/appointments/:id` — Update appointment  
- `DELETE /api/appointments/:id` — Cancel appointment

### Email Notifications
- `POST /api/reminders/test-email` — Send test email to verify email configuration

### Ambulance Services
- `GET /api/ambulance` — Get available ambulances
- `POST /api/ambulance/book` — Book an ambulance
- `GET /api/ambulance/track/:id` — Track ambulance location

---

<h2>🧑‍💻 Author</h2>

<p><strong>Abu Huraira (Leader) </strong>
  <br>Final Year BCA Student | MERN Stack Developer<br>Techno Main Salt Lake<br>
  <a href="https://github.com/abuhuraira-73" target="_blank">GitHub Profile</a></p>


  <p><strong>Raima Mitra</strong>
  <br>Final Year BCA Student | Mern Stack Developer<br>Techno Main Salt Lake<br>
  <a href="https://www.linkedin.com/in/raima-mitra-921898278/" target="_blank">linkedIn Profile</a></p>


---

<h3>📬 Connect With Me</h3>

<a href="https://github.com/abuhuraira-73" target="_blank">
  <img src="https://img.shields.io/badge/GitHub-000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Badge" />
</a>

<a href="https://x.com/Abuhuraira0703" target="_blank">
  <img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" alt="Twitter Badge" />
</a>

<a href="https://www.linkedin.com/in/abuhurairajamal/" target="_blank">
  <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn Badge" />
</a>

---

## 🤝 Contributing

1. Fork the repository  
2. Create a branch (`git checkout -b feature/AmazingFeature`)  
3. Commit your changes (`git commit -m "Add AmazingFeature"`)  
4. Push (`git push origin feature/AmazingFeature`)  
5. Open a Pull Request

---

## 📝 License

This project is licensed under the **MIT License**.  
See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- Thanks to all contributors  
- Thank you to team member @RaimaMitra  
- Special thanks to hackathon organizers @IIC and @ENVISAGE
