# Project Name Frontend

## Overview

This is the frontend of a centralized IT support system designed for government organizations to reduce the high volume of technical support phone calls.

Employees can create and track support requests, select the relevant category and subcategory, provide issue details by filling out dynamic form, and communicate with technicians. Technicians can view incoming requests, send replies, update their progress, and wait for employees to confirm that the issue has been resolved.

## Live Application

- **Backend Repository:** [Deployed Frontend URL](https://github.com/FatimaS508/project4-backend)
- **Frontend Repository:** [Frontend Github Repository URL](https://github.com/FatimaS508/project4-frontend)

## Screenshots



### Home Page
![alt text](image.png)

### Feature Page
![alt text](image-5.png)
### Other pages
![alt text](image-1.png)
![alt text](image-3.png)
![alt text](image-4.png)


## Technologies Used

- React
- Vite
- React Router
- Axios
- CSS or CSS Modules

Only include ones you used on frontend

## Features

- User registration and login
- Protected routes
- etc.


## Project Structure

If you have different structure than this then add or remove from it

```text
src/
├── assets/
├── components/
├── context/
├── pages/
├── services/
├── styles/
├── App.jsx
└── main.jsx
```

## Getting Started

### Prerequisites

Install the following before running the project:

- node.js

The backend API has to be working. LINK TO THE BACKEND API

## Installation

### 1. Clone the repository

```bash
git clone FRONTEND_REPOSITORY_URL
cd FRONTEND_REPOSITORY_NAME
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the environment file

Create a `.env` file in the root directory:

```env
VITE_BACK_END_SERVER_URL=http://localhost:3000
```

### 4. Start the development server

```bash
npm run dev
```

Go to:

```text
http://localhost:5173
```


## Application Routes

## Application Routes

| Route                                   | Page                                 | Access     |
| --------------------------------------- | ------------------------------------ | ---------- |
| `/`                                     | Home page                            | Public     |
| `/sign-up`                              | Registration page                    | Public     |
| `/sign-in`                              | Login page                           | Public     |
| `/dashboard`                            | Employee dashboard                   | Employee   |
| `/category/:categoryId`                 | Category details                     | Employee   |
| `/request/:subcategoryId`               | Create support request               | Employee   |
| `/requests`                             | Employee request list                | Employee   |
| `/requests/:requestId`                  | Request details and replies          | Employee   |
| `/dashboard2`                           | Technician dashboard                 | Technician |
| `/requests2/subcategory/:subcategoryId` | Subcategory request list             | Technician |
| `/requests2/:requestId`                 | Request details and technician reply | Technician |
| `/requests2/resolved`                   | Resolved request list                | Technician |



## User Stories

### Employee

* As an employee, I can create an account and sign in.
* As an employee, I can view available IT support categories and subcategories.
* As an employee, I can submit a support request with its priority and required details.
* As an employee, I can view and search my support requests.
* As an employee, I can filter my requests by status.
* As an employee, I can track the status of each request.
* As an employee, I can view and reply to the technician’s messages.
* As an employee, I can confirm when my issue has been resolved.

### Technician

* As a technician, I can create an account and sign in.
* As a technician, I can view support requests organized by category.
* As a technician, I can open a request and review its details.
* As a technician, I can reply to an employee’s request.
* As a technician, I can delete a reply.
* As a technician, I can update the progress of a request.
* As a technician, I can view resolved requests.

## Future Enhancements

* Upload images, documents, and voice messages
* Send real-time notifications for request updates
* Add an admin role to control technician and employees role
* Improve the filtering feature
* Support Arabic language


## Team Members

| Name         | GitHub           |
| ------------ | ---------------- |
| Fatema Sami | https://github.com/FatimaS508 |


## Credits