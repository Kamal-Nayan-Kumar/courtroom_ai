# Feature: Authentication Flow

Chamber Login and Registration flows with cinematic Indian courtroom imagery and a large editorial tagline quote on the visual column.

## Sub-features

1. Chamber Login page (`/login`) with Google SSO, email/password form, demo account one-click entry, forgot-password message, and Indian High Court interior visual.
2. Advocate Registration page (`/signup`) with Full Name, Email, Password, terms checkbox, and Chambers visual.
3. Redirect to dashboard upon submission.
4. Visual column tagline: large Playfair Display quote in a blockquote with a short amber rule above it. Login reads "Where every word is on record. Practice the real bench before you argue it." Signup reads "Prepare in silence. Argue with confidence in the courtroom."

## How to get to it (user POV)

- Navigate to `http://localhost:3000/login` or click "Chamber Login" in the navbar.
- Navigate to `http://localhost:3000/signup` or click "Create Advocate Account" from login.

## Driving it with browser harness

1. Load `http://localhost:3000/login` at desktop width.
2. Verify Imagery on Left, Form on Right. Confirm the tagline quote renders with the amber rule above it and no text clipping.
3. Click "Enter demo chamber" (or fill email and password and submit).
4. Verify navigation to `/dashboard`.
5. Repeat for `/signup` and verify 3 fields (Name, Email, Password) plus the terms checkbox.
6. Resize below `768px` and verify the visual column disappears on both pages.

## Gotchas

- Visual column hides below the `md` breakpoint (`768px`), not `lg`.
- Demo credentials are `advocate.nayan@gmail.com` / `Demo@1234`.
