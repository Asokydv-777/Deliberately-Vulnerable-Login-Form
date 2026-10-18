vulnerable-login-DO-NOT-USE

**WARNING: This application is INTENTIONALLY INSECURE.**

It was built for a local security training exercise. It contains:
- SQL injection in the login form
- Stored XSS in the profile bio field
- Plaintext password storage
- Session cookies without HttpOnly, Secure, or SameSite flags

**DO NOT deploy this to any public server.  
DO NOT use this code in any real project.  
Run it only on localhost for learning purposes.**

After the exercise, either delete this repository or replace the vulnerable code with the secure version.
This README satisfies the “clearly labeled as intentionally insecure” requirement.

Step 11: Submit your work
Your submission should include:

The project folder or GitHub repository (if you push to GitHub, make the repository private and keep the warning in the README).

Proof that the normal flow works: screenshots of:

The signup response ({"success":true,"userId":1})

The login response ({"success":true,...})

The profile page showing the bio.

You do not need to submit exploits today. Exploitation happens on Day 4.

Common beginner mistakes to avoid
Accidentally making it secure.
If you find yourself reaching for ? placeholders in the login route, or escaping the bio, stop. That is tomorrow’s task. Today, the login query must use ${email} and ${password} directly, and the bio must be rendered without escaping.

Testing with a cloud database.
You are using a local SQLite file (app.db). Keep it that way. Do not connect to MySQL, PostgreSQL, or MongoDB Atlas.

Forgetting to test the normal flow first.
If signup, login, or profile viewing does not work with normal data, the vulnerabilities are meaningless. Fix the normal flow before moving on.

Leaving the repo unlabeled.
The folder name and README are part of the assignment. Without them, someone might mistake this for real code.# Deliberately-Vulnerable-Login-Form
# -Exploit-Patch-Secrets-Management
