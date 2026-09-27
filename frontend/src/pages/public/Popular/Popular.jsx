import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaArrowRight,
  FaBookOpen,
  FaFire,
  FaChartLine,
  FaBookmark,
  FaPenNib,
} from "react-icons/fa6";

import Footer from "../../../components/layout/Footer/Footer";

import storyService from "../../../services/stories/storyService";

import "./Popular.css";

const filters = [
  "All",
  "Fantasy",
  "Romance",
  "Horror",
  "Mystery",
  "Sci-Fi",
  "Thriller",
];

function Popular() {
  const [stories, setStories] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  /*
  =========================================================
  LOAD REAL STORIES
  =========================================================
  */

  useEffect(() => {
    const loadPopularStories = async () => {
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
        console.error("Popular stories error:", error);
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    loadPopularStories();
  }, []);

  /*
  =========================================================
  HELPERS
  =========================================================
  */

  const formatNumber = (value) => {
    const number = Number(value) || 0;

    if (number >= 1000000) {
      return `${(number / 1000000).toFixed(1)}M`;
    }

    if (number >= 1000) {
      return `${(number / 1000).toFixed(1)}K`;
    }

    return number.toLocaleString();
  };

  const getLikesCount = (story) => {
    if (Array.isArray(story?.likes)) {
      return story.likes.length;
    }

    return Number(story?.likes) || 0;
  };

  const getBookmarksCount = (story) => {
    if (Array.isArray(story?.bookmarks)) {
      return story.bookmarks.length;
    }

    return Number(story?.bookmarks) || 0;
  };

  /*
  =========================================================
  FILTER + SORT
  =========================================================
  */

  const filteredStories = useMemo(() => {
    const categoryFiltered =
      selectedFilter === "All"
        ? stories
        : stories.filter(
            (story) =>
              story?.category?.toLowerCase() ===
              selectedFilter.toLowerCase()
          );

    return [...categoryFiltered]
      .sort(
        (a, b) =>
          (Number(b?.views) || 0) -
          (Number(a?.views) || 0)
      )
      .slice(0, 8);
  }, [stories, selectedFilter]);

  /*
  =========================================================
  RISING STORIES
  =========================================================

  Current backend does not provide a real growth %
  or time-based trending score.

  So we use the next popular stories as a real-data
  "Rising" section instead of showing fake percentages.
  */

  const risingStories = useMemo(() => {
    const categoryFiltered =
      selectedFilter === "All"
        ? stories
        : stories.filter(
            (story) =>
              story?.category?.toLowerCase() ===
              selectedFilter.toLowerCase()
          );

    return [...categoryFiltered]
      .sort(
        (a, b) =>
          (Number(b?.views) || 0) -
          (Number(a?.views) || 0)
      )
      .slice(8, 11);
  }, [stories, selectedFilter]);

  return (
    <>
      <main className="lumora-popular">

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="lumora-popular__hero">
          <div className="lumora-popular__container">

            <span className="lumora-popular__eyebrow">
              LUMORA POPULAR
            </span>

            <h1>
              Stories everyone
              <br />
              <span>is reading.</span>
            </h1>

            <p>
              Discover the stories readers are loving,
              sharing and coming back to again and again.
            </p>

          </div>
        </section>

        {/* =====================================================
            FILTERS
        ===================================================== */}

        <section className="lumora-popular__filters">
          <div className="lumora-popular__container">

            <div className="lumora-popular__filter-header">

              <div>
                <span>DISCOVER</span>

                <h2>Popular stories</h2>
              </div>

              <div className="lumora-popular__period">
                <FaFire size={12} />
                Most read
              </div>

            </div>

            <div className="lumora-popular__filter-list">

              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() =>
                    setSelectedFilter(filter)
                  }
                  className={
                    selectedFilter === filter
                      ? "lumora-popular__filter lumora-popular__filter--active"
                      : "lumora-popular__filter"
                  }
                >
                  {filter}
                </button>
              ))}

            </div>

          </div>
        </section>

        {/* =====================================================
            RANKING
        ===================================================== */}

        <section className="lumora-popular__ranking">
          <div className="lumora-popular__container">

            <div className="lumora-popular__section-heading">

              <div>
                <span>TOP READS</span>

                <h2>What readers love</h2>

                <p>
                  The most-read published stories
                  on Lumora right now.
                </p>
              </div>

              <span className="lumora-popular__count">
                {filteredStories.length}{" "}
                {filteredStories.length === 1
                  ? "story"
                  : "stories"}
              </span>

            </div>

            {/* =================================================
                LOADING
            ================================================= */}

            {loading ? (

              <div className="lumora-popular__stories">

                {[1, 2, 3, 4].map((item) => (
                  <article
                    key={item}
                    className="lumora-popular__story"
                  >

                    <div className="lumora-popular__rank">
                      #{item}
                    </div>

                    <div className="lumora-popular__cover">
                      <FaBookOpen size={20} />
                    </div>

                    <div className="lumora-popular__story-content">

                      <div className="lumora-popular__story-meta">
                        <span>Loading</span>
                      </div>

                      <span className="lumora-popular__story-title">
                        Loading story...
                      </span>

                    </div>

                  </article>
                ))}

              </div>

            ) : filteredStories.length > 0 ? (

              /* =================================================
                  REAL STORIES
              ================================================= */

              <div className="lumora-popular__stories">

                {filteredStories.map((story, index) => (

                  <article
                    key={story._id}
                    className="lumora-popular__story"
                  >

                    <div className="lumora-popular__rank">
                      #{index + 1}
                    </div>

                    <div className="lumora-popular__cover">

                      {story.coverImage ? (
                        <img
                          src={story.coverImage}
                          alt={story.title}
                        />
                      ) : (
                        <FaBookOpen size={20} />
                      )}

                    </div>

                    <div className="lumora-popular__story-content">

                      <div className="lumora-popular__story-meta">

                        <span>
                          {story.category ||
                            "Uncategorized"}
                        </span>

                        <small>
                          {story.storyType ||
                            "Fiction"}
                        </small>

                      </div>

                      <Link
                        to={`/stories/${story._id}`}
                        className="lumora-popular__story-title"
                      >
                        {story.title}
                      </Link>

                      <p className="lumora-popular__author">
                        by{" "}
                        {story.author?.username ||
                          "Unknown Writer"}
                      </p>

                      <p className="lumora-popular__description">
                        {story.shortDescription ||
                          "Discover this story on Lumora."}
                      </p>

                      <div className="lumora-popular__stats">

                        <span>
                          <FaBookOpen size={10} />
                          {formatNumber(story.views)}
                        </span>

                        <span>
                          ♥{" "}
                          {formatNumber(
                            getLikesCount(story)
                          )}
                        </span>

                        <span>
                          <FaBookmark size={9} />
                          {formatNumber(
                            getBookmarksCount(story)
                          )}
                        </span>

                      </div>

                    </div>

                    <Link
                      to={`/stories/${story._id}`}
                      className="lumora-popular__read"
                      aria-label={`Read ${story.title}`}
                    >
                      <FaArrowRight size={12} />
                    </Link>

                  </article>

                ))}

              </div>

            ) : (

              /* =================================================
                  EMPTY STATE
              ================================================= */

              <div className="lumora-popular__empty">

                <FaBookOpen size={24} />

                <h3>
                  No popular stories found
                </h3>

                <p>
                  There are no published stories
                  in this category yet.
                </p>

                {selectedFilter !== "All" && (
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedFilter("All")
                    }
                  >
                    View all stories
                  </button>
                )}

              </div>

            )}

          </div>
        </section>

        {/* =====================================================
            RISING
        ===================================================== */}

        {!loading && risingStories.length > 0 && (
          <section className="lumora-popular__rising">

            <div className="lumora-popular__container">

              <div className="lumora-popular__section-heading">

                <div>
                  <span>MORE TO READ</span>

                  <h2>
                    More popular stories
                  </h2>

                  <p>
                    More published stories
                    readers are discovering.
                  </p>
                </div>

              </div>

              <div className="lumora-popular__rising-grid">

                {risingStories.map((story) => (

                  <Link
                    key={story._id}
                    to={`/stories/${story._id}`}
                    className="lumora-popular__rising-card"
                  >

                    <div className="lumora-popular__rising-icon">
                      <FaChartLine size={17} />
                    </div>

                    <div>

                      <span>
                        {story.category ||
                          "Uncategorized"}
                      </span>

                      <h3>
                        {story.title}
                      </h3>

                      <p>
                        by{" "}
                        {story.author?.username ||
                          "Unknown Writer"}
                      </p>

                    </div>

                    <strong>
                      {formatNumber(story.views)} reads
                    </strong>

                  </Link>

                ))}

              </div>

            </div>

          </section>
        )}

        {/* =====================================================
            WRITER CTA
        ===================================================== */}

        <section className="lumora-popular__writer">

          <div className="lumora-popular__container">

            <div className="lumora-popular__writer-box">

              <FaPenNib size={18} />

              <span>
                YOUR STORY COULD BE NEXT
              </span>

              <h2>
                Ready to share your world?
              </h2>

              <p>
                Write your story, publish it on Lumora
                and find readers who are waiting
                for something new.
              </p>

              <Link to="/become-writer">
                Start Writing →
              </Link>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}

export default Popular;