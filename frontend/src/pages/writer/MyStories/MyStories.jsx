import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  BookOpen,
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Heart,
  MessageCircle,
  Edit3,
  BarChart3,
  ChevronRight,
} from "lucide-react";

import "./MyStories.css";

import lumoraLogo from "../../../assets/logo/lumora-logo-bold.svg";
import storyService from "../../../services/stories/storyService";
import useAuth from "../../../context/AuthContext/useAuth";

function StoryIcon({ category }) {
  return (
    <div className="my-story-icon">
      <BookOpen size={20} strokeWidth={2} />
      <span>{category || "Story"}</span>
    </div>
  );
}

function MyStories() {
  const { user } = useAuth();

  const [stories, setStories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [openMenu, setOpenMenu] = useState(null);

  /*
  =========================================================
  LOAD MY STORIES
  =========================================================
  */

  useEffect(() => {
    const loadStories = async () => {
      try {
        const response = await storyService.getMyStories();

        const loadedStories = Array.isArray(response?.stories)
          ? response.stories
          : Array.isArray(response?.data?.stories)
          ? response.data.stories
          : [];

        setStories(
          loadedStories.map((story) => ({
            ...story,
            id: story._id,
            description:
              story.shortDescription ||
              story.description ||
              "",
            likes: Array.isArray(story.likes)
              ? story.likes.length
              : Number(story.likes || 0),
            comments: Array.isArray(story.comments)
              ? story.comments.length
              : Number(story.comments || 0),
            chapters: Number(story.chapterCount || 0),
            views: Number(story.views || 0),
            updated: story.updatedAt
              ? new Date(
                  story.updatedAt
                ).toLocaleDateString("en-IN")
              : "Recently",
          }))
        );
      } catch (error) {
        console.error(
          "Failed to load writer stories:",
          error
        );

        setStories([]);
      }
    };

    loadStories();
  }, []);

  /*
  =========================================================
  FILTER STORIES
  =========================================================
  */

  const filteredStories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return stories.filter((story) => {
      const title =
        story?.title?.toLowerCase() || "";

      const category =
        story?.category?.toLowerCase() || "";

      const description =
        story?.description?.toLowerCase() || "";

      const status =
        story?.status?.toLowerCase() || "";

      const matchesSearch =
        !query ||
        title.includes(query) ||
        category.includes(query) ||
        description.includes(query);

      const matchesFilter =
        activeFilter === "All" ||
        status === activeFilter.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [stories, searchQuery, activeFilter]);

  /*
  =========================================================
  WRITER INFO
  =========================================================
  */

  const writerName =
    user?.displayName ||
    user?.writerProfile?.penName ||
    user?.username ||
    "Writer";

  const writerInitials = writerName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  /*
  =========================================================
  COUNTS
  =========================================================
  */

  const publishedCount = stories.filter(
    (story) =>
      String(story.status).toLowerCase() ===
      "published"
  ).length;

  const draftCount = stories.filter(
    (story) =>
      String(story.status).toLowerCase() ===
      "draft"
  ).length;

  /*
  =========================================================
  RENDER
  =========================================================
  */

  return (
    <div className="writer-layout">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

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

          <Link to="/writer/dashboard" className="writer-nav-item">

            <BookOpen size={18} />
            <span>Dashboard</span>
          </Link>

          <Link
  to="/writer/my-stories"
  className="writer-nav-item active"
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
            className="writer-nav-item"
          >
            <Edit3 size={18} />
            <span>Drafts</span>
          </Link>

          <Link
            to="/analytics"
            className="writer-nav-item"
          >
            <BarChart3 size={18} />
            <span>Analytics</span>
          </Link>

        </nav>

        {/* =====================================================
            SIDEBAR BOTTOM
        ===================================================== */}

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
              {writerInitials}
            </div>

            <div>
              <strong>{writerName}</strong>
              <span>Writer</span>
            </div>

          </div>

        </div>

      </aside>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="my-stories-main">

        <div className="my-stories-container">

          {/* =====================================================
              HEADER
          ===================================================== */}

          <header className="my-stories-header">

            <div>

              <span className="section-label">
                YOUR WORK
              </span>

              <h1>My Stories</h1>

              <p>
                Manage your stories, chapters, drafts
                and published work.
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

          {/* =====================================================
              TOOLBAR
          ===================================================== */}

          <section className="stories-toolbar">

            <div className="story-search">

              <Search size={18} />

              <input
                type="text"
                placeholder="Search your stories..."
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value
                  )
                }
              />

            </div>

            <div className="story-filters">

              <button
                type="button"
                className={`filter-btn ${
                  activeFilter === "All"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveFilter("All")
                }
              >
                All
                <span>{stories.length}</span>
              </button>

              <button
                type="button"
                className={`filter-btn ${
                  activeFilter === "Published"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveFilter("Published")
                }
              >
                Published
                <span>{publishedCount}</span>
              </button>

              <button
                type="button"
                className={`filter-btn ${
                  activeFilter === "Draft"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveFilter("Draft")
                }
              >
                Drafts
                <span>{draftCount}</span>
              </button>

            </div>

          </section>

          {/* =====================================================
              STORIES
          ===================================================== */}

          <section className="stories-section">

            <div className="stories-section-heading">

              <div>

                <span className="section-label">
                  STORIES
                </span>

                <h2>All your stories</h2>

              </div>

              <span className="story-count">
                {filteredStories.length}{" "}
                {filteredStories.length === 1
                  ? "story"
                  : "stories"}
              </span>

            </div>

            <div className="stories-list">

              {filteredStories.length === 0 ? (

                <div className="stories-empty">

                  <Search size={22} />

                  <h3>No stories found</h3>

                  <p>
                    Try a different search or select
                    another filter.
                  </p>

                </div>

              ) : (

                filteredStories.map((story) => (

                  <article
                    className="story-row"
                    key={story.id}
                  >

                    {/* STORY ICON */}

                    <StoryIcon
                      category={story.category}
                    />

                    {/* STORY CONTENT */}

                    <div className="story-row-content">

                      <div className="story-title-line">

                        <h3>
                          {story.title ||
                            "Untitled Story"}
                        </h3>

                        <span
                          className={`story-status ${String(
                            story.status || "Draft"
                          ).toLowerCase()}`}
                        >
                          {story.status ||
                            "Draft"}
                        </span>

                      </div>

                      <p className="story-description">
                        {story.description ||
                          "No description available."}
                      </p>

                      <div className="story-meta">

                        <span>
                          <BookOpen size={14} />
                          {story.chapters} chapters
                        </span>

                        <span>
                          <Eye size={14} />
                          {story.views}
                        </span>

                        <span>
                          <Heart size={14} />
                          {story.likes}
                        </span>

                        <span>
                          <MessageCircle size={14} />
                          {story.comments}
                        </span>

                        <span className="story-updated">
                          Updated {story.updated}
                        </span>

                      </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="story-actions">

                      <Link
                        to={`/stories/${story.id}`}
                        className="story-action"
                        title="View story"
                      >
                        <Eye size={17} />
                      </Link>

                      <Link
                        to={`/writer/story/${story.id}/edit`}
                        className="story-action"
                        title="Edit story"
                      >
                        <Edit3 size={17} />
                      </Link>

                      <div className="story-more-wrapper">

                        <button
                          className="story-action"
                          type="button"
                          title="More options"
                          onClick={() =>
                            setOpenMenu(
                              openMenu === story.id
                                ? null
                                : story.id
                            )
                          }
                        >
                          <MoreHorizontal size={18} />
                        </button>

                        {openMenu === story.id && (
                          <div className="story-more-menu">

                            <Link
                              to={`/stories/${story.id}`}
                              onClick={() =>
                                setOpenMenu(null)
                              }
                            >
                              View Story
                            </Link>

                            <Link
                              to={`/writer/story/${story.id}/edit`}
                              onClick={() =>
                                setOpenMenu(null)
                              }
                            >
                              Edit Story
                            </Link>

                            <button
                              type="button"
                              onClick={() =>
                                setOpenMenu(null)
                              }
                            >
                              Close
                            </button>

                          </div>
                        )}

                      </div>

                    </div>

                    <ChevronRight
                      className="story-mobile-arrow"
                      size={19}
                    />

                  </article>

                ))

              )}

            </div>

          </section>

          {/* =====================================================
              BOTTOM CTA
          ===================================================== */}

          <section className="my-stories-cta">

            <div className="cta-icon">
              <Edit3 size={22} />
            </div>

            <span className="section-label">
              KEEP CREATING
            </span>

            <h2>
              Have another story in you?
            </h2>

            <p>
              Start writing something new and share
              your next world with Lumora readers.
            </p>

            <Link
              to="/create-story"
              className="cta-button"
            >
              <Plus size={17} />
              Start Writing
            </Link>

          </section>

        </div>

      </main>

    </div>
  );
}

export default MyStories;