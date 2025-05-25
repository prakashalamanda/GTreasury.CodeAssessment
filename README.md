# GTreasury Code Assessment

This repository contains a full-stack application developed as part of a coding assessment for GTreasury. The solution calculates **Net Present Value (NPV)** for a series of cash flows using a RESTful API built with **.NET Core Web API** and a frontend built with **Angular**.

---

## Project Structure
GTreasury.CodeAssessment/
  - API/ # Backend (.NET 8 Web API)
  - UI/ # Frontend (Angular 19)

---

## Features

- Calculate Net Present Value based on input cash flows, lower bound rate, upper bound rate and discount rate
- Input validation and error handling
- API-first design and clean architecture (SOLID)
- Responsive UI with form inputs and results table
- Unit tested backend services

---

## Technologies Used

### Backend (.NET)
- ASP.NET Core Web API
- C# (.NET 8)
- Entity Framework Core (in-memory)
- xUnit + Moq for unit testing

### Frontend (Angular)
- Angular CLI (v19)
- RxJS and reactive forms
- Chart.js (optional - for NPV visualization)
- TypeScript, SCSS

### Additional Notes
I've fixed all the linting issues in the Angular project, except for the ones related to standalone components, since I didn’t use standalone components in this implementation.
---

## Getting Started

### Prerequisites
- [.NET SDK 8](https://dotnet.microsoft.com/en-us/download)
- [Node.js & npm](https://nodejs.org/) (v16+ recommended)
- [Angular CLI](https://angular.io/cli)

---

### Run the API

```bash
cd API/GTreasury.NetPresentValue
dotnet restore
dotnet run

---
