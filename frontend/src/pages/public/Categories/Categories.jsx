import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaArrowRight,
  FaBook,
  FaFeather,
  FaGhost,
  FaHeart,
  FaMask,
  FaRocket,
  FaWandMagicSparkles,
  FaBolt,
} from "react-icons/fa6";

import Footer from "../../../components/layout/Footer/Footer";

import storyService from "../../../services/stories/storyService";

import "./Categories.css";

/*
=========================================================
GENRE CONFIGURATION
=========================================================
*/

const genreConfig = [
  {
    name: "Fantasy",
    description:
      "Magic, kingdoms, mythical worlds and impossible adventures.",
    path: "/categories/fantasy",
    icon: FaWandMagicSparkles,
  },
  {
    name: "Romance",
    description:
      "Love, relationships, emotions and unforgettable connections.",
    path: "/categories/romance",
    icon: FaHeart,
  },
  {
    name: "Horror",
    description:
      "Dark places, terrifying secrets and stories that haunt you.",
    path: "/categories/horror",
    icon: FaGhost,
  },
  {
    name: "Mystery",
    description:
      "Secrets, clues, investigations and unexpected answers.",
    path: "/categories/mystery",
    icon: FaMask,
  },
  {
    name: "Sci-Fi",
    description:
      "Space, technology, distant worlds and the future.",
    path: "/categories/sci-fi",
    icon: FaRocket,
  },
  {
    name: "Thriller",
    description:
      "Suspense, danger, twists and stories that keep you guessing.",
    path: "/categories/thriller",
    icon: FaBolt,
  },
  {
    name: "Fiction",
    description:
      "Original worlds, unforgettable characters and endless possibilities.",
    path: "/categories/fiction",
    icon: FaBook,
  },
  {
    name: "Poetry",
    description:
      "Words, emotions and thoughts expressed through poetry.",
    path: "/categories/poetry",
    icon: FaFeather,
  },
  {
    name: "Nonfiction",
    description:
      "Real experiences, ideas, knowledge and stories from life.",
    path: "/categories/nonfiction",
    icon: FaFeather,
  },
];

/*
=========================================================
POPULAR GENRE NAMES
=========================================================
*/

const popularGenreNames = ["Fantasy", "Horror", "Romance"];

function Categories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  /*
  =========================================================
  LOAD REAL STORIES
  =========================================================
  */

  useEffect(() => {
    const loadStories = async () => {
      try {
        setLoading(true);

        const response = await storyService.getStories();

        const realStories = Array.isArray(response?.stories)
          ? response.stories
          : Array.isArray(response?.data?.stories)
          ? response.data.stories
          : [];

        const publishedStories = realStories.filter(
          (story) =>
            story?.status?.toLowerCase() === "published" &&
            story?.visibility?.toLowerCase() === "public"
        );

        setStories(publishedStories);
      } catch (error) {
        console.error("Categories stories error:", error);
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    loadStories();
  }, []);

  /*
  =========================================================
  CATEGORY COUNTS
  =========================================================
  */

  const genreCounts = useMemo(() => {
    const counts = {};

    genreConfig.forEach((genre) => {
      counts[genre.name.toLowerCase()] = 0;
    });

    stories.forEach((story) => {
      const category = story?.category?.toLowerCase();

      if (category) {
        counts[category] = (counts[category] || 0) + 1;
      }
    });

    return counts;
  }, [stories]);

  /*
  =========================================================
  POPULAR GENRES
  =========================================================
  */

  const popularGenres = genreConfig.filter((genre) =>
    popularGenreNames.includes(genre.name)
  );

  /*
  =========================================================
  HELPERS
  =========================================================
  */

  const getStoryCount = (genreName) => {
    return genreCounts[genreName.toLowerCase()] || 0;
  };

  return (
    <div className="lumora-categories">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="lumora-categories__hero">
        <div className="lumora-categories__container">

          <span className="lumora-categories__eyebrow">
            EXPLORE LUMORA
          </span>

          <h1>
            Find a world
            <span> worth getting lost in.</span>
          </h1>

          <p>
            Explore stories by genre and discover the worlds,
            characters and ideas waiting for you.
          </p>

        </div>
      </section>

      {/* =====================================================
          POPULAR GENRES
      ===================================================== */}

      <section className="lumora-categories__popular">
        <div className="lumora-categories__container">

          <div className="lumora-categories__section-header">

            <div>
              <span className="lumora-categories__section-eyebrow">
                START HERE
              </span>

              <h2>Popular genres</h2>

              <p>
                Some of the worlds Lumora readers are
                exploring right now.
              </p>
            </div>

          </div>

          <div className="lumora-categories__popular-grid">

            {popularGenres.map((genre) => {
              const Icon = genre.icon;
              const count = getStoryCount(genre.name);

              return (
                <Link
                  key={genre.name}
                  to={genre.path}
                  className="lumora-categories__popular-card"
                >

                  <div className="lumora-categories__icon">
                    <Icon size={17} />
                  </div>

                  <span className="lumora-categories__card-label">
                    {loading
                      ? "Loading"
                      : count > 0
                      ? `${count} ${
                          count === 1 ? "story" : "stories"
                        }`
                      : "Explore"}
                  </span>

                  <h3>{genre.name}</h3>

                  <p>{genre.description}</p>

                  <span className="lumora-categories__explore">
                    Explore genre
                    <FaArrowRight size={9} />
                  </span>

                  <div className="lumora-categories__circle" />

                </Link>
              );
            })}

          </div>
        </div>
      </section>

      {/* =====================================================
          ALL GENRES
      ===================================================== */}

      <section className="lumora-categories__all">
        <div className="lumora-categories__container">

          <div className="lumora-categories__section-header lumora-categories__section-header--all">

            <div>
              <span className="lumora-categories__section-eyebrow">
                ALL GENRES
              </span>

              <h2>Explore by genre</h2>

              <p>
                Choose a genre and find your next story.
              </p>
            </div>

            <span className="lumora-categories__genre-count">
              {genreConfig.length} genres
            </span>

          </div>

          <div className="lumora-categories__grid">

            {genreConfig.map((genre) => {
              const Icon = genre.icon;
              const count = getStoryCount(genre.name);

              return (
                <Link
                  key={genre.name}
                  to={genre.path}
                  className="lumora-categories__genre-card"
                >

                  <div className="lumora-categories__genre-icon">
                    <Icon size={15} />
                  </div>

                  <div className="lumora-categories__genre-content">

                    <h3>{genre.name}</h3>

                    <p>{genre.description}</p>

                    <span>
                      {loading
                        ? "Loading..."
                        : `${count} ${
                            count === 1 ? "story" : "stories"
                          }`}
                    </span>

                  </div>

                  <FaArrowRight
                    className="lumora-categories__genre-arrow"
                    size={10}
                  />

                </Link>
              );
            })}

          </div>
        </div>
      </section>

      {/* =====================================================
          WRITER CTA
      ===================================================== */}

      <section className="lumora-categories__writer">
        <div className="lumora-categories__container">

          <div className="lumora-categories__writer-box">

            <div className="lumora-categories__writer-icon">
              <FaFeather size={16} />
            </div>

            <span>FOR WRITERS</span>

            <h2>Don't see your story yet?</h2>

            <p>
              Create it yourself. Share your world with
              readers on Lumora.
            </p>

            <Link to="/become-writer">
              Start Writing
              <FaArrowRight size={10} />
            </Link>

          </div>

        </div>
      </section>

      <Footer />

    </div>
  );
}

export default Categories;