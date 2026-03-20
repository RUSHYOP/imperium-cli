# REST API Endpoints

All endpoints are relative to `${RIDS_API_URL}/v1/api/2/`. Authentication is Bearer token via the RIDS auth system (Azure AD MSAL + OIDC).

The endpoint definitions live in `Designer-Frontend/src/services/API/ApiEndPoints.ts`.

---

## Pages — The Primary Import Target

| Endpoint | Method | Description |
|---|---|---|
| `/page` | POST | Create a new page in a module |
| `/page/metadata` | POST | **Write UIDL component tree to a page** — the import endpoint |
| `/page/{pageId}` | GET | Read page UIDL back |
| `/page` | PUT | Edit page details |
| `/page/{pageId}` | DELETE | Delete a page |
| `/module/{moduleId}/pages` | GET | List all pages in a module |
| `/page/version` | POST | Create a page version |
| `/page/version/switch` | POST | Switch active version |
| `/page/unbound` | GET | Get unbound controls on a page |

`POST /page/metadata` is the critical endpoint — this is where the UIDL JSON tree gets written into Nebula Studio. The payload is the full component metadata tree for the page.

---

## Applications

| Endpoint | Method | Description |
|---|---|---|
| `/application` | POST | Create application |
| `/applications` | GET | List all applications |
| `/application/{appId}` | GET | Get application details |
| `/application` | PUT | Update application |
| `/application/{appId}` | DELETE | Delete application |
| `/application/version/publish` | POST | Publish application version |

---

## Modules

| Endpoint | Method | Description |
|---|---|---|
| `/module` | POST/PUT | Create or update module |
| `/modules` | GET | List all modules |
| `/module/{moduleId}` | GET | Get module with all pages metadata |
| `/module/{moduleId}` | DELETE | Delete module |
| `/module/version` | POST | Create module version |

---

## Data Sources

| Endpoint | Method | Description |
|---|---|---|
| `/datasource` | POST | Create data source |
| `/datasources` | GET | List data sources |
| `/datasource/{id}` | GET | Get data source details |
| `/datasource` | PUT | Update data source |
| `/datasource/{id}` | DELETE | Delete data source |
| `/datasource/version` | POST | Create data source version |
| `/datasource/version/switch` | POST | Switch data source version |

---

## Data Queries

| Endpoint | Method | Description |
|---|---|---|
| `/dataqueries` | POST | Bulk insert data queries |
| `/dataqueries/update` | PUT | Bulk update data queries |
| `/dataqueries/{moduleId}/{pageId}` | GET | Get queries for a page |
| `/dataqueries/{queryId}` | DELETE | Delete a query |
| `/dataqueries/run` | POST | Execute a data query |

---

## Variables

| Endpoint | Method | Description |
|---|---|---|
| `/variables/{moduleId}` | GET | Get module-scoped variables |
| `/variables` | POST | Create variables |
| `/variables` | PUT | Update variables |

---

## Tags

| Endpoint | Method | Description |
|---|---|---|
| `/tags` | POST | Create tag |
| `/tags` | GET | List tags |
| `/tags/{entityType}/{entityId}` | GET | Get tags for entity |

---

## Token Authorization

| Endpoint | Method | Description |
|---|---|---|
| `/token-config` | POST | Create token configuration |
| `/token-config` | GET | List token configs |
| `/token-config` | PUT | Update token config |
| `/token-config/{id}` | DELETE | Delete token config |

---

## Environments

| Endpoint | Method | Description |
|---|---|---|
| `/environments` | GET | List environments |
| `/environments` | POST | Create environment config |
| `/environments` | PUT | Update environment config |

---

## Transform Data

| Endpoint | Method | Description |
|---|---|---|
| `/transform/page` | POST | Transform page data (used for migration/conversion) |

---

## Audit & Analytics

| Endpoint | Method | Description |
|---|---|---|
| `/audit/compare/{pageId}` | GET | Compare two page versions |
| `/audit/save` | POST | Save audit trail entry |

---

## User

| Endpoint | Method | Description |
|---|---|---|
| `/user` | GET | Get current user info |

---

## Import Sequence (Milkyway Phase 6)

To import a page via the REST API:

```
1. POST /application        → create or find app       → appId
2. POST /module             → create or find module     → moduleId  
3. POST /page               → create page in module     → pageId
4. POST /page/metadata      → write UIDL JSON tree      → page populated
5. POST /page/version       → create draft version
6. (manual) designer reviews in UI and publishes
```

Each step requires a valid Bearer token. The GitHub Actions pipeline (Milkyway Phase 6) needs a service account with write access to these endpoints.
