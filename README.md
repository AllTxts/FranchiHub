# 🏢 Franchises Manager - Backend

Fullstack application to manage franchises, branches, and products.  
This is the **backend** built with C# .NET 8.

---

## 📋 Table of Contents
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Database Configuration](#database-configuration)
- [How to Run](#how-to-run)
- [API Endpoints](#api-endpoints)
- [Migrations](#migrations)
- [Docker Support](#docker-support)
- [Architecture Overview](#architecture-overview)
- [Author](#author)

---

## 🚀 Technologies Used
- **.NET 8** - Web API framework
- **ASP.NET Core** - REST API
- **Entity Framework Core** - ORM for database access
- **SQL Server** - Database (LocalDB)
- **Swagger** - API documentation and testing
- **Docker** - Containerization

---

## 📦 Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (LocalDB or Express)
- [Visual Studio 2022](https://visualstudio.microsoft.com/) or [VS Code](https://code.visualstudio.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (optional, for containerization)

## 📁 Project Structure

📦 FranchiseManager.API
├── 📂 Controllers
│ ├── FranchisesController.cs
│ ├── BranchesController.cs
│ └── ProductsController.cs
├── 📂 Models
│ ├── Franchise.cs
│ ├── Branch.cs
│ └── Product.cs
├── 📂 DTOs
│ ├── FranchiseDtos.cs
│ ├── BranchDtos.cs
│ └── ProductDtos.cs
├── 📂 Database
│ └── ApplicationDbContext.cs
├── 📂 Properties
├── appsettings.json
├── Program.cs
├── Dockerfile
├── docker-compose.yml
└── FranchiseManager.API.csproj

## 🗄️ Database Configuration

### Connection String (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=FranchiseManagerDB;Trusted_Connection=True;MultipleActiveResultSets=true;"
  }
}
```
## 🏃‍♂️ How to Run

# 1. Clone the repository
git clone https://github.com/your-username/FranchisesManager.git

# 2. Navigate to backend folder
cd FranchisesManager/backend

# 3. Restore dependencies
dotnet restore

# 4. Update database (if using migrations)
dotnet ef database update

# 5. Run the application
dotnet run

# 6. Open Swagger
https://localhost:5001/swagger

# 7 EXTRA. With Docker:
- Navigate to backend folder
cd FranchisesManager/backend

- Build and run containers
docker-compose up -d

- Access the API
http://localhost:5001/swagger

## 📡 API Endpoints

# Franchises

GET - /api/franchises : Get all franchises
GET - /api/franchises/{id} : Get franchise by ID
POST - /api/franchises : Create new franchise
PUT - /api/franchises/{id} : Update franchise
DELETE - /api/franchises/{id} : Delete franchise

# Branches

GET - /api/branches : Get all branches
GET - /api/branches/{id} : Get branch by ID
GET - /api/branches/franchise/{franchiseId} : Get branches by franchise
POST - /api/branches : Create new branch
PUT - /api/branches/{id} : Update branch
DELETE - /api/branches/{id} : Delete branch

# Products

GET - /api/produtcs : Get all products
GET - /api/products/{id} : Get product by ID
GET - /api/products/branch/{branchId} : Get products by branch
POST - /api/products : Create new product
PATCH - /api/products/{id}/stock : Update product stock
PUT - /api/products/{id} : Update product
DELETE - /api/products/{id} : Delete product

## 🔄 Migrations

# Create initial migration
- dotnet ef migrations add InitialCreate

# Apply migration to database
- dotnet ef database update

# Remove last migration (if needed)
- dotnet ef migrations remove

## 🐳 Docker Support

# Dockerfile
Multi-stage build for .NET 8 API:

- Build stage
- Runtime stage

# Docker Compose
Two services configured:

- api: .NET 8 application on port 8081
- sqlserver: SQL Server 2022 on port 1433

## 🏗️ Architecture Overview

This backend follows a layered architecture:

1. Presentation Layer (Controllers)
- Handle HTTP requests/responses
- Input validation
- Return proper status codes

2. Business Logic Layer (Services - optional)
- Currently in controllers (simple CRUD)
- Can be extracted to services for complex logic

3. Data Access Layer (DbContext + Models)
- Entity Framework Core ORM
- Database operations
- Relationships configuration

4. DTOs (Data Transfer Objects)
- Shape data for API responses
- Validate input data

## 👨‍💻 Author
Melquin Rodriguez Sanabria
Fullstack Developer "I Love Backend ;)"

GitHub: @alltxts
Email: alltxtscode@hotmail.com
---

## 📁 Project Structure
