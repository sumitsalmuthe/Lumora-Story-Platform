import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  PenLine,
  Users,
  BarChart3,
  Sparkles,
  Check,
  Compass,
  Heart,
  TrendingUp,
  MessageCircle,
  BookMarked,
  Send,
} from "lucide-react";

import authService from "../../../services/auth/authService";

import "./BecomeWriter.css";

/* =========================================================
   WHY WRITE ON LUMORA
========================================================= */

const benefits = [
  {
    icon: PenLine,
    title: "Write your way",
    description:
      "Turn your ideas into stories and publish them chapter by chapter.",
  },
  {
    icon: Users,
    title: "Find your readers",
    description:
      "Build an audience that discovers, follows, and connects with your work.",
  },
  {
    icon: BarChart3,
    title: "Grow as a writer",
    description:
      "Track your stories and understand how readers are engaging with them.",
  },
  {
    icon: Compass,
    title: "Own your creative space",
    description:
      "Keep your stories organized and create a writing space that feels like yours.",
  },
  {
    icon: Heart,
    title: "Build meaningful connections",
    description:
      "Connect with people who enjoy your stories and follow your writing journey.",
  },
  {
    icon: TrendingUp,
    title: "Keep growing",
    description:
      "Understand what readers enjoy and use that insight to improve your work.",
  },
];

/* =========================================================
   HOW IT WORKS
========================================================= */

const steps = [
  {
    number: "01",
    icon: PenLine,
    title: "Create your story",
    description:
      "Start with an idea, choose your genre, add a cover, and give your story its identity.",
  },
  {
    number: "02",
    icon: BookMarked,
    title: "Write your chapters",
    description:
      "Write at your own pace and keep building your story one chapter at a time.",
  },
  {
    number: "03",
    icon: Send,
    title: "Publish your work",
    description:
      "Publish chapters whenever your story is ready and make it available to readers.",
  },
  {
    number: "04",
    icon: Users,
    title: "Reach readers",
    description:
      "Let readers discover your story, follow your work, and become part of your journey.",
  },
  {
    number: "05",
    icon: MessageCircle,
    title: "Connect & engage",
    description:
      "See what readers think, interact with your audience, and build your community.",
  },
  {
    number: "06",
    icon: TrendingUp,
    title: "Grow your journey",
    description:
      "Keep writing, understand your performance, and continue developing as a creator.",
  },
];

/* =========================================================
   FOOTER
========================================================= */

