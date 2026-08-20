# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository overview

This repo hosts **EuroAmerican Assistance**, a travel-insurance sales & operations platform (agencies, policies/"ventas", quoting, billing/"cobranza", commissions/"liquidacion"). It contains two parallel systems:

- **`source/`** — the active .NET 8 rewrite. This is where new work happens.
- **`documentacion/`** — planning docs (currently empty).

All application/domain text (models, routes, UI) is in **Spanish** — keep new code consistent with that (e.g. `Venta`, `Solicitud`, `Cobranza`, `Liquidacion`, `Agencia`, `Pasajero`, `Promocion`).

## Architecture (source/ — .NET 8)

Two independent solutions/deployables that talk to each other over HTTP, not a shared process:

```
source/backend/BackAssistanceTravelers/BackAssistanceTravelers.sln
  BackAssistanceTravelers.ApiTravel          -> ASP.NET Core Web API (JWT bearer auth), the only project with Controllers
  BackAssistanceTravelers.Models             -> POCOs, prefixed "BE" (Business Entity), one folder per domain (Venta, Agencia, Solicitud, ...)
  BackAssistanceTravelers.Repositories       -> repository interfaces (I*Repository), one per domain
  BackAssistanceTravelers.Repositories.Dapper-> Dapper-based implementations of those interfaces, raw SQL against SQL Server
  BackAssistanceTravelers.UnitOfWork         -> IUnitOfWork, implemented by TravelUnitOfWork which composes all repositories

source/frontend/FrontAssistanceTravelers/FrontAssistanceTravelers.sln
  FrontAssistanceTravelers.WebTravel         -> ASP.NET Core MVC (Razor views), cookie auth
```

- The **API** (`BackAssistanceTravelers.ApiTravel`) owns all data access. Controllers are thin: they call `IUnitOfWork.<Domain>.<Method>()` and serialize the result. There is no service/business layer between controllers and repositories — business logic lives in the Dapper repositories (SQL) or directly in controllers.
- The **frontend** (`FrontAssistanceTravelers.WebTravel`) never touches the database. Its MVC controllers call the API via `IHttpClientFactory`, using the base URL from config (`Generales:RutaAPI`), then either render a Razor `View()` or return JSON consumed by page-level jQuery in `wwwroot/Travel/*.js` (one JS file per screen/domain, e.g. `Venta.js`, `Cobranza.js`, `Liquidacion.js`).
- **Auth flow**: frontend `AutenticacionController.Acceso` POSTs credentials to the API (`accesos/token`, `accesos/Login`), gets a JWT + user info back, then mints its own cookie (`CookieAuthenticationDefaults`) with claims copied from the API response (`IdUsuario`, `IdPais`, `IdAgenciaUsuario`, the raw JWT under claim `Token`, etc.). Frontend→API calls that need auth attach that stored JWT as a Bearer token.
- View models in the frontend are prefixed `VM` (e.g. `VMLogin`); backend DTOs are prefixed `BE`.
- Config secrets (DB connection string, JWT signing key, SMTP) live in `appsettings*.json` per project — no secrets manager is in use. Be careful about not weakening/removing the `TrustServerCertificate`/CORS/JWT settings in `Program.cs` without being asked.
- The frontend has a `package.json`/`node_modules` (only `acorn`/`acorn-walk` as devDeps, no bundler) — its `npm test` script is a placeholder that always fails; there's no real JS build step, consistent with the one-file-per-screen static JS under `wwwroot/Travel/`.

## Coding style

Follow `.editorconfig`: UTF-8, LF endings, final newline, 4-space indent for C# (2 spaces for JSON/YAML/Markdown). Use `BE` prefix for backend entities, `VM` for frontend view models, `I*Repository` for repository interfaces, and keep domain/UI terms in Spanish. Commits use short, imperative Spanish summaries (e.g. `agregar telefono al listado de agencias`), scoped to one change.

## Pull Request Workflow

Before creating any pull request:

1. Fetch the latest `main` branch:

   git fetch origin main

2. Synchronize the working branch with the latest `origin/main`.

3. Prefer rebasing:

   git rebase origin/main

4. If conflicts occur:
   - Do not force-push.
   - Do not guess conflict resolutions.
   - Stop and report the conflict.

5. Only create the Pull Request after the branch is synchronized with the latest `main`.

6. Never merge directly into `main`.

## Build & run

Requires the .NET 8 SDK (`net8.0` target on all `source/` projects; CI workflows reference `7.0.x` for the SDK setup step but the actual TFM is 8.0 — use SDK 8 locally).

```bash
# Backend API
dotnet build source/backend/BackAssistanceTravelers/BackAssistanceTravelers.sln
dotnet run --project source/backend/BackAssistanceTravelers/BackAssistanceTravelers.ApiTravel

# Frontend MVC site
dotnet build source/frontend/FrontAssistanceTravelers/FrontAssistanceTravelers.sln
dotnet run --project source/frontend/FrontAssistanceTravelers/FrontAssistanceTravelers.WebTravel
```

The API serves Swagger UI at `/swagger` in Development, and redirects `/` there. Frontend expects the API's base URL in `Generales:RutaAPI` (`appsettings.Development.json`) — run the API first.

There are **no automated test projects** in the solution (CI's `dotnet test` step is `continue-on-error: true` and is effectively a no-op).

## Deployment

GitHub Actions workflows (`.github/workflows/deploy-back-iis.yml`, `deploy-front-iis.yml`) are `workflow_dispatch`-only, run on a **self-hosted Windows runner**, and deploy straight to IIS: stop app pool → zip-backup current deployment (keeps last 5) → `dotnet publish` → copy to `C:\inetpub\wwwroot\...` → start app pool → poll the public URL. Backend goes to `webapi.euroamericanassistance.com`, frontend to `sistema.euroamericanassistance.com`. These have no push/branch trigger at all — don't assume merging to `main` deploys anything.

`.github/workflows/copilot-code-review-back.yml` / `-front.yml` run a scheduled Copilot issue-suggestion job against `source/backend` and `source/frontend` respectively (monthly cron + manual dispatch), separate from PR review. `.github/workflows/validate-issue-ready.yml` validates issues on label events.

`.github/scripts/` holds one-off `gh`-CLI PowerShell scripts for repo/project administration (not part of build/deploy): `create-project.ps1` and `create-labels.ps1` set up a GitHub Project/labels for `rockespier/EUA2026`, `transfer-issues.ps1` copies issues in from `rtres-net/AssistanceTravelers`. `readme.txt` there notes you need `gh auth refresh -s project,read:project` first.
