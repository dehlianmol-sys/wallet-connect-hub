# Sign-in feedback and animated flash screen

## What will change

- Replace the Sign In loading/toast sequence with one centered confirmation matching the reference: dark translucent square, large white SVG check, and `Signed in` text.
- Show that confirmation only after credentials succeed, keep it visible for about one second, then open the account. The black loading panel and separate “Sign in successful” toast will not appear during sign-in.
- Keep the processing overlay for OTP and registration/reset work only. After OTP finishes, show the existing compact success message once; the action button itself will not animate.
- Restore the Skypay flash screen on every fresh app launch instead of hiding it for the rest of the browser session.
- Match the two supplied flash stages: first the soft background with the fixed blue half-circle and colored decorations, then the tilted translucent card with the Skypay logo.
- Animate only the small circles upward/downward gently and the three green bars slowly right-to-left. Keep the large blue half-circle still.
- Remove the separate full-screen black fallback so delayed account loading continues on the branded flash screen.

## Technical details

- Add a dedicated sign-in success state and inline SVG check to the Sign In page.
- Simplify startup splash state in the root page and let the branded splash remain until both its animation and account check finish.
- Refine the existing splash CSS keyframes, timing, responsive sizing, and reduced-motion behavior without changing authentication, OTP, Turnstile, or database logic.
- Verify the launch sequence and successful sign-in transition at the current 384px mobile width, then check the latest build result.
