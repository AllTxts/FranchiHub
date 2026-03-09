using FranchiseManager.API.Database;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Agregar servicios al contenedor
builder.Services.AddControllers();

// Obtener la cadena de conexión: primero de variable de entorno, luego de appsettings.json
string connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING") ??
                            builder.Configuration.GetConnectionString("DefaultConnection");

// Configurar DbContext con SQL Server
builder.Services.AddDbContext<ApplicationDbContext>(options =>
options.UseSqlServer(connectionString));

// Configurar Swagger para documentación de API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configurar pipeline de HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger(); // Habilita Swagger en desarrollo
    app.UseSwaggerUI(); // Interfaz de usuario de Swagger
}

app.UseHttpsRedirection(); // Redirigir HTTP a HTTPS
app.UseAuthorization(); // Middleware de autorización
app.MapControllers(); // Mapear controladores

app.Run();