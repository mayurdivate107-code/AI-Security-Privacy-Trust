# AgriAdvisor Security Architecture

## 1. Authentication & Identity
- **Supabase JWT Verification**: All protected backend API routes strictly verify the `Authorization: Bearer <token>` using `supabaseAdmin.auth.getUser(token)`.
- **Identity Derivation**: The server never trusts client-supplied user IDs; user IDs are extracted exclusively from the decoded JWT.

---

## 2. Row Level Security (RLS) & Multi-Tenant Isolation
- RLS is enabled on all tables: `profiles`, `farms`, `crop_advisories`, `disease_analyses`, `notifications`, `ai_usage_logs`.
- SELECT, INSERT, UPDATE, and DELETE policies enforce `auth.uid() = user_id`.
- Farmers can never read, modify, or delete another user's agricultural data.

---

## 3. Image Upload Hardening
- **In-Memory Buffering**: Uploads are processed in RAM using Multer (`memoryStorage`). No unencrypted files are written to the server's disk.
- **Payload Limits**: Strict 8MB file size limit (`MAX_IMAGE_SIZE_MB`).
- **MIME & Signature Validation**: Both HTTP Content-Type and binary magic numbers (`validateImageSignature`) are validated for JPEG, PNG, and WEBP.
- **Private Storage**: Images are uploaded to a private Supabase Storage bucket (`crop-images`) with randomized UUID paths (`{userId}/{uuid}.{ext}`). Access is granted exclusively through short-lived signed URLs.

---

## 4. API & Transport Security
- **Helmet**: Injects security headers preventing XSS, MIME sniffing, and clickjacking.
- **Strict CORS**: Origin whitelist restricted to the frontend application domain.
- **Dual Rate Limiting**:
  * Standard API rate limit: 100 requests per 15 minutes per IP.
  * AI generation rate limit: 10 requests per 15 minutes per authenticated user.
- **SQL Injection Prevention**: All queries use parameterized Supabase client operations.
- **Secret Isolation**: `GEMINI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` remain strictly server-side.
