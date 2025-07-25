# 🔗 URL Shortener API + Frontend (Angular)

This is a full-stack URL shortening project with a REST API backend built in ASP.NET Core + SQL Server, and a frontend built with Angular 19.

---

## 🚀 Features

### Backend (.NET Core + SQL Server)
- ✅ Automatically shortens long URLs  
- ✅ Fixed 5-character short codes  
- ✅ Sequential generation (not random)  
- ✅ Saves data in SQL Server  
- ✅ Tracks creation and last access timestamps

### Frontend (Angular)
- ✅ Responsive web interface to shorten URLs  
- ✅ Modern Angular standalone components  
- ✅ Frontend located inside the `front-peque.no` folder for organization

---

## 📁 Repository Structure

- /peque.no
  - Peque.no/ (backend .NET code)
  - FRONT-peque.no/ (Angular frontend project)

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

### Backend

1. Clone the repository:
    
    ```
    git clone https://github.com/brukjavik/peque.no.git
    cd Peque.no
    ```

2. Configure the connection string in appsettings.json:

    {
      "ConnectionStrings": {
        "SQL": "Server=localhost;Database=UrlDb;User Id=sa;Password=YourPassword;"
      }
    }

3. Run the project:

    ```dotnet run```

### Frontend

1. Navigate to the frontend folder:

    ```bash
    cd front-peque.no
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the Angular development server:

    ```bash
    ng serve
    ```

4. The frontend will be available at `http://localhost:4200`

---

## 🧪 Example Request with cURL

    curl -X POST http://localhost:5000/create \
         -H "Content-Type: application/json" \
         -d "{\"url\": \"https://www.google.com\"}"

---

## 👨‍💻 Author

Developed by [Bruno Costa](https://github.com/brukjavik) with ❤️.

---

## 📄 License

This project is licensed under the MIT License.