function WriterFooter() {
  return (
    <footer className="writer-footer">
      <div className="writer-container">
        <div className="writer-footer__top">

          {/* Brand */}
          <div className="writer-footer__brand">
            <Link
              to="/"
              className="writer-footer__logo"
            >
              Lumora
            </Link>

            <p>
              Read. Write. Inspire.
            </p>

            <span>
              A place for stories, writers,
              and readers to connect.
            </span>
          </div>

          {/* Discover */}
          <div className="writer-footer__column">
            <h3>Discover</h3>

            <Link to="/discover">
              Discover
            </Link>

            <Link to="/popular">
              Popular
            </Link>

            <Link to="/categories">
              Genres
            </Link>

            <Link to="/trending">
              Trending
            </Link>
          </div>

          {/* Writers */}
          <div className="writer-footer__column">
            <h3>For Writers</h3>

            <Link to="/become-writer">
              Become a Writer
            </Link>

            <Link to="/writer/dashboard">
              Writer Dashboard
            </Link>

            <Link to="/create-story">
              Start Writing
            </Link>

            <Link to="/analytics">
              Analytics
            </Link>
          </div>

          {/* Community */}
          <div className="writer-footer__column">
            <h3>Community</h3>

            <Link to="/community">
              Communities
            </Link>

            <Link to="/community">
              Writing Communities
            </Link>

            <Link to="/community">
              Genre Communities
            </Link>

            <Link to="/community">
              Create Community
            </Link>
          </div>

          {/* Lumora */}
          <div className="writer-footer__column">
            <h3>Lumora</h3>

            <Link to="/about">
              About
            </Link>

            <Link to="/login">
              Log in
            </Link>

            <Link to="/register">
              Sign up
            </Link>

            <Link to="/become-writer">
              Become a Writer
            </Link>
          </div>
        </div>

        <div className="writer-footer__bottom">
          <span>
            © 2026 Lumora. All rights reserved.
          </span>

          <div className="writer-footer__legal">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* =========================================================
   PAGE
========================================================= */

function BecomeWriter() {
  const navigate = useNavigate();

  /* =======================================================
     BECOME WRITER API
  ======================================================= */

  const handleStartWriting = async () => {
    try {
      const user = await authService.becomeWriter();

      console.log("Become Writer successful:", user);

      navigate("/writer/dashboard");
    } catch (error) {
      console.error("Become Writer failed:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to become a writer right now.";

      alert(message);
    }
  };

  return (
    <main className="become-writer">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="writer-hero">

        <div className="writer-hero__glow writer-hero__glow--one" />

        <div className="writer-hero__glow writer-hero__glow--two" />

        <div className="writer-container writer-hero__content">

          <span className="writer-eyebrow">
            BECOME A WRITER
          </span>

          <h1>
            Your story
            <br />
            <span>deserves a world.</span>
          </h1>

          <p>
            Write stories, build your audience,
            and share the worlds you've always
            wanted to create with readers on Lumora.
          </p>

          <div className="writer-hero__actions">

            {/* REAL BECOME WRITER ACTION */}
            <button
              type="button"
              onClick={handleStartWriting}
              className="writer-btn writer-btn--primary"
            >
              Start Writing
              <ArrowRight size={17} />
            </button>

            <Link
              to="/discover"
              className="writer-btn writer-btn--secondary"
            >
              Explore Stories
            </Link>

          </div>
        </div>
      </section>

      {/* =================================================
          WHY WRITE
      ================================================= */}

      <section className="writer-section writer-section--soft">

        <div className="writer-container">

          <div className="writer-section-heading">

            <span className="writer-eyebrow">
              WHY WRITE ON LUMORA?
            </span>

            <h2>
              A place where writers
              <span> can grow.</span>
            </h2>

            <p>
              Lumora gives you a simple space
              to write, publish, connect with readers,
              and keep creating.
            </p>

          </div>

          <div className="writer-horizontal-wrapper">

            <div className="writer-benefits">

              {benefits.map((benefit) => {

                const Icon = benefit.icon;

                return (
                  <article
                    className="writer-benefit-card"
                    key={benefit.title}
                  >

                    <div className="writer-icon-box">
                      <Icon
                        size={20}
                        strokeWidth={1.8}
                      />
                    </div>

                    <h3>
                      {benefit.title}
                    </h3>

                    <p>
                      {benefit.description}
                    </p>

                  </article>
                );
              })}

            </div>

          </div>
        </div>
      </section>

      {/* =================================================
          HOW IT WORKS
      ================================================= */}

      <section className="writer-section">

        <div className="writer-container">

          <div className="writer-section-heading writer-section-heading--center">

            <span className="writer-eyebrow">
              HOW IT WORKS
            </span>

            <h2>
              From idea to
              <span> published story.</span>
            </h2>

            <p>
              Getting started is simple.
              Focus on your story while Lumora
              gives you the space to build it.
            </p>

          </div>

          <div className="writer-horizontal-wrapper">

            <div className="writer-steps">

              {steps.map((step) => {

                const Icon = step.icon;

                return (
                  <article
                    className="writer-step"
                    key={step.number}
                  >

                    <div className="writer-step__top">

                      <span className="writer-step__number">
                        {step.number}
                      </span>

                      <div className="writer-step__icon">
                        <Icon
                          size={19}
                          strokeWidth={1.8}
                        />
                      </div>

                    </div>

                    <div>

                      <h3>
                        {step.title}
                      </h3>

                      <p>
                        {step.description}
                      </p>

                    </div>

                  </article>
                );
              })}

            </div>

          </div>
        </div>
      </section>

      {/* =================================================
          YOUR WRITING SPACE
      ================================================= */}

      <section className="writer-section writer-section--soft">

        <div className="writer-container">

          <div className="writer-feature-card">

            {/* Left */}
            <div className="writer-feature-card__visual">

              <div className="writer-feature-card__icon">
                <Sparkles size={23} />
              </div>

              <span>
                YOUR WRITING SPACE
              </span>

              <strong>
                Create.
                <br />
                Publish.
                <br />
                Inspire.
              </strong>

            </div>

            {/* Right */}
            <div className="writer-feature-card__content">

              <span className="writer-eyebrow">
                BUILT FOR CREATORS
              </span>

              <h2>
                Everything you need to
                <span> tell your story.</span>
              </h2>

              <p>
                Keep your writing organized,
                publish chapters, manage your
                stories, and discover how readers
                respond to your work.
              </p>

              <ul>

                <li>
                  <Check size={16} />
                  Create and manage multiple stories
                </li>

                <li>
                  <Check size={16} />
                  Publish chapters at your own pace
                </li>

                <li>
                  <Check size={16} />
                  Connect with readers and build an audience
                </li>

                <li>
                  <Check size={16} />
                  Track your writing and story performance
                </li>

                <li>
                  <Check size={16} />
                  Keep your creative work organized
                </li>

              </ul>

              {/* REAL BECOME WRITER ACTION */}
              <button
                type="button"
                onClick={handleStartWriting}
                className="writer-text-link"
              >
                Start your writing journey
                <ArrowRight size={16} />
              </button>

            </div>

          </div>

        </div>
      </section>

      {/* =================================================
          FINAL CTA
      ================================================= */}

      <section className="writer-section writer-section--cta">

        <div className="writer-container">

          <div className="writer-cta">

            <div className="writer-cta__icon">
              <BookOpen size={21} />
            </div>

            <span className="writer-eyebrow">
              FOR WRITERS
            </span>

            <h2>
              Have a story to tell?
            </h2>

            <p>
              Start writing today and give
              your ideas a place to live.
            </p>

            {/* REAL BECOME WRITER ACTION */}
            <button
              type="button"
              onClick={handleStartWriting}
              className="writer-btn writer-btn--primary"
            >
              Start Writing
              <ArrowRight size={17} />
            </button>

          </div>

        </div>
      </section>

      {/* =================================================
          FOOTER
      ================================================= */}

      <WriterFooter />

    </main>
  );
}

export default BecomeWriter;