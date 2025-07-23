using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Peque.no.Models;
using System.Data;

[ApiController]
[Route("")]
public class PequenoController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public PequenoController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpGet]
    [Route("get")]
    public IActionResult Get([FromQuery] string word)
    {
        // even though if the word would be returned as null or empty, we can avoid a database call by just checking it here
        if (string.IsNullOrEmpty(word))
            return NotFound();

        var connectionString = _configuration.GetConnectionString("SQL");

        string? targetUrl = null;

        // we use the using statement to ensure that the connection is disposed of properly
        using (var connection = new SqlConnection(connectionString))
        {
            var query = "SELECT target FROM dbo.sites WHERE shortened = @word";

            // we use a parameterized query to avoid SQL injection attacks
            using (var command = new SqlCommand(query, connection))
            {
                command.Parameters.Add(new SqlParameter("@word", SqlDbType.NVarChar) { Value = word });

                connection.Open();

                using (var reader = command.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        targetUrl = reader["target"]?.ToString();
                    }
                }
            }
        }

        if (string.IsNullOrEmpty(targetUrl))
            return NotFound();

        return Redirect(targetUrl);
    }

    [HttpPost]
    [Route("create")]
    public IActionResult Post([FromBody] CreateRequest request)
    {
        if (!CheckLinkIsValid(request.Url)) return BadRequest("Invalid URL format.");
        var connectionString = _configuration.GetConnectionString("SQL");

        using (var connection = new SqlConnection(connectionString))
        {
            var query = "INSERT INTO dbo.sites (shortened, target, created, last_access) VALUES (@shortened, @target, @created, @lastAccess)";
            using (var command = new SqlCommand(query, connection))
            {
                var shortened = GenerateShortened();
                command.Parameters.Add(new SqlParameter("@shortened", SqlDbType.NVarChar) { Value = shortened });
                command.Parameters.Add(new SqlParameter("@target", SqlDbType.NVarChar) { Value = request.Url });
                command.Parameters.Add(new SqlParameter("@created", SqlDbType.DateTime) { Value = DateTime.UtcNow });
                command.Parameters.Add(new SqlParameter("@lastAccess", SqlDbType.DateTime) { Value = DateTime.UtcNow });
                connection.Open();
                command.ExecuteNonQuery();

                return Ok(shortened);
            }
        }
    }

    public static bool CheckLinkIsValid(string url)
    {
        return Uri.TryCreate(url, UriKind.Absolute, out var uriResult)
               && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
    }

    private string GenerateShortened()
    {
        var last = GetLastCreated();
        var next = IncrementShortCode(last);
        return next;
    }

    private string GetLastCreated()
    {
        var connectionString = _configuration.GetConnectionString("SQL");
        using (var connection = new SqlConnection(connectionString))
        {
            var query = "SELECT TOP 1 shortened FROM dbo.sites ORDER BY created DESC";
            using (var command = new SqlCommand(query, connection))
            {
                connection.Open();
                var result = command.ExecuteScalar();
                return result?.ToString() ?? "aaaaa";
            }
        }
    }

    private string IncrementShortCode(string code)
    {
        const string alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var chars = code.ToCharArray();
        int index = chars.Length - 1;

        while (index >= 0)
        {
            int charPos = alphabet.IndexOf(chars[index]);
            if (charPos == -1) throw new InvalidOperationException("Invalid character in code.");

            if (charPos < alphabet.Length - 1)
            {
                chars[index] = alphabet[charPos + 1];
                break;
            }
            else
            {
                chars[index] = alphabet[0];
                index--;
            }
        }

        // if 'ZZZZZ' is reached, we set it to 'aaaaa'
        if (index < 0)
        {
            return new string(alphabet[0], code.Length);
        }

        return new string(chars);
    }

}
