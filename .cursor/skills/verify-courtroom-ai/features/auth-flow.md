# Feature: Authentication Flow

Chamber Login and Registration flows with cinematic Indian courtroom imagery.

## Sub-features

1. Chamber Login page (`/login`) with Google SSO, email/password form, and Indian High Court interior visual.
2. Advocate Registration page (`/signup`) with Full Name, Email, Password, terms checkbox, and Chambers visual.
3. Redirect to dashboard upon submission.

## How to get to it (user POV)

- Navigate to `http://localhost:3000/login` or click "Chamber Login" in the navbar.
- Navigate to `http://localhost:3000/signup` or click "Create Advocate Account" from login.

## Driving it with browser harness

1. Load `http://localhost:3000/login`.
2. Verify Form on Left, Symmetrical High Court Interior on Right.
3. Fill `advocate.nayan@gmail.com` and submit.
4. Verify navigation to `/dashboard`.
5. Repeat for `/signup` and verify 3 fields (Name, Email, Password).

## Gotchas

- Visual column hides on viewports narrower than `1024px` (`lg` breakpoint).
