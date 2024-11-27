using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Notifications;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using Microsoft.Extensions.Options;
using BusinessLogic.AuthService;
using System.Net.WebSockets;
using BusinessLogic.ClaimService;
using System.Text.Json.Serialization;
using BusinessLogic.FileUploadService;
using BusinessLogic.ReportsService.Factory;
using BusinessLogic.ReportsService;



namespace API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Configure DbContext
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlServer(connectionString));

            var connectionString2 = builder.Configuration.GetConnectionString("SecondaryConnection");
            builder.Services.AddDbContext<AuthDbContext>(options => options.UseSqlServer(connectionString2));

            // Cloudinary setup
            builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);


            // Configura Email Settings desde appsettings.json
            builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));

            // Registra INotification con EmailNotification usando IOptions<EmailSettings>
            builder.Services.AddTransient<INotification, EmailNotification>();

            // Registra NotificationService, que depende de INotification
            builder.Services.AddTransient<NotificationService>();

            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<ClaimService>(); 

            // Configura JwtSettings desde appsettings.json
            builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));

            // JWT Authentication setup
            var jwtSettings = builder.Configuration.GetSection("JwtSettings");
            var secretKey = Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]);

            builder.Services.AddControllers().AddJsonOptions(x =>
            x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

            // Registra el servicio de generación de PDF
            builder.Services.AddTransient<BusinessLogic.PdfGenerationService.PdfGenerator>();

            // Registra el servicio de generación de Reportes
            builder.Services.AddTransient<BusinessLogic.ReportsService.ReportService>();

            // Registra AuthService
            builder.Services.AddTransient<AuthService>();

            // Registra FileUploadService
            builder.Services.AddScoped<IFileUploadService, FileUploadService>();
            
            // Registra PaymentService
            builder.Services.AddScoped<PaymentService>();

            // Registra las fábricas de reportes
            builder.Services.AddTransient<TicketReportFactory>();
            builder.Services.AddTransient<PaymentReportFactory>();
            builder.Services.AddTransient<ClaimReportFactory>();


            builder.Services.AddTransient<IReportDataFactory, TicketReportFactory>();
            builder.Services.AddTransient<IReportDataFactory, PaymentReportFactory>();
            builder.Services.AddTransient<IReportDataFactory, ClaimReportFactory>();


            // Registra ReportGeneratorFactory
            builder.Services.AddTransient<ReportGeneratorFactory>();


            // Report HTMLBuilder
            builder.Services.AddTransient<ReportHTMLBuilder>(sp =>
            {
                var configuration = sp.GetRequiredService<IConfiguration>();
                var templatePath = configuration["ReportTemplatePath"];
                return new ReportHTMLBuilder(templatePath);
            });


            // Add services to the container
            builder.Services.AddControllers();

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSettings["Issuer"],
                    ValidAudience = jwtSettings["Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(secretKey)
                };
            });

            // Enable CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin", policy =>
                {
                    policy.WithOrigins("http://localhost:5173")  // Your frontend URL
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                });
            });

            // Configure Swagger to use JWT authentication
            builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "Please insert JWT with Bearer into field",
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });
                options.AddSecurityRequirement(new OpenApiSecurityRequirement {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    new string[] { }
                }
                });
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"));
            }

            app.UseHttpsRedirection();

            // Use CORS policy
            app.UseCors("AllowSpecificOrigin");

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseStaticFiles(); // Habilita la carpeta wwwroot como recurso público

            // Habilitar WebSockets
            app.UseWebSockets();

            app.MapControllers();

            // Manejar las conexiones WebSocket
            app.Use(async (context, next) =>
            {
                if (context.WebSockets.IsWebSocketRequest)
                {
                    var webSocket = await context.WebSockets.AcceptWebSocketAsync();

                    // Aquí puedes manejar la conexión WebSocket
                    // Ejemplo: leer y escribir mensajes a través de WebSocket
                    var buffer = new byte[1024 * 4];
                    while (true)
                    {
                        var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                        if (result.MessageType == WebSocketMessageType.Close)
                        {
                            await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closed by the client", CancellationToken.None);
                            break;
                        }
                        else
                        {
                            // Aquí puedes manejar los mensajes entrantes
                            await webSocket.SendAsync(new ArraySegment<byte>(buffer, 0, result.Count), result.MessageType, result.EndOfMessage, CancellationToken.None);
                        }
                    }
                }
                else
                {
                    await next();
                }
            });

            app.Run();
        }
    }
}
