import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowRight,
  FaBookOpen,
  FaFilter,
  FaHeart,
  FaBookmark,
} from "react-icons/fa6";

import Footer from "../../../components/layout/Footer/Footer";
import storyService from "../../../services/stories/storyService";

import "./GenreStories.css";

const genreConfig = {
  fantasy: {
    name: "Fantasy",
    description:
      "Magic, kingdoms, mythical worlds and impossible adventures.",
    intro:
      "Step into worlds where magic is real, kingdoms rise and fall, and anything is possible.",
    related: ["Adventure", "Paranormal", "Mystery", "Drama"],
  },

  romance: {
    name: "Romance",
    description:
      "Love, relationships, emotions and unforgettable connections.",
    intro:
      "Discover stories about love, relationships, heartbreak and the connections that change everything.",
    related: ["Drama", "Comedy", "Coming of Age", "LGBTQ"],
  },

  mystery: {
    name: "Mystery",
    description:
      "Secrets, clues, investigations and unexpected answers.",
    intro:
      "Follow hidden clues, uncover secrets and discover stories where nothing is quite what it seems.",
    related: ["Crime", "Thriller", "Horror", "Paranormal"],
  },

  horror: {
    name: "Horror",
    description:
      "Dark places, terrifying secrets and stories that haunt you.",
    intro:
      "Enter unsettling worlds filled with fear, darkness, supernatural mysteries and things best left unknown.",
    related: ["Paranormal", "Mystery", "Thriller", "Dystopian"],
  },

  thriller: {
    name: "Thriller",
    description:
      "Suspense, danger, twists and stories that keep you guessing.",
    intro:
      "Stay on the edge of your seat with dangerous choices, unexpected twists and relentless suspense.",
    related: ["Mystery", "Crime", "Horror", "Adventure"],
  },

  "sci-fi": {
    name: "Sci-Fi",
    description:
      "Space, technology, distant worlds and the future.",
    intro:
      "Explore distant planets, advanced technology, alternate futures and worlds beyond imagination.",
    related: ["Dystopian", "Adventure", "Mystery", "Thriller"],
  },

  adventure: {
    name: "Adventure",
    description:
      "Journeys, discoveries, danger and unforgettable adventures.",
    intro:
      "Follow characters across unknown lands, dangerous journeys and worlds waiting to be discovered.",
    related: ["Fantasy", "Sci-Fi", "Thriller", "Historical"],
  },

  drama: {
    name: "Drama",
    description:
      "Emotional stories about people, choices and life-changing moments.",
    intro:
      "Experience powerful characters, difficult choices, relationships and moments that stay with you.",
    related: ["Romance", "Coming of Age", "Crime", "LGBTQ"],
  },

  crime: {
    name: "Crime",
    description:
      "Criminal minds, investigations, secrets and dangerous choices.",
    intro:
      "Enter stories of investigations, criminals, conspiracies and the pursuit of truth.",
    related: ["Mystery", "Thriller", "Drama", "Historical"],
  },

  historical: {
    name: "Historical",
    description:
      "Stories inspired by people, places and moments from history.",
    intro:
      "Travel through different eras and experience stories shaped by history, culture and changing worlds.",
    related: ["Drama", "Adventure", "Romance", "Crime"],
  },

  action: {
    name: "Action",
    description:
      "Fast-paced stories filled with danger, conflict, battles and unforgettable heroes.",
    intro:
      "Enter worlds of high-stakes missions, powerful characters, dangerous enemies and battles where every decision matters.",
    related: ["Adventure", "Thriller", "Crime", "Fantasy"],
  },

  supernatural: {
    name: "Supernatural",
    description:
      "Strange powers, mysterious forces and worlds beyond the ordinary.",
    intro:
      "Discover stories where supernatural forces, mysterious abilities and unexplained events become part of everyday life.",
    related: ["Paranormal", "Horror", "Fantasy", "Mystery"],
  },

  psychological: {
    name: "Psychological",
    description:
      "Stories exploring the mind, emotions, secrets and human behavior.",
    intro:
      "Explore stories filled with complex minds, emotional struggles, hidden motives and unexpected twists.",
    related: ["Mystery", "Thriller", "Drama", "Horror"],
  },

  poetry: {
    name: "Poetry",
    description:
      "Words, emotions and ideas expressed through poetry.",
    intro:
      "Discover poems that turn emotions, memories, ideas and experiences into words.",
    related: ["Romance", "Drama", "Coming of Age", "LGBTQ"],
  },

  nonfiction: {
    name: "Nonfiction",
    description:
      "Real experiences, ideas, knowledge and stories from life.",
    intro:
      "Read real experiences, personal journeys, knowledge and perspectives from the world around us.",
    related: ["Historical", "Drama", "Short Stories", "Coming of Age"],
  },

  fanfiction: {
    name: "Fanfiction",
    description:
      "New stories inspired by worlds, characters and fandoms you love.",
    intro:
      "Explore new adventures, alternate stories and fresh interpretations of familiar worlds and characters.",
    related: ["Fantasy", "Romance", "Adventure", "Sci-Fi"],
  },

  "young-adult": {
    name: "Young Adult",
    description:
      "Stories about growing up, identity, friendship and finding your place.",
    intro:
      "Discover stories about identity, friendship, relationships, growing up and the challenges of becoming yourself.",
    related: ["Coming of Age", "Romance", "Drama", "Fantasy"],
  },

  comedy: {
    name: "Comedy",
    description:
      "Funny stories, memorable characters and moments that make you laugh.",
    intro:
      "Take a break and discover stories filled with humor, chaos, friendship and unforgettable characters.",
    related: ["Romance", "Drama", "Short Stories", "Young Adult"],
  },

  "short-stories": {
    name: "Short Stories",
    description:
      "Complete stories that take you somewhere in just a few pages.",
    intro:
      "Find powerful ideas, memorable characters and complete stories you can enjoy in one sitting.",
    related: ["Poetry", "Drama", "Horror", "Comedy"],
  },

  paranormal: {
    name: "Paranormal",
    description:
      "Supernatural mysteries, unexplained events and strange encounters.",
    intro:
      "Discover stories where the unexplained becomes real and the supernatural waits just beyond the ordinary.",
    related: ["Horror", "Mystery", "Fantasy", "Thriller"],
  },

  dystopian: {
    name: "Dystopian",
    description:
      "Broken societies, controlled futures and worlds on the edge.",
    intro:
      "Explore imagined futures shaped by control, rebellion, survival and societies that have lost their way.",
    related: ["Sci-Fi", "Thriller", "Adventure", "Drama"],
  },

  "coming-of-age": {
    name: "Coming of Age",
    description:
      "Stories about growing up, identity, change and discovering yourself.",
    intro:
      "Follow characters through friendship, change, first experiences and the journey toward discovering who they are.",
    related: ["Young Adult", "Romance", "Drama", "LGBTQ"],
  },

  lgbtq: {
    name: "LGBTQ",
    description:
      "Stories about identity, love, relationships and authentic experiences.",
    intro:
      "Discover stories about identity, relationships, self-discovery, love and finding the courage to be yourself.",
    related: ["Romance", "Drama", "Coming of Age", "Young Adult"],
  },
};

const filters = ["All", "Latest", "Popular", "Most Read"];

function GenreStories() {
  const { genre } = useParams();

  const normalizedGenre = genre?.toLowerCase();

  const currentGenre =
    genreConfig[normalizedGenre] || {
      name: "Stories",
      description: "Explore stories on Lumora.",
      intro:
        "Discover stories, writers and worlds waiting to be explored.",
      related: ["Fantasy", "Romance", "Mystery", "Adventure"],
    };

  const [stories, setStories] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGenreStories = async () => {
      try {
        setLoading(true);

        const response = await storyService.getStories();

        const realStories = Array.isArray(response?.stories)
          ? response.stories
          : Array.isArray(response?.data?.stories)
          ? response.data.stories
          : [];

        const filteredStories = realStories.filter((story) => {
          const storyStatus =
            story?.status?.toLowerCase();

          const visibility =
            story?.visibility?.toLowerCase();

          const storyCategory =
            story?.category?.toLowerCase();

          return (
            storyStatus === "published" &&
            visibility === "public" &&
            storyCategory === normalizedGenre
          );
        });

        setStories(filteredStories);
      } catch (error) {
        console.error(
          "Genre Stories Error:",
          error
        );

        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    loadGenreStories();
  }, [normalizedGenre]);

  const sortedStories = useMemo(() => {
    const result = [...stories];

    if (activeFilter === "Latest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );
    }

    if (
      activeFilter === "Popular" ||
      activeFilter === "Most Read"
    ) {
      result.sort(
        (a, b) =>
          Number(b.views || 0) -
          Number(a.views || 0)
      );
    }

    return result;
  }, [stories, activeFilter]);

  const formatNumber = (value) => {
    const number = Number(value || 0);

    if (number >= 1000000) {
      return `${(number / 1000000)
        .toFixed(1)
        .replace(".0", "")}M`;
    }

    if (number >= 1000) {
      return `${(number / 1000)
        .toFixed(1)
        .replace(".0", "")}K`;
    }

    return number.toLocaleString("en-IN");
  };

  const getLikeCount = (story) => {
    if (Array.isArray(story?.likes)) {
      return story.likes.length;
    }

    return Number(story?.likes || 0);
  };

  const getBookmarkCount = (story) => {
    if (Array.isArray(story?.bookmarks)) {
      return story.bookmarks.length;
    }

    return Number(story?.bookmarks || 0);
  };

  return (
    <div className="lumora-genre-page">

      {/* HERO */}
      <section className="lumora-genre-page__hero">
        <div className="lumora-genre-page__container">

          <span className="lumora-genre-page__eyebrow">
            EXPLORE GENRE
          </span>

          <h1>{currentGenre.name}</h1>

          <p className="lumora-genre-page__description">
            {currentGenre.description}
          </p>

          <p className="lumora-genre-page__intro">
            {currentGenre.intro}
          </p>

        </div>
      </section>

      {/* STORIES */}
      <section className="lumora-genre-page__stories">
        <div className="lumora-genre-page__container">

          <div className="lumora-genre-page__section-header">
            <div>
              <span>DISCOVER</span>

              <h2>
                {currentGenre.name} stories
              </h2>

              <p>
                Stories readers are exploring in this genre.
              </p>
            </div>

            <span className="lumora-genre-page__count">
              {stories.length} stories
            </span>
          </div>

          {/* FILTERS */}
          <div className="lumora-genre-page__filters">

            <div className="lumora-genre-page__filter-label">
              <FaFilter size={11} />
              Sort stories
            </div>

            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() =>
                  setActiveFilter(filter)
                }
                className={`lumora-genre-page__filter ${
                  activeFilter === filter
                    ? "lumora-genre-page__filter--active"
                    : ""
                }`}
              >
                {filter}
              </button>
            ))}

          </div>

          {/* GRID */}
          {loading ? (
            <div className="home-section-loading">
              Loading stories...
            </div>
          ) : sortedStories.length === 0 ? (
            <div className="home-section-empty">
              No published stories found in this genre yet.
            </div>
          ) : (
            <div className="lumora-genre-page__grid">

              {sortedStories.map((story) => (
                <article
                  key={story._id}
                  className="lumora-genre-page__card"
                >

                  <Link
                    to={`/stories/${story._id}`}
                    className="lumora-genre-page__cover"
                  >
                    {story.coverImage ? (
                      <img
                        src={story.coverImage}
                        alt={story.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div className="lumora-genre-page__cover-content">

                        <span>
                          {story.category}
                        </span>

                        <FaBookOpen size={22} />

                        <strong>
                          {story.title}
                        </strong>

                      </div>
                    )}
                  </Link>

                  <div className="lumora-genre-page__card-body">

                    <span className="lumora-genre-page__card-category">
                      {story.category}
                    </span>

                    <Link
                      to={`/stories/${story._id}`}
                      className="lumora-genre-page__card-title"
                    >
                      {story.title}
                    </Link>

                    <span className="lumora-genre-page__author">
                      by{" "}
                      {story.author?.username ||
                        story.author?.displayName ||
                        "Unknown Writer"}
                    </span>

                    <p>
                      {story.shortDescription ||
                        story.description ||
                        "No description available."}
                    </p>

                    <div className="lumora-genre-page__stats">

                      <span>
                        <FaBookOpen size={10} />
                        {formatNumber(
                          story.views
                        )}
                      </span>

                      <span>
                        <FaHeart size={10} />
                        {formatNumber(
                          getLikeCount(story)
                        )}
                      </span>

                      <span>
                        <FaBookmark size={10} />
                        {formatNumber(
                          getBookmarkCount(story)
                        )}
                      </span>

                    </div>

                  </div>

                </article>
              ))}

            </div>
          )}

          {sortedStories.length > 0 && (
            <button
              type="button"
              className="lumora-genre-page__load-more"
            >
              Load more stories
              <FaArrowRight size={11} />
            </button>
          )}

        </div>
      </section>

      {/* RELATED GENRES */}
      <section className="lumora-genre-page__related">
        <div className="lumora-genre-page__container">

          <div className="lumora-genre-page__section-header">
            <div>
              <span>KEEP EXPLORING</span>

              <h2>Related genres</h2>

              <p>
                You might find your next favorite story here.
              </p>
            </div>
          </div>

          <div className="lumora-genre-page__related-grid">

            {currentGenre.related.map(
              (relatedGenre) => {
                const relatedSlug = relatedGenre
                  .toLowerCase()
                  .replace(/\s+/g, "-");

                return (
                  <Link
                    key={relatedGenre}
                    to={`/categories/${relatedSlug}`}
                    className="lumora-genre-page__related-card"
                  >
                    <span>{relatedGenre}</span>
                    <FaArrowRight size={11} />
                  </Link>
                );
              }
            )}

          </div>

        </div>
      </section>

      {/* WRITER CTA */}
      <section className="lumora-genre-page__cta">
        <div className="lumora-genre-page__container">

          <div className="lumora-genre-page__cta-box">

            <span>FOR WRITERS</span>

            <h2>
              Your story belongs here.
            </h2>

            <p>
              Have a story that fits this genre?
              Share it with readers on Lumora.
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

export default GenreStories;