# Deploy to Render + Supabase

## Supabase

1. Create a Supabase project.
2. Open the project dashboard and click **Connect**.
3. Copy the **Session pooler** connection string for `DATABASE_URL`.
4. Copy the **Direct connection** string for `DIRECT_URL` if reachable from Render. If it is not reachable, use the Session pooler string for both variables.
5. Add `?pgbouncer=true&connection_limit=1` to pooled Supabase URLs. If the URL already has query parameters, append `&pgbouncer=true&connection_limit=1`.

## Render

1. In Render, create a new **Blueprint** from `git@github.com:poppeii/Life-Management-System.git`.
2. Render will read `render.yaml` from the repository root.
3. When prompted, enter:
   - `DATABASE_URL`: Supabase Session pooler connection string
   - `DIRECT_URL`: Supabase Direct connection string, or the same Session pooler string if direct IPv6 is unavailable
4. Confirm the service URLs:
   - API: `https://lifeos-api-poppeii.onrender.com`
   - Web: `https://lifeos-web-poppeii.onrender.com`
5. If Render assigns different URLs, update these environment variables in Render:
   - API service: `FRONTEND_URL`
   - Web service: `NEXT_PUBLIC_API_URL`
6. Redeploy both services after changing URLs.

The backend container runs `npx prisma migrate deploy` before starting NestJS.
