# Junior Full Stack Developer Test Task  
**Submitted by Māris Suss**

## Overview

This repository contains my submission for the Scandiweb Junior Full Stack Developer test task. The project demonstrates a simple e-commerce website all aligned with the given specifications.

Live Demo: [https://scandiweb-test-task.up.railway.app](https://scandiweb-test-task.up.railway.app)  
GitHub Repo: [https://github.com/MarisSuss/scandiweb-test-task](https://github.com/MarisSuss/scandiweb-test-task)

---

## Tech Stack

### Backend
- PHP 8.1
- MySQL 5.6+
- GraphQL

### Frontend
- React.js
- Tailwind CSS

### Setup Instructions

### Prerequisites
- PHP 8.1+
- MySQL 5.6+
- Node.js and npm

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/MarisSuss/scandiweb-test-task
   cd scandiweb-test-task
   ```

2. **Configure Environment**:
   - Rename `.env.example` to `.env` in both backend and frontend.
   - Update the database credentials in backend.

3. **Backend setup from /scandiweb-test-task**

   ```bash
   cd backend
   composer install
   ```

4. **Launch migrations and server from /backend**

   ```bash
   php src/migrate_and_seed.php
   php -S localhost:8000 index.php
   ```

5. **Frontend setup**

   - In diferent terminal navigate to scandiweb-test-task

   ```bash
   cd frontend
   npm install
   npm run dev
   ```