import { Link } from "react-router-dom";
import {
  FaBookOpen,
  FaPenNib,
  FaUsers,
  FaHeart,
  FaArrowRight,
} from "react-icons/fa6";

import "./About.css";

const values = [
  {
    icon: FaBookOpen,
    title: "Stories first",
    description:
      "We believe a good story can take you somewhere, make you feel something, and stay with you long after you finish reading.",
  },
  {
    icon: FaPenNib,
    title: "Writers matter",
    description:
      "Lumora gives writers a place to share their work, build an audience, and keep creating.",
  },
  {
    icon: FaUsers,
    title: "A place to belong",
    description:
      "Readers and writers come together around stories, ideas, characters, and worlds they love.",
  },
];

function About() {
  return (
    <main className="lumora-about">
      {/* HERO */}
      <section className="lumora-about__hero">
        <div className="lumora-about__hero-decoration" />

        <div className="lumora-about__container">
          <span className="lumora-about__eyebrow">
            ABOUT LUMORA
          </span>

          <h1>
            Stories can take you
            <span> anywhere.</span>
          </h1>

          <p>
            Lumora is a place to discover stories, meet new writers,
            explore different worlds, and share the stories you've
            always wanted to tell.
          </p>
        </div>
      </section>

      {/* INTRO */}
      <section className="lumora-about__intro">
        <div className="lumora-about__container">
          <div className="lumora-about__intro-grid">
            <div className="lumora-about__section-label">
              <span>OUR STORY</span>
            </div>

            <div className="lumora-about__intro-content">
              <h2>
                Built for people who
                <span> love stories.</span>
              </h2>

              <p>
                Every story starts somewhere. Maybe with a single
                sentence, an idea that refuses to leave your head,
                or a character you've been thinking about for years.
              </p>

              <p>
                Lumora was created to give those stories a place to
                live. A simple space where readers can discover new
                voices and writers can share their imagination with
                the world.
              </p>

              <p>
                Whether you're here for five minutes or five hours,
                there's always another story waiting to be discovered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="lumora-about__values">
        <div className="lumora-about__container">
          <div className="lumora-about__section-header">
            <span>WHAT WE BELIEVE</span>

            <h2>
              Made around the
              <span> love of reading.</span>
            </h2>

            <p>
              Lumora is built around three simple ideas.
            </p>
          </div>

          <div className="lumora-about__values-grid">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <article
                  key={value.title}
                  className="lumora-about__value-card"
                >
                  <div className="lumora-about__value-icon">
                    <Icon size={17} />
                  </div>

                  <h3>{value.title}</h3>

                  <p>{value.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* READ / WRITE */}
      <section className="lumora-about__split">
        <div className="lumora-about__container">
          <div className="lumora-about__split-grid">
            <article className="lumora-about__split-card">
              <div className="lumora-about__split-icon">
                <FaBookOpen size={17} />
              </div>

              <span>FOR READERS</span>

              <h2>Find your next favorite story.</h2>

              <p>
                Explore genres, discover emerging writers, and find
                stories that match the worlds you love.
              </p>

              <Link to="/discover">
                Explore Stories
                <FaArrowRight size={11} />
              </Link>
            </article>

            <article className="lumora-about__split-card">
              <div className="lumora-about__split-icon">
                <FaPenNib size={17} />
              </div>

              <span>FOR WRITERS</span>

              <h2>Turn your ideas into stories.</h2>

              <p>
                Write, publish your work, connect with readers, and
                start building your audience on Lumora.
              </p>

              <Link to="/become-writer">
                Start Writing
                <FaArrowRight size={11} />
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="lumora-about__cta">
        <div className="lumora-about__container">
          <div className="lumora-about__cta-card">
            <div className="lumora-about__cta-icon">
              <FaHeart size={17} />
            </div>

            <span>WELCOME TO LUMORA</span>

            <h2>There's always another story.</h2>

            <p>
              Start exploring and see where the next story takes you.
            </p>

            <div className="lumora-about__cta-actions">
              <Link
                to="/discover"
                className="lumora-about__cta-primary"
              >
                Discover Stories
                <FaArrowRight size={11} />
              </Link>

              <Link
                to="/become-writer"
                className="lumora-about__cta-secondary"
              >
                Start Writing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;