import React from 'react'
import { Link } from "react-router"

function Homepage() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-decoration"></div>

        <div className="home-content">
          <p className="home-label">IT Support System</p>

          <h1>
            Technical support,
            <span> made simple.</span>
          </h1>

          <p className="home-description">
            Submit your technical issues, communicate directly
            with the support team, and track every request until
            the problem is resolved.
          </p>

          <p className="home-arabic" dir="rtl">
            قدّم طلب الدعم الفني، تواصل مع فريق الدعم، وتابع حالة
            طلبك حتى يتم حل المشكلة.
          </p>

          <div className="home-actions">
            <Link className="home-primary-button" to="/sign-up">
              Get Started

              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="m14 7 5 5-5 5" />
              </svg>
            </Link>

            <Link className="home-secondary-button" to="/sign-in">
              Sign In
            </Link>
          </div>
        </div>

        <div className="home-features">
          <article className="home-feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 3h12v18H6z" />
                <path d="M9 8h6" />
                <path d="M9 12h6" />
                <path d="M9 16h4" />
              </svg>
            </div>

            <h2>Submit a Request</h2>

            <p>
              Choose the relevant support category and explain
              the problem.
            </p>
          </article>

          <article className="home-feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 5h16v11H8l-4 4z" />
              </svg>
            </div>

            <h2>Communicate</h2>

            <p>
              Receive technician replies and provide additional
              information.
            </p>
          </article>

          <article className="home-feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="m8 12 3 3 5-6" />
              </svg>
            </div>

            <h2>Track and Confirm</h2>

            <p>
              Follow the request status and confirm when the issue
              is resolved.
            </p>
          </article>
        </div>
      </section>
    </main>
  )
}

export default Homepage