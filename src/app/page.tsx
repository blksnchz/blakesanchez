"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^[^@\s]+@gmail\.com$/i.test(email.trim())) {
      setError("Email must end with @gmail.com.");
      return;
    }

    if (password.length <= 6) {
      setError("Password must be more than 6 characters.");
      return;
    }

    setError("");
    sessionStorage.setItem("note-app-session", "active");
    router.push("/notes");
  }

  return (
    <main className="login-shell">
      <section className="brand-panel" aria-label="Memoir introduction">
        <div className="brand-mark">M</div>
        <div>
          <p className="brand-kicker">Personal workspace</p>
          <h1>Keep the thought.<br />Find it later.</h1>
          <p className="brand-copy">A quiet place for ideas, lists, and the details worth remembering.</p>
        </div>
        <p className="brand-footer">PRIVATE NOTES / SIMPLE BY DESIGN</p>
      </section>

      <section className="login-panel">
        <form className="login-card" onSubmit={handleSubmit} noValidate>
          <p className="eyebrow">MEMOIR</p>
          <h2>Welcome back</h2>
          <p className="form-intro">Sign in to open your notebook.</p>

          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@gmail.com"
            aria-describedby={error ? "login-error" : undefined}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="7 characters or more"
            aria-describedby={error ? "login-error" : undefined}
          />

          <button className="login-button" type="submit">Open notebook</button>
          <p id="login-error" className="login-error" role="alert" aria-live="polite">{error}</p>
          <p className="validation-note">Use a Gmail address and a password with more than 6 characters.</p>
        </form>
      </section>
    </main>
  );
}
