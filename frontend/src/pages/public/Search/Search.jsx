import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
  Search as SearchIcon,
  Clock3,
  TrendingUp,
  Users,
  ArrowRight,
  X,
} from "lucide-react";

import Navbar from "../../../components/layout/Navbar/Navbar";
import Footer from "../../../components/layout/Footer/Footer";

import storyService from "../../../services/stories/storyService";

import "./Search.css";

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [recentSearches, setRecentSearches] = useState([
    "Fantasy",
    "Under a Dead Sky",
    "Aarav Mehta",
  ]);

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
        console.error("Search stories error:", error);
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    loadStories();
  }, []);

  /*
  =========================================================
  NORMALIZED SEARCH QUERY
  =========================================================
  */

  const normalizedQuery = query.trim().toLowerCase();

  /*
  =========================================================
  FILTER STORIES
  =========================================================
  */

  const filteredStories = normalizedQuery
    ? stories.filter((story) => {
        const title = story?.title?.toLowerCase() || "";
        const description =
          story?.shortDescription?.toLowerCase() || "";
        const category = story?.category?.toLowerCase() || "";
        const author =
          story?.author?.username?.toLowerCase() || "";

        return (
          title.includes(normalizedQuery) ||
          description.includes(normalizedQuery) ||
          category.includes(normalizedQuery) ||
          author.includes(normalizedQuery)
        );
      })
    : [];

  /*
  =========================================================
  FILTER AUTHORS
  =========================================================
  */

  const filteredAuthors = normalizedQuery
    ? Array.from(
        new Map(
          stories
            .filter((story) =>
              story?.author?.username
                ?.toLowerCase()
                .includes(normalizedQuery)
            )
            .map((story) => [
              story?.author?._id,
              story?.author,
            ])
        ).values()
      )
    : [];

  /*
  =========================================================
  RECENT SEARCHES
  =========================================================
  */

  const handleSearch = (event) => {
    event.preventDefault();

    const value = query.trim();

    if (!value) {
      setSearchParams({});
      return;
    }

    setRecentSearches((current) =>
      [
        value,
        ...current.filter(
          (item) =>
            item.toLowerCase() !== value.toLowerCase()
        ),
      ].slice(0, 5)
    );

    setSearchParams({ q: value });
  };

  /*
  =========================================================
  REMOVE RECENT SEARCH
  =========================================================
  */

  const removeRecentSearch = (value) => {
    setRecentSearches((current) =>
      current.filter((item) => item !== value)
    );
  };

  /*
  =========================================================
  CLEAR SEARCH
  =========================================================
  */

  const handleClearSearch = () => {
    setQuery("");
    setSearchParams({});
  };

  /*
  =========================================================
  SELECT RECENT SEARCH
  =========================================================
  */

  const handleRecentSearch = (item) => {
    setQuery(item);
    setSearchParams({ q: item });
  };

  /*
  =========================================================
  RENDER
  =========================================================
  */

  return (
    <div className="lumora-search-page">
      <Navbar />

      <main className="lumora-search-page__main">
        <div className="lumora-search-page__container">

          {/* =================================================
              HEADER
          ================================================= */}

          <header className="lumora-search-page__header">
            <span className="lumora-search-page__eyebrow">
              DISCOVER LUMORA
            </span>

            <h1>Search stories and writers.</h1>

            <p>
              Find stories, authors and genres that match what
              you want to read.
            </p>
          </header>

          {/* =================================================
              SEARCH BAR
          ================================================= */}

          <form
            className="lumora-search-page__search"
            onSubmit={handleSearch}
          >
            <SearchIcon
              size={20}
              strokeWidth={1.8}
              className="lumora-search-page__search-icon"
            />

            <input
              type="search"
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Search stories, writers, genres..."
              aria-label="Search Lumora"
            />

            {query && (
              <button
                type="button"
                className="lumora-search-page__clear"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                <X size={17} />
              </button>
            )}

            <button
              type="submit"
              className="lumora-search-page__submit"
            >
              Search
            </button>
          </form>

          {/* =================================================
              SEARCH RESULTS
          ================================================= */}

          {normalizedQuery ? (
            <section className="lumora-search-page__results">

              <div className="lumora-search-page__section-heading">
                <div>
                  <span>SEARCH RESULTS</span>

                  <h2>
                    Results for "{query}"
                  </h2>
                </div>
              </div>

              {/* =================================================
                  LOADING
              ================================================= */}

              {loading ? (
                <div className="lumora-search-page__empty">
                  <SearchIcon size={24} />

                  <h3>Searching...</h3>

                  <p>
                    Finding stories and writers for you.
                  </p>
                </div>
              ) : (
                <>
                  {/* ================= STORIES ================= */}

                  {filteredStories.length > 0 && (
                    <div className="lumora-search-page__result-group">

                      <div className="lumora-search-page__group-title">
                        <TrendingUp size={16} />

                        <span>Stories</span>
                      </div>

                      <div className="lumora-search-page__story-list">

                        {filteredStories.map((story) => (
                          <Link
                            key={story._id}
                            to={`/stories/${story._id}`}
                            className="lumora-search-page__story"
                          >

                            <div className="lumora-search-page__story-cover">
                              {story.coverImage ? (
                                <img
                                  src={story.coverImage}
                                  alt={story.title}
                                />
                              ) : (
                                <span>
                                  {story.title
                                    ?.charAt(0)
                                    ?.toUpperCase()}
                                </span>
                              )}
                            </div>

                            <div className="lumora-search-page__story-content">
                              <h3>{story.title}</h3>

                              <p>
                                {story.author?.username ||
                                  "Unknown Writer"}
                              </p>

                              <span>
                                {story.category ||
                                  "Uncategorized"}
                              </span>
                            </div>

                            <ArrowRight size={16} />
                          </Link>
                        ))}

                      </div>
                    </div>
                  )}

                  {/* ================= AUTHORS ================= */}

                  {filteredAuthors.length > 0 && (
                    <div className="lumora-search-page__result-group">

                      <div className="lumora-search-page__group-title">
                        <Users size={16} />

                        <span>Authors</span>
                      </div>

                      <div className="lumora-search-page__author-list">

                        {filteredAuthors.map((author) => (
                          <Link
                            key={author?._id}
                            to={`/profile/${author?._id}`}
                            className="lumora-search-page__author"
                          >

                            <div className="lumora-search-page__author-avatar">
                              {author?.username
                                ?.split(" ")
                                .map((part) => part[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase() || "U"}
                            </div>

                            <div>
                              <h3>
                                {author?.username ||
                                  "Unknown Writer"}
                              </h3>

                              <p>
                                Writer on Lumora
                              </p>
                            </div>

                            <ArrowRight size={16} />
                          </Link>
                        ))}

                      </div>
                    </div>
                  )}

                  {/* ================= NO RESULTS ================= */}

                  {!filteredStories.length &&
                    !filteredAuthors.length && (
                      <div className="lumora-search-page__empty">

                        <SearchIcon size={24} />

                        <h3>No results found</h3>

                        <p>
                          Try searching for another story,
                          writer or genre.
                        </p>

                      </div>
                    )}
                </>
              )}

            </section>
          ) : (

            /* =================================================
               DISCOVERY STATE
            ================================================= */

            <div className="lumora-search-page__discovery">

              {/* =================================================
                  RECENT SEARCHES
              ================================================= */}

              <section className="lumora-search-page__block">

                <div className="lumora-search-page__section-heading">
                  <div>
                    <span>YOUR SEARCHES</span>

                    <h2>Recent Searches</h2>
                  </div>
                </div>

                {recentSearches.length > 0 ? (

                  <div className="lumora-search-page__recent">

                    {recentSearches.map((item) => (
                      <button
                        key={item}
                        type="button"
                        className="lumora-search-page__recent-item"
                        onClick={() =>
                          handleRecentSearch(item)
                        }
                      >
                        <Clock3 size={15} />

                        <span>{item}</span>

                        <X
                          size={14}
                          onClick={(event) => {
                            event.stopPropagation();
                            removeRecentSearch(item);
                          }}
                        />
                      </button>
                    ))}

                  </div>

                ) : (

                  <p className="lumora-search-page__muted">
                    Your recent searches will appear here.
                  </p>

                )}

              </section>

              {/* =================================================
                  TRENDING STORIES
              ================================================= */}

              <section className="lumora-search-page__block">

                <div className="lumora-search-page__section-heading">

                  <div>
                    <span>
                      WHAT READERS ARE READING
                    </span>

                    <h2>Trending Stories</h2>
                  </div>

                  <Link to="/popular">
                    View all
                    <ArrowRight size={14} />
                  </Link>

                </div>

                {loading ? (
                  <div className="lumora-search-page__muted">
                    Loading stories...
                  </div>
                ) : stories.length > 0 ? (

                  <div className="lumora-search-page__story-list">

                    {[...stories]
                      .sort(
                        (a, b) =>
                          (b.views || 0) -
                          (a.views || 0)
                      )
                      .slice(0, 4)
                      .map((story) => (
                        <Link
                          key={story._id}
                          to={`/stories/${story._id}`}
                          className="lumora-search-page__story"
                        >

                          <div className="lumora-search-page__story-cover">
                            {story.coverImage ? (
                              <img
                                src={story.coverImage}
                                alt={story.title}
                              />
                            ) : (
                              <span>
                                {story.title
                                  ?.charAt(0)
                                  ?.toUpperCase()}
                              </span>
                            )}
                          </div>

                          <div className="lumora-search-page__story-content">
                            <h3>{story.title}</h3>

                            <p>
                              {story.author?.username ||
                                "Unknown Writer"}
                            </p>

                            <span>
                              {story.category ||
                                "Uncategorized"}
                            </span>
                          </div>

                          <ArrowRight size={16} />
                        </Link>
                      ))}

                  </div>

                ) : (

                  <p className="lumora-search-page__muted">
                    No published stories available yet.
                  </p>

                )}

              </section>

              {/* =================================================
                  POPULAR AUTHORS
              ================================================= */}

              <section className="lumora-search-page__block">

                <div className="lumora-search-page__section-heading">

                  <div>
                    <span>
                      COMMUNITY FAVOURITES
                    </span>

                    <h2>Popular Authors</h2>
                  </div>

                  <Link to="/community">
                    View all
                    <ArrowRight size={14} />
                  </Link>

                </div>

                {loading ? (
                  <div className="lumora-search-page__muted">
                    Loading authors...
                  </div>
                ) : stories.length > 0 ? (

                  <div className="lumora-search-page__author-list">

                    {Array.from(
                      new Map(
                        stories.map((story) => [
                          story?.author?._id,
                          story?.author,
                        ])
                      ).values()
                    )
                      .filter(Boolean)
                      .slice(0, 4)
                      .map((author) => (

                        <Link
                          key={author._id}
                          to={`/profile/${author._id}`}
                          className="lumora-search-page__author"
                        >

                          <div className="lumora-search-page__author-avatar">
                            {author?.username
                              ?.split(" ")
                              .map((part) => part[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase() || "U"}
                          </div>

                          <div>
                            <h3>
                              {author?.username ||
                                "Unknown Writer"}
                            </h3>

                            <p>
                              Writer on Lumora
                            </p>
                          </div>

                          <ArrowRight size={16} />

                        </Link>

                      ))}

                  </div>

                ) : (

                  <p className="lumora-search-page__muted">
                    No authors available yet.
                  </p>

                )}

              </section>

            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Search;