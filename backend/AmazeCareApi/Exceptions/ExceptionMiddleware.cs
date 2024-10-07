using AmazeCareApi.Exceptions;
using System.Net;
using System.Security.Authentication;
using System.Text.Json;
using AuthenticationException = AmazeCareApi.Exceptions.AuthenticationException;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private Task HandleExceptionAsync(HttpContext context, Exception ex)
    {
        _logger.LogError(ex, "Unhandled Exception");
        var response = context.Response;
        response.ContentType = "application/json";

        response.StatusCode = ex switch
        {
            PatientNotFoundException => (int)HttpStatusCode.NotFound,
            DoctorNotFoundException => (int)HttpStatusCode.NotFound,
            InvalidAppointmentException => (int)HttpStatusCode.BadRequest,
            AuthenticationException => (int)HttpStatusCode.Unauthorized,
            AuthorizationException => (int)HttpStatusCode.Forbidden,
            _ => (int)HttpStatusCode.InternalServerError
        };

        var result = JsonSerializer.Serialize(new { message = ex.Message });
        return response.WriteAsync(result);
    }
}
