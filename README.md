# Mini CRM - Client Lead Management System

## 📌 Overview

Mini CRM (Client Lead Management System) is a modern web application designed to help businesses, freelancers, agencies, and startups efficiently manage potential clients and track their sales pipeline.

The system allows administrators to store incoming leads, monitor their progress, update lead statuses, maintain follow-up records, and analyze lead conversion performance through an intuitive dashboard.

This project simulates a real-world Customer Relationship Management (CRM) workflow used by organizations to manage customer interactions and improve conversion rates.


🎯 Project Objective

The primary objective of this project is to provide a centralized platform for managing business leads from initial contact to successful conversion.

The application enables administrators to:

* Store and organize lead information
* Track lead status throughout the sales process
* Maintain follow-up notes and communication history
* Monitor lead conversion statistics
* Manage all leads through a secure admin dashboard


## ✨ Features

### 🔐 Authentication & Security

* Secure Admin Login
* Protected Dashboard Access
* Session Management

### 📋 Lead Management

* Add New Leads
* View All Leads
* Update Lead Information
* Delete Leads
* Manage Lead Status

### 📊 Lead Status Tracking

Leads can move through the following workflow:

```text
New → Contacted → Converted
```

### 📝 Follow-Up Notes

* Add notes for each lead
* Maintain communication history
* Track client interactions

### 📈 Dashboard Analytics

* Total Leads Count
* New Leads Count
* Contacted Leads Count
* Converted Leads Count
* Lead Distribution Visualization
* Status-Based Charts

### 🔍 Search & Filtering

* Search leads by name or email
* Filter leads based on status
* Quickly locate specific records

### 📱 Responsive Design

* Mobile-Friendly Interface
* Modern Dashboard Layout
* Clean User Experience

---

## 🏗️ System Architecture

### Frontend

* React.js
* TypeScript
* Tailwind CSS
* Vite

### Backend & Database

* Supabase
* PostgreSQL Database
* Supabase Authentication

### Deployment

* GitHub
* Vercel

---

## 🗄️ Database Structure

### Leads Table

| Field      | Description            |
| ---------- | ---------------------- |
| id         | Unique Lead Identifier |
| name       | Lead Name              |
| email      | Lead Email Address     |
| phone      | Contact Number         |
| source     | Lead Source            |
| status     | Lead Status            |
| created_at | Creation Timestamp     |
| updated_at | Last Updated Timestamp |

### Notes Table

| Field      | Description            |
| ---------- | ---------------------- |
| id         | Unique Note Identifier |
| lead_id    | Related Lead           |
| note       | Follow-Up Information  |
| created_at | Timestamp              |

---

## 🚀 Installation & Setup

### Clone Repository

```bash
git clone <repository-url>
```

### Navigate to Project

```bash
cd mini-crm
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file and add:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Run Development Server

```bash
npm run dev
```

---

## 📊 Workflow

1. Admin logs into the system.
2. New leads are added to the CRM.
3. Leads are assigned an initial status of "New".
4. Admin updates status after contacting the lead.
5. Follow-up notes are recorded.
6. Lead status is updated to "Converted" once the client is acquired.
7. Dashboard analytics reflect overall lead performance.

---

## 🎓 Learning Outcomes

Through this project, the following concepts were implemented and explored:

* Full Stack Application Development
* Authentication and Authorization
* Database Design
* CRUD Operations
* Lead Management Systems
* Dashboard Development
* Data Visualization
* Responsive UI Design
* Cloud Database Integration
* Modern Web Application Deployment

---

## 🔮 Future Enhancements

* Email Notifications
* Lead Assignment System
* Activity Logs
* Team Collaboration Features
* Export Reports (PDF/Excel)
* Advanced Analytics Dashboard
* Customer Communication Tracking
* Automated Follow-Up Reminders

---

## 👨‍💻 Author

**Pugazhenthi S**

B.E. Computer Science and Engineering

SNS College of Engineering

---

## 📄 License

This project was developed for educational and internship purposes.
