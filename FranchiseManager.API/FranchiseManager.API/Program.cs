using FranchiseManager.API.Database;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();

// Get connection string: first from environment variable, then from appsettings.json
string connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING") ??
                            builder.Configuration.GetConnectionString("DefaultConnection");

// Configure DbContext with SQL Server
builder.Services.AddDbContext<ApplicationDbContext>(options =>
options.UseSqlServer(connectionString));

// Configure CORS to allow React frontend to access the API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") // Vite default port
                  .AllowAnyMethod() // Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
                  .AllowAnyHeader() // Allow all headers
                  .AllowCredentials(); // Allow cookies/auth if needed
        });
});

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

// CORS must be called before Authorization and MapControllers
app.UseCors("AllowReactApp");

app.UseAuthorization(); // Authorization middleware
app.MapControllers(); // Map controllers

app.Run();