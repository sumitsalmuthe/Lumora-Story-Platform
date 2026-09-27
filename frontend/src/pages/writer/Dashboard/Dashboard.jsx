import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Eye,
  Heart,
  MessageCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  Edit3,
  MoreHorizontal,
  Settings as SettingsIcon,
} from "lucide-react";

import "./Dashboard.css";

import lumoraLogo from "../../../assets/logo/lumora-logo-bold.svg";

import storyService from "../../../services/stories/storyService";
import useAuth from "../../../context/AuthContext/useAuth";

function Dashboard() {
  const { user } = useAuth();

  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStories = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await storyService.getMyStories();

        const data =
          response?.data || response;

        const loadedStories =
          data?.stories ||
          data ||
          [];

        setStories(
          Array.isArray(loadedStories)
            ? loadedStories
            : []
        );
      } catch (err) {
        console.error(
          "Failed to load writer stories:",
          err
        );

        setError(
          err?.response?.data?.message ||
            "Unable to load your stories."
        );
      } finally {
        setLoading(false);
      }
    };

    loadStories();
  }, []);

  const stats = useMemo(() => {
    return stories.reduce(
      (total, story) => {
        total.views += Number(story.views || 0);
       total.likes += Array.isArray(story.likes)
  ? story.likes.length
  : Number(story.likes || 0);

total.comments += Array.isArray(story.comments)
  ? story.comments.length
  : Number(story.comments || 0);

        return total;
      },
      {
        views: 0,
        likes: 0,
        comments: 0,
      }
    );
  }, [stories]);

  const recentStories = useMemo(() => {
    return [...stories]
      .sort(
        (a, b) =>
          new Date(
            b.updatedAt || b.createdAt || 0
          ) -
          new Date(
            a.updatedAt || a.createdAt || 0
          )
      )
      .slice(0, 5);
  }, [stories]);

  const formatNumber = (value) => {
    const number = Number(value || 0);

    if (number >= 1000000) {
      return `${(number / 1000000).toFixed(1)}M`;
    }

    if (number >= 1000) {
      return `${(number / 1000).toFixed(1)}K`;
    }

    return number.toLocaleString();
  };

  const formatDate = (date) => {
    if (!date) {
      return "Recently";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Recently";
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

  const getDisplayName = () => {
    return (
      user?.displayName ||
      user?.writerProfile?.penName ||
      user?.username ||
      "Writer"
    );
  };

  const getStoryId = (story) => {
    return story?._id || story?.id;
  };

  const getStoryStatus = (story) => {
    return (
      story?.status ||
      "Draft"
    );
  };

  return (
    <div className="writer-dashboard">
      {/* Sidebar */}
      <aside className="writer-sidebar">
        <Link
          to="/"
          className="writer-logo"
        >
          <img
            src={lumoraLogo}
            alt="Lumora"
            className="writer-logo-image"
          />
        </Link>

        <nav className="writer-nav">
          <Link
            to="/writer/dashboard"
            className="writer-nav__item active"
          >
            <BookOpen size={18} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/my-stories"
            className="writer-nav__item"
          >
            <BookOpen size={18} />
            <span>My Stories</span>
          </Link>

          <Link
            to="/create-story"
            className="writer-nav__item"
          >
            <Plus size={18} />
            <span>Create Story</span>
          </Link>

          <Link
            to="/drafts"
            className="writer-nav__item"
          >
            <Edit3 size={18} />
            <span>Drafts</span>
          </Link>

          <Link
            to="/analytics"
            className="writer-nav__item"
          >
            <TrendingUp size={18} />
            <span>Analytics</span>
          </Link>
        </nav>

        <div className="writer-sidebar__bottom">
          <Link
            to="/settings"
            className="writer-nav__item"
          >
            <SettingsIcon size={18} />
            <span>Settings</span>
          </Link>

          <div className="writer-user">
            <div className="writer-user__avatar">
              {getDisplayName()
                .slice(0, 2)
                .toUpperCase()}
            </div>

            <div className="writer-user__info">
              <strong>
                {getDisplayName()}
              </strong>

              <span>Writer</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="writer-main">
        {/* Top bar */}
        <header className="writer-topbar">
          <div>
            <span className="writer-eyebrow">
              WRITER DASHBOARD
            </span>

            <h1>
              Welcome back,{" "}
              {getDisplayName()}.
            </h1>

            <p>
              Here's what's happening with
              your stories today.
            </p>
          </div>

          <Link
            to="/create-story"
            className="writer-primary-btn"
          >
            <Plus size={17} />
            Create Story
          </Link>
        </header>

        {/* Stats */}
        <section className="writer-stats">
          <div className="writer-stat-card">
            <div className="writer-stat-icon">
              <BookOpen size={18} />
            </div>

            <div>
              <span>Total Stories</span>

              <strong>
                {loading
                  ? "—"
                  : stories.length}
              </strong>
            </div>
          </div>

          <div className="writer-stat-card">
            <div className="writer-stat-icon">
              <Eye size={18} />
            </div>

            <div>
              <span>Total Views</span>

              <strong>
                {loading
                  ? "—"
                  : formatNumber(
                      stats.views
                    )}
              </strong>
            </div>
          </div>

          <div className="writer-stat-card">
            <div className="writer-stat-icon">
              <Heart size={18} />
            </div>

            <div>
              <span>Total Likes</span>

              <strong>
                {loading
                  ? "—"
                  : formatNumber(
                      stats.likes
                    )}
              </strong>
            </div>
          </div>

          <div className="writer-stat-card">
            <div className="writer-stat-icon">
              <MessageCircle size={18} />
            </div>

            <div>
              <span>Comments</span>

              <strong>
                {loading
                  ? "—"
                  : formatNumber(
                      stats.comments
                    )}
              </strong>
            </div>
          </div>
        </section>

        {/* Content grid */}
        <section className="writer-content-grid">
          {/* Stories */}
          <div className="writer-panel writer-panel--stories">
            <div className="writer-panel__header">
              <div>
                <span className="writer-eyebrow">
                  YOUR WORK
                </span>

                <h2>Recent stories</h2>
              </div>

              <Link
  to="/writer/my-stories"
  className="writer-view-link"
>
                View all
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="writer-story-list">
              {loading ? (
                <div className="writer-empty-state">
                  Loading your stories...
                </div>
              ) : error ? (
                <div className="writer-empty-state">
                  {error}
                </div>
              ) : recentStories.length ===
                0 ? (
                <div className="writer-empty-state">
                  <BookOpen size={28} />

                  <h3>
                    No stories yet
                  </h3>

                  <p>
                    Start writing your first
                    story and share it with
                    Lumora readers.
                  </p>

                  <Link
                    to="/create-story"
                    className="writer-primary-btn"
                  >
                    <Plus size={17} />
                    Create Story
                  </Link>
                </div>
              ) : (
                recentStories.map(
                  (story) => {
                    const storyId =
                      getStoryId(story);

                    const status =
                      getStoryStatus(
                        story
                      );

                    return (
                      <div
                        className="writer-story-row"
                        key={storyId}
                      >
                        <div className="writer-story-cover">
                          {story.coverImage ? (
                            <img
                              src={
                                story.coverImage
                              }
                              alt={
                                story.title
                              }
                            />
                          ) : (
                            <BookOpen
                              size={20}
                            />
                          )}

                          <span>
                            {story.category ||
                              "Story"}
                          </span>
                        </div>

                        <div className="writer-story-info">
                          <div className="writer-story-title">
                            <h3>
                              {story.title ||
                                "Untitled Story"}
                            </h3>

                            <span
                              className={`writer-status writer-status--${String(
                                status
                              ).toLowerCase()}`}
                            >
                              {status}
                            </span>
                          </div>

                          <div className="writer-story-meta">
                            <span>
                              <Eye
                                size={13}
                              />
                              {formatNumber(
                                story.views
                              )}
                            </span>

                            <span>
                              <Heart
                                size={13}
                              />
                              {formatNumber(
                                story.likes
                              )}
                            </span>

                            <span>
                              <MessageCircle
                                size={13}
                              />
                              {formatNumber(
                                story.comments
                              )}
                            </span>
                          </div>

                          <small>
                            Updated{" "}
                            {formatDate(
                              story.updatedAt ||
                                story.createdAt
                            )}
                          </small>
                        </div>

                        <Link
                          to={
                            storyId
                              ? `/writer/story/${storyId}/edit`
                              : "/my-stories"
                          }
                          className="writer-story-arrow"
                          aria-label={`Open ${
                            story.title ||
                            "story"
                          }`}
                        >
                          <ArrowRight
                            size={17}
                          />
                        </Link>
                      </div>
                    );
                  }
                )
              )}
            </div>
          </div>

          {/* Activity */}
          <div className="writer-panel writer-panel--activity">
            <div className="writer-panel__header">
              <div>
                <span className="writer-eyebrow">
                  RECENT
                </span>

                <h2>Activity</h2>
              </div>

              <MoreHorizontal
                size={20}
                className="activity-more"
              />
            </div>

            <div className="writer-activity-list">
              {loading ? (
                <div className="writer-empty-state">
                  Loading activity...
                </div>
              ) : stories.length === 0 ? (
                <div className="writer-empty-state">
                  No activity yet.
                </div>
              ) : (
                recentStories
                  .slice(0, 3)
                  .map(
                    (story, index) => (
                      <div
                        className="writer-activity-item"
                        key={
                          getStoryId(
                            story
                          ) ||
                          index
                        }
                      >
                        <div className="writer-activity-dot" />

                        <div>
                          <strong>
                            {story.title ||
                              "Untitled Story"}
                          </strong>

                          <p>
                            {story.status ===
                            "Published"
                              ? "Story is published."
                              : "Story is currently in draft."}
                          </p>

                          <span>
                            Updated{" "}
                            {formatDate(
                              story.updatedAt ||
                                story.createdAt
                            )}
                          </span>
                        </div>
                      </div>
                    )
                  )
              )}
            </div>
          </div>
        </section>

        {/* Performance */}
        <section className="writer-performance">
          <div className="writer-performance__header">
            <div>
              <span className="writer-eyebrow">
                PERFORMANCE
              </span>

              <h2>Story performance</h2>

              <p>
                Your current story views
                across Lumora.
              </p>
            </div>

            <span className="writer-growth">
              <TrendingUp size={15} />

              {formatNumber(stats.views)}
            </span>
          </div>

          <div className="writer-chart">
            <div className="writer-chart__labels">
              <span>100K</span>
              <span>75K</span>
              <span>50K</span>
              <span>25K</span>
              <span>0</span>
            </div>

            <div className="writer-chart__area">
              <div className="writer-chart__line writer-chart__line--1" />
              <div className="writer-chart__line writer-chart__line--2" />
              <div className="writer-chart__line writer-chart__line--3" />
              <div className="writer-chart__line writer-chart__line--4" />

              <div className="writer-chart-empty">
                {loading
                  ? "Loading performance..."
                  : stats.views > 0
                  ? `${formatNumber(
                      stats.views
                    )} total views`
                  : "No reading data yet"}
              </div>

              <div className="writer-chart__months">
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="writer-dashboard-cta">
          <div className="writer-dashboard-cta__icon">
            <Edit3 size={22} />
          </div>

          <span className="writer-eyebrow">
            KEEP CREATING
          </span>

          <h2>
            Have another story in you?
          </h2>

          <p>
            Start writing something new and
            share your next world with
            Lumora readers.
          </p>

          <Link
            to="/create-story"
            className="writer-primary-btn"
          >
            <Plus size={17} />
            Start Writing
          </Link>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;