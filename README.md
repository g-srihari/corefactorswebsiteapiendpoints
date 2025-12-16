# corefactorswebsiteapiendpoints

This project contains a Lambda-style `handler` in `server.js` that accepts form submissions from your Webflow code and forwards validated leads to a Teleduce webhook.

## Required environment variables
- `TELEDUCE_URL` — Teleduce webhook URL
- `RECAPTCHA_SECRET` — Google reCAPTCHA v3 secret key

Optional configuration (defaults provided in code):
- `ALLOWED_ORIGINS` — comma-separated list of allowed CORS origins (default `*`)
- `MIN_LOAD_MS` — minimum form fill time in ms (default `3000`)
- `MAX_AGE_MS` — maximum form age in ms (default `86400000`)
- `RECAPTCHA_MIN_SCORE` — minimum reCAPTCHA score (default `0.5`)
- `AXIOS_TIMEOUT` — network timeout for outbound calls in ms (default `7000`)

Dev/testing helper:
- `SKIP_RECAPTCHA` — when `true` the server will skip Google reCAPTCHA verification (useful for local testing). **Do not** enable in production. You can also run with `NODE_ENV=development` to enable the same behavior.

## Local quick test
1. Install dependencies:

```powershell
npm install axios
```

2. Set environment variables in PowerShell (example):

```powershell
$env:TELEDUCE_URL = "https://httpbin.org/post"
$env:RECAPTCHA_SECRET = "test_secret"
$env:ALLOWED_ORIGINS = "*"
# For local testing only, skip reCAPTCHA verification:
$env:SKIP_RECAPTCHA = "true"
```

3. Create or edit `test_payload.json` (example provided). Then run the handler from Node:

```powershell
node -e "(async ()=>{const h=require('./server').handler; const payload=require('./test_payload.json'); const res=await h({ body: JSON.stringify(payload) }); console.log(JSON.stringify(res,null,2)); })()"
```

Note: reCAPTCHA verification will fail unless you use a matching `RECAPTCHA_SECRET` and a valid `captchaToken`. For local dry-runs set `SKIP_RECAPTCHA=true` (or `NODE_ENV=development`) so the handler skips verification — do **not** enable this in production.

### Testing end-to-end with Google reCAPTCHA (local)

If you want the full client -> server -> Google reCAPTCHA flow during local testing (recommended to validate integration), use Google's public test keys on both the client and server. These keys are provided by Google for testing and will always return a valid verification response.

- Test site key (use on the client/Webflow): `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`
- Test secret (use on the server as `RECAPTCHA_SECRET`): `6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe`

Steps:
1. In your Webflow embed replace your production site key occurrences with the test site key above. Example in your embed:
	- Change `grecaptcha/api.js?render=YOUR_SITE_KEY` to `grecaptcha/api.js?render=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`
	- Change `grecaptcha.execute('YOUR_SITE_KEY', {action: 'submit'})` accordingly.
2. In the shell where you run `test-server.js` set the test secret and your `TELEDUCE_URL` (or use `httpbin.org/post` to inspect payloads):

```powershell
$env:RECAPTCHA_SECRET = "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"
$env:TELEDUCE_URL = "https://httpbin.org/post"
node test-server.js
```

3. Expose your local server with `ngrok http 3000`, update the `apiURL` in your Webflow embed to the ngrok forwarding URL + `/submit`, and submit the form on your Webflow site.

4. The server will call Google's `siteverify` endpoint with the test secret and should receive a successful verification. Inspect the handler logs and the `teleduce`/httpbin response to confirm the payload was forwarded.

Important:
- These test keys are only for local/testing use — do not use them in production. Replace with your real site key + secret before deploying.
- If you prefer not to change the Webflow client key, you can host a simple test HTML page locally that uses the test site key and replicate a submission instead.

## Deployment
- Deploy the `server.js` handler to your Lambda/API Gateway or other serverless host and set the required environment variables there.
- Make sure to replace the client-side reCAPTCHA site key with your production key and the `RECAPTCHA_SECRET` environment variable with the matching secret.

If you want, I can add a small `test-server.js` Express wrapper to run this as an HTTP endpoint locally — would you like that?