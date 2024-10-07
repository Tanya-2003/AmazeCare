namespace AmazeCareApi.Exceptions
{
    public class InvalidAppointmentException : Exception
    {
        public InvalidAppointmentException() : base("Invalid appointment details.")
        {
        }

        public InvalidAppointmentException(string message) : base(message)
        {
        }

        public InvalidAppointmentException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}
