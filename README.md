# 🏢 Franchises Manager - Fullstack Application

![.NET 8](https://img.shields.io/badge/.NET-8.0-512BD4?style=flat&logo=dotnet&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![SQL Server](https://img.shields.io/badge/SQL%20Server-2022-CC2927?style=flat&logo=microsoft-sql-server&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-✓-2496ED?style=flat&logo=docker&logoColor=white)

A fullstack web application to manage franchises, branches, and product inventory.  
Built as a technical test demonstrating clean code, Git best practices, and modern development tools.

---

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Author](#author)
- [License](#license)

---

## 🎯 Project Overview

This application allows users to manage franchise networks through a simple and intuitive interface.  
Users can create franchises, add branches to them, manage products, and update stock levels in real-time.

### Functional Requirements
- ✅ Create and list **Franchises**
- ✅ Create and list **Branches** per franchise
- ✅ Create and list **Products** per branch
- ✅ Update **product stock**

---

## 🛠️ Tech Stack

### Backend
| Technology | Description |
|------------|-------------|
| **.NET 8** | Web API framework |
| **ASP.NET Core** | REST API architecture |
| **Entity Framework Core** | ORM for database access |
| **SQL Server** | Database (LocalDB) |
| **Swagger** | API documentation and testing |
| **Docker** | Containerization |

### Frontend
| Technology | Description |
|------------|-------------|
| **React 18** | UI library |
| **Vite** | Build tool and dev server |
| **JavaScript/TypeScript** | Programming language |
| **Axios** | HTTP client for API requests |
| **CSS Modules** | Styling With Tailwind ;) |

### DevOps & Tools
| Tool | Usage |
|------|-------|
| **Git** | Version control |
| **GitHub** | Code repository |
| **Docker** | Containerization |
| **Swagger** | API testing |

---

## 📁 Project Structure

📦 FranchisesManager
├── 📂 backend/ # .NET 8 Web API
│ ├── 📂 Controllers/ # API endpoints
│ ├── 📂 Models/ # Database entities
│ ├── 📂 DTOs/ # Data transfer objects
│ ├── 📂 Database/ # DbContext configuration
│ ├── Dockerfile # Docker configuration for API
│ ├── docker-compose.yml # Multi-container setup
│ └── README.md # Backend documentation
│
├── 📂 frontend/ # React + Vite application
│ ├── 📂 src/
│ │ ├── 📂 components/ # Reusable UI components
│ │ ├── 📂 assets/ # Application views
│ ├── package.json # Frontend dependencies
│ └── README.md # Frontend documentation
│
├── .gitignore # Git ignore rules
├── LICENSE # MIT License
└── README.md # This file


### Folder Details

#### 📁 **/backend**
Contains the complete .NET 8 Web API with:
- RESTful endpoints for all entities
- Entity Framework Core with SQL Server
- Swagger documentation
- Docker support
- Unit of work pattern

#### 📁 **/frontend**
Contains the React application with:
- Responsive UI components
- State management
- API integration
- Loading states and error handling
- Form validation

---

## ✨ Features

### Backend Features
- 🔷 **Clean Architecture** - Layered structure (Controllers, Services, Repository)
- 🔷 **RESTful API** - Proper HTTP methods and status codes
- 🔷 **Validation** - Data annotations and custom validators
- 🔷 **Error Handling** - Clear messages without stack traces
- 🔷 **Database** - SQL Server with Entity Framework Core
- 🔷 **Documentation** - Swagger UI for endpoint testing
- 🔷 **Docker** - Containerized API and database

### Frontend Features
- 🟦 **Responsive Design** - Works on desktop and mobile
- 🟦 **Real-time Updates** - Instant UI feedback
- 🟦 **Loading States** - Spinners and skeletons
- 🟦 **Error Handling** - User-friendly error messages
- 🟦 **Form Validation** - Client-side validation
- 🟦 **API Integration** - Axios with interceptors

---

## 🚀 Quick Start

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (v18 or higher)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (LocalDB or Express)
- [Git](https://git-scm.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (optional)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/FranchisesManager.git
cd FranchisesManager
```

## Documentation

- Backend API : /backend/README.md
- Frontend App : /frontend/README.md
- API Endpoints : Swagger UI (When running)

👨‍💻 Author
Melquin Rodriguez Sanabria
Fullstack Developer

- GitHub: @alltxts
- Email: alltxtscode@gmail.com

## If u have problems with the downloads folders.
Greetings, the .rar file contains the Backend and Frontend folders if you have any problems with the separate folders. "FranchiHub-v1.0-Backend+Frontend"
📄 License
- This project is licensed under the MIT License - see the LICENSE file in backend and frontend folder for details.
