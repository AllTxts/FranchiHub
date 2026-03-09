using FranchiseManager.API.Database;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();

// Get connection string: first from environment variable, then from appsettings.json
string connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Configure DbContext with SQL Server
builder.Services.AddDbContext<ApplicationDbContext>(options =>
options.UseSqlServer(connectionString));

// Configure Swagger for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger(); // Enable Swagger in development
    app.UseSwaggerUI(); // Swagger user interface
}

app.UseHttpsRedirection(); // Redirect HTTP to HTTPS

app.UseAuthorization(); // Authorization middleware
app.MapControllers(); // Map controllers

app.Run();