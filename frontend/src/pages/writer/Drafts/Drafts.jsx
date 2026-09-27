import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  BookOpen,
  Plus,
  Search,
  MoreHorizontal,
  Edit3,
  Eye,
  Clock3,
} from "lucide-react";

import lumoraLogo from "../../../assets/logo/lumora-logo-bold.svg";

import storyService from "../../../services/stories/storyService";
import useAuth from "../../../context/AuthContext/useAuth";

import "./Drafts.css";

function Drafts() {
  // =====================================================
  // AUTH
  // =====================================================

  const { user } = useAuth();

  // =====================================================
  // STATE
  // =====================================================

  const [drafts, setDrafts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const [openMenu, setOpenMenu] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD REAL STORIES
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    const loadDrafts = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await storyService.getMyStories();

        if (cancelled) {
          return;
        }

        console.log(
          "MY STORIES FOR DRAFTS:",
          response
        );

        const stories =
          response?.stories ||
          response?.data?.stories ||
          response?.data ||
          [];

        const realDrafts = Array.isArray(stories)
          ? stories.filter((story) => {
              const status =
                String(
                  story?.status || ""
                ).toLowerCase();

              return status === "draft";
            })
          : [];

        setDrafts(realDrafts);
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          "Drafts loading error:",
          err
        );

        setError(
          err?.response?.data?.message ||
            "Unable to load your drafts."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDrafts();

    return () => {
      cancelled = true;
    };
  }, []);

  // =====================================================
  // HELPERS
  // =====================================================

  const formatNumber = (value) => {
    return Number(value || 0).toLocaleString(
      "en-IN"
    );
  };

  const formatUpdatedDate = (date) => {
    if (!date) {
      return "Unknown";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Unknown";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getStoryId = (story) => {
    return story?._id || story?.id;
  };

  const getChapterCount = (story) => {
    return Number(
      story?.chapterCount ||
        story?.chapters?.length ||
        0
    );
  };

  const getViews = (story) => {
    return Number(
      story?.views || 0
    );
  };

  // =====================================================
  // SEARCH + SORT
  // =====================================================

  const filteredDrafts = useMemo(() => {
    const query =
      searchQuery.trim().toLowerCase();

    const result = drafts.filter((draft) => {
      const title =
        String(
          draft?.title || ""
        ).toLowerCase();

      const category =
        String(
          draft?.category || ""
        ).toLowerCase();

      const description =
        String(
          draft?.shortDescription ||
            draft?.description ||
            ""
        ).toLowerCase();

      return (
        !query ||
        title.includes(query) ||
        category.includes(query) ||
        description.includes(query)
      );
    });

    if (sortBy === "progress-high") {
      return [...result].sort(
        (a, b) =>
          getChapterCount(b) -
          getChapterCount(a)
      );
    }

    if (sortBy === "progress-low") {
      return [...result].sort(
        (a, b) =>
          getChapterCount(a) -
          getChapterCount(b)
      );
    }

    // Recently updated
    return [...result].sort(
      (a, b) =>
        new Date(
          b?.updatedAt || 0
        ) -
        new Date(
          a?.updatedAt || 0
        )
    );
  }, [
    drafts,
    searchQuery,
    sortBy,
  ]);

  // =====================================================
  // USER INFO
  // =====================================================

  const writerName =
    user?.displayName ||
    user?.username ||
    "Writer";

  const avatarLetter =
    writerName
      .charAt(0)
      .toUpperCase();

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="writer-layout drafts-page">
        <main className="drafts-main">
          <div className="drafts-container">
            <div
              style={{
                padding: "80px 20px",
                textAlign: "center",
                color: "#888",
              }}
            >
              Loading your drafts...
            </div>
          </div>
        </main>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="writer-layout drafts-page">
        <main className="drafts-main">
          <div className="drafts-container">
            <div
              style={{
                padding: "40px",
                background: "#fff6f3",
                border: "1px solid #ffd5ca",
                borderRadius: "12px",
                color: "#d94f2b",
              }}
            >
              <strong>
                Unable to load drafts
              </strong>

              <p>{error}</p>

              <button
                type="button"
                className="cta-button"
                onClick={() =>
                  window.location.reload()
                }
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="writer-layout drafts-page">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="writer-sidebar">

        <Link
          to="/"
          className="writer-brand"
        >
          <img
            src={lumoraLogo}
            alt="Lumora"
            className="writer-brand-logo"
          />
        </Link>

        <nav className="writer-nav">

          <Link
            to="/dashboard"
            className="writer-nav-item"
          >
            <BookOpen size={18} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/my-stories"
            className="writer-nav-item"
          >
            <BookOpen size={18} />
            <span>My Stories</span>
          </Link>

          <Link
            to="/create-story"
            className="writer-nav-item"
          >
            <Plus size={18} />
            <span>Create Story</span>
          </Link>

          <Link
            to="/drafts"
            className="writer-nav-item active"
          >
            <Edit3 size={18} />
            <span>Drafts</span>
          </Link>

          <Link
            to="/analytics"
            className="writer-nav-item"
          >
            <Clock3 size={18} />
            <span>Analytics</span>
          </Link>

        </nav>

        <div className="writer-sidebar-bottom">

          <Link
            to="/settings"
            className="writer-nav-item"
          >
            <MoreHorizontal size={18} />
            <span>Settings</span>
          </Link>

          <div className="writer-user">

            <div className="writer-avatar">
              {avatarLetter}
            </div>

            <div>
              <strong>
                {writerName}
              </strong>

              <span>
                Writer
              </span>
            </div>

          </div>

        </div>

      </aside>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="drafts-main">

        <div className="drafts-container">

          {/* =================================================
              HEADER
          ================================================= */}

          <header className="drafts-header">

            <div>

              <span className="section-label">
                YOUR WORK
              </span>

              <h1>
                Drafts
              </h1>

              <p>
                Continue working on stories
                that are still taking shape.
              </p>

            </div>

            <Link
              to="/create-story"
              className="create-story-btn"
            >
              <Plus size={18} />
              Create Story
            </Link>

          </header>

          {/* =================================================
              TOOLBAR
          ================================================= */}

          <section className="drafts-toolbar">

            <div className="draft-search">

              <Search size={18} />

              <input
                type="text"
                placeholder="Search your drafts..."
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value
                  )
                }
              />

            </div>

            <div className="draft-sort">

              <span>
                Sort by
              </span>

              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(
                    event.target.value
                  )
                }
                className="draft-sort-select"
              >

                <option value="recent">
                  Recently updated
                </option>

                <option value="progress-high">
                  Most chapters
                </option>

                <option value="progress-low">
                  Fewest chapters
                </option>

              </select>

            </div>

          </section>

          {/* =================================================
              DRAFT COUNT
          ================================================= */}

          <section className="drafts-section">

            <div className="drafts-heading">

              <div>

                <span className="section-label">
                  IN PROGRESS
                </span>

                <h2>
                  Your drafts
                </h2>

              </div>

              <span className="draft-count">
                {filteredDrafts.length}{" "}
                {filteredDrafts.length === 1
                  ? "draft"
                  : "drafts"}
              </span>

            </div>

            {/* =================================================
                DRAFT LIST
            ================================================= */}

            <div className="drafts-list">

              {filteredDrafts.length ===
              0 ? (

                <div className="drafts-empty">

                  <Search size={22} />

                  <h3>
                    {drafts.length === 0
                      ? "No drafts yet"
                      : "No drafts found"}
                  </h3>

                  <p>
                    {drafts.length === 0
                      ? "Create a story and save it as a draft to see it here."
                      : "Try a different search."}
                  </p>

                  {drafts.length === 0 && (
                    <Link
                      to="/create-story"
                      className="cta-button"
                    >
                      <Plus size={17} />
                      Create Story
                    </Link>
                  )}

                </div>

              ) : (

                filteredDrafts.map(
                  (draft) => {

                    const storyId =
                      getStoryId(
                        draft
                      );

                    const chapterCount =
                      getChapterCount(
                        draft
                      );

                    const views =
                      getViews(
                        draft
                      );

                    const description =
                      draft?.shortDescription ||
                      draft?.description ||
                      "No description added yet.";

                    return (
                      <article
                        className="draft-card"
                        key={storyId}
                      >

                        {/* COVER */}

                        <div className="draft-cover">

                          {draft?.coverImage ? (
                            <img
                              src={
                                draft.coverImage
                              }
                              alt={
                                draft.title
                              }
                              style={{
                                width:
                                  "100%",
                                height:
                                  "100%",
                                objectFit:
                                  "cover",
                                borderRadius:
                                  "inherit",
                              }}
                            />
                          ) : (
                            <BookOpen
                              size={22}
                            />
                          )}

                          {draft?.category && (
                            <span>
                              {
                                draft.category
                              }
                            </span>
                          )}

                        </div>

                        {/* CONTENT */}

                        <div className="draft-content">

                          <div className="draft-title-row">

                            <h3>
                              {draft?.title ||
                                "Untitled Story"}
                            </h3>

                            <span className="draft-badge">
                              Draft
                            </span>

                          </div>

                          <p className="draft-description">
                            {description}
                          </p>

                          <div className="draft-meta">

                            <span>
                              <BookOpen
                                size={14}
                              />

                              {chapterCount}{" "}
                              {chapterCount ===
                              1
                                ? "chapter"
                                : "chapters"}
                            </span>

                            <span>
                              <Eye
                                size={14}
                              />

                              {formatNumber(
                                views
                              )}
                            </span>

                            <span>
                              <Clock3
                                size={14}
                              />

                              Updated{" "}
                              {formatUpdatedDate(
                                draft?.updatedAt
                              )}
                            </span>

                          </div>

                          {/* REAL DATA ONLY:
                              Backend does not provide writing-progress percentage.
                              So we show draft status instead of fake progress. */}

                          <div className="draft-progress">

                            <div className="progress-header">

                              <span>
                                Story status
                              </span>

                              <strong>
                                Draft
                              </strong>

                            </div>

                            <div className="progress-track">
  <div
    className="progress-fill"
    style={{
      width: "100%",
    }}
  />
</div>

                          </div>

                        </div>

                        {/* ACTIONS */}

                        <div className="draft-actions">

                          <Link
                            to={`/writer/story/${storyId}/edit`}
                            className="draft-edit-btn"
                          >
                            <Edit3 size={16} />
                            Continue writing
                          </Link>

                          <div className="draft-more-wrapper">

                            <button
                              type="button"
                              className="draft-more-btn"
                              title="More options"
                              onClick={() =>
                                setOpenMenu(
                                  openMenu ===
                                    storyId
                                    ? null
                                    : storyId
                                )
                              }
                            >
                              <MoreHorizontal
                                size={18}
                              />
                            </button>

                            {openMenu ===
                              storyId && (
                              <div className="draft-more-menu">

                                <Link
                                  to={`/writer/story/${storyId}/edit`}
                                  onClick={() =>
                                    setOpenMenu(
                                      null
                                    )
                                  }
                                >
                                  <Edit3
                                    size={14}
                                  />
                                  Continue Writing
                                </Link>

                                <Link
                                  to={`/stories/${storyId}`}
                                  onClick={() =>
                                    setOpenMenu(
                                      null
                                    )
                                  }
                                >
                                  <Eye
                                    size={14}
                                  />
                                  View Story
                                </Link>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setOpenMenu(
                                      null
                                    )
                                  }
                                >
                                  Close
                                </button>

                              </div>
                            )}

                          </div>

                        </div>

                      </article>
                    );
                  }
                )
              )}

            </div>

          </section>

          {/* =================================================
              CTA
          ================================================= */}

          <section className="drafts-cta">

            <div className="drafts-cta-icon">
              <Plus size={22} />
            </div>

            <span className="section-label">
              START SOMETHING NEW
            </span>

            <h2>
              Have another idea?
            </h2>

            <p>
              Create a new story and turn
              your next idea into something
              readers can discover.
            </p>

            <Link
              to="/create-story"
              className="cta-button"
            >
              <Plus size={17} />
              Start a New Story
            </Link>

          </section>

        </div>

      </main>

    </div>
  );
}

export default Drafts;