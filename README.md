# 🔗 URL Shortener API (.NET + SQL Server)

This is a simple REST API project to shorten long URLs, built with ASP.NET Core and SQL Server. It generates fixed-length short codes using a sequential base-52 counter (lowercase + uppercase letters).

---

## 🚀 Features

- ✅ Automatically shortens long URLs  
- ✅ Fixed 5-character short codes  
- ✅ Sequential generation (not random)  
- ✅ Saves data in SQL Server  
- ✅ Tracks creation and last access timestamps  

---

## 📥 API Endpoint

### POST /create

Submits a URL and returns a unique shortened code.

- Request Body (JSON):

  {
    "url": "https://www.google.com"
  }

- Response:

  "aaaaf"

- Response Codes:
  - 200 OK: URL successfully shortened  
  - 400 Bad Request: Invalid or missing URL  

---

## ✅ Requirements

- .NET 8.0 or later (https://dotnet.microsoft.com/)  
- SQL Server  
- Tool like Postman or cURL for testing  

---

## ⚙️ Setup

1. Clone the repository:

    git clone https://github.com/brukjavik/peque.no.git
    cd Peque.no

2. Configure the connection string in appsettings.json:

    {
      "ConnectionStrings": {
        "SQL": "Server=localhost;Database=UrlDb;User Id=sa;Password=YourPassword;"
      }
    }

3. Run the project:

    dotnet run

---

## 🧪 Example Request with cURL

    curl -X POST http://localhost:5000/create \
         -H "Content-Type: application/json" \
         -d "{\"url\": \"https://www.google.com\"}"

---

## 👨‍💻 Author

Developed by [Bruno Costa](https://github.com/brukjavik) with ❤️ using .NET.

---

## 📄 License

This project is licensed under the MIT License.
