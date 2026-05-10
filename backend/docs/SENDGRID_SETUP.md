SendGrid Setup & Testing (GLI Backend)

1) Create SendGrid API key
   - Sign up / login to https://sendgrid.com
   - Create an API Key with "Full Access" or at least Mail Send

2) Add DNS records for your sending domain (recommended)
   - In SendGrid: Sender Authentication -> Single Sender or Domain Authentication
   - If you use Domain Authentication, add the provided SPF/DKIM TXT records to your DNS
   - Wait for verification (may take minutes to hours)

3) Set backend environment variables
   - Edit `backend/.env` (create from `.env.example`) and set:
     - `SENDGRID_API_KEY` to your SendGrid key
     - `MAIL_FROM` to an address you control (e.g., no-reply@yourdomain.com)
     - `FRONTEND_URL` to your deployed frontend login URL (used in reset link)

4) Restart backend

   ```bash
   cd backend
   npm run dev   # or npm start
   ```

5) Test endpoint (local)

   ```bash
    curl -X POST http://localhost:5000/api/auth/send-reset \
      -H "Content-Type: application/json" \
      -d '{"email":"gamingrbdw@gmail.com"}'

   # PowerShell / browser-friendly test (no JSON body):
   # Open in browser: http://localhost:5000/api/auth/send-reset?email=gamingrbdw@gmail.com
   # Or PowerShell:
   Invoke-RestMethod -Uri "http://localhost:5000/api/auth/send-reset?email=gamingrbdw@gmail.com" -Method GET
   ```

   - If SendGrid configured correctly, response: `Reset link dikirim lewat email (SendGrid).`
   - If not configured, response will include `link` you can open manually.

6) Troubleshooting
   - If SendGrid returns error, check API key and that `MAIL_FROM` sender is verified.
   - If email lands in Spam, ensure SPF/DKIM are configured for sending domain.
   - Check backend logs for `SendGrid send error` messages.
