# Repository Guidelines

## Project Structure & Module Organization

`source/` contains the active .NET 8 application. The backend solution is
`source/backend/BackAssistanceTravelers/BackAssistanceTravelers.sln`: its API
project contains controllers, `Models` contains `BE*` domain entities,
`Repositories` defines interfaces, `Repositories.Dapper` implements SQL Server
access, and `UnitOfWork` composes repositories. The MVC frontend lives in
`source/frontend/FrontAssistanceTravelers/`; Razor views, controllers, and
view models (`VM*`) are in `FrontAssistanceTravelers.WebTravel`, with page
scripts under `wwwroot/Travel/`.


## Build, Test, and Development Commands

Use the .NET 8 SDK. Run these from the repository root:

```powershell
dotnet build source/backend/BackAssistanceTravelers/BackAssistanceTravelers.sln
dotnet run --project source/backend/BackAssistanceTravelers/BackAssistanceTravelers.ApiTravel
dotnet build source/frontend/FrontAssistanceTravelers/FrontAssistanceTravelers.sln
dotnet run --project source/frontend/FrontAssistanceTravelers/FrontAssistanceTravelers.WebTravel
```

Start the API before the frontend; configure its URL through
`Generales:RutaAPI` in the frontend development settings. Swagger is available
at the API's `/swagger` endpoint in Development.

## Coding Style & Naming Conventions

Follow `.editorconfig`: UTF-8, LF line endings, final newlines, and four-space
indentation for C# (two spaces for JSON, YAML, and Markdown). Keep domain and
UI terms in Spanish, such as `Venta`, `Agencia`, and `Liquidacion`. Use `BE`
prefixes for backend entities, `VM` for frontend view models, and `I*Repository`
for repository interfaces. Keep API controllers thin; place data logic in the
appropriate Dapper repository or existing controller pattern.

## Testing Guidelines

There are no committed automated test projects, and the frontend `npm test`
script is only a placeholder. At minimum, build the affected solution and
manually verify the changed API endpoint or MVC screen. Add focused tests when
introducing testable logic, using descriptive names such as
`CrearVenta_DeberiaRetornarId`.

## Commit & Pull Request Guidelines

Recent commits use short, imperative Spanish summaries (for example,
`agregar telefono al listado de agencias`). Keep each commit scoped to one
change. Pull requests should explain the user-facing impact, identify affected
backend/frontend areas, link the relevant issue when available, and include
screenshots for UI changes. Do not commit credentials from `appsettings*.json`.
