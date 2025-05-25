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
- Line and Bar graph for visual representation
- Unit tested backend services & UI components

---

## Technologies Used

### Backend (.NET)
- ASP.NET Core Web API
- C# (.NET 8)
- xUnit + Moq for unit testing

### Frontend (Angular)
- Angular CLI (v19)
- RxJS and reactive forms
- Chart.js (for NPV visualization)
- TypeScript, SCSS

### Additional Notes
I've fixed all the linting issues in the Angular project, except for the ones related to standalone components, since I didn’t use standalone components in this implementation.
---

## Getting Started
---
### Run the UI
```bash
cd UI/gtreasury-net-present-value
npm install
ng serve
```
### Run the API

```bash
cd API/GTreasury.NetPresentValue
dotnet restore
dotnet run
```
