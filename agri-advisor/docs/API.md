# AgriAdvisor REST API Documentation

All endpoints reside under `/api/v1` and require an `Authorization: Bearer <Supabase_JWT>` header unless explicitly marked public.

## Standard Response Envelopes

### Success (HTTP 200 / 201)
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {},
  "meta": {}
}
```

### Error (HTTP 400 / 401 / 404 / 429 / 500)
```json
{
  "success": false,
  "message": "Validation failed for input data",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": []
  }
}
```

---

## Endpoint Catalog

### 1. Health Check
- `GET /health` [Public] -> Returns server heartbeat, timestamp, and model version.

### 2. User & Profile
- `GET /auth/me` -> Retrieves authenticated farmer profile.
- `PATCH /auth/profile` -> Updates name, phone, state, and district.

### 3. Farms
- `GET /farms` -> Lists all farms owned by the authenticated farmer.
- `POST /farms` -> Creates a new farm holding.
- `GET /farms/:id` -> Fetches farm details.
- `PATCH /farms/:id` -> Updates farm metadata.
- `DELETE /farms/:id` -> Deletes farm and cascades relationships.

### 4. AI Advisories
- `GET /advisories` -> Lists past consultations with optional `?type=` filter.
- `GET /advisories/:id` -> Retrieves complete consultation record.
- `PATCH /advisories/:id/save` -> Toggles bookmark/saved status.
- `DELETE /advisories/:id` -> Deletes advisory record.

### 5. Crop Recommendation
- `POST /advisories/crop-recommendation` -> Evaluates soil NPK, pH, and season to return top-ranked crops.

### 6. Disease Detection
- `POST /advisories/disease-detection` -> Multipart image upload (`image`) analyzing visible foliar symptoms with Gemini 2.5 Flash Vision.
- `GET /advisories/disease-detection` -> Lists disease scans.
- `GET /advisories/disease-detection/:id` -> Retrieves single diagnostic report with signed preview URL.

### 7. Fertilizer Guide
- `POST /advisories/fertilizer` -> Computes NPK deficit and commercial/organic dosing.

### 8. Irrigation Guide
- `POST /advisories/irrigation` -> Computes watering frequencies and conservation protocols.

### 9. Knowledge Center
- `GET /knowledge` [Public] -> Lists published agricultural guides.
- `GET /knowledge/:slug` [Public] -> Retrieves complete guide by URL slug.

### 10. Notifications
- `GET /notifications` -> Lists in-app alerts.
- `PATCH /notifications/read-all` -> Marks all user notifications read.
- `PATCH /notifications/:id/read` -> Marks single notification read.
- `DELETE /notifications/:id` -> Deletes alert.
