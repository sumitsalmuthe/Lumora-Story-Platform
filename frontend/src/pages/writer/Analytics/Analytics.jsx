import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import {
  BarChart3,
  BookOpen,
  Eye,
  Heart,
  MessageCircle,
  TrendingUp,
  ArrowUpRight,
  ChevronDown,
  Settings,
  Plus,
  PenLine,
  Check,
  Users,
  Star,
} from "lucide-react";

import lumoraLogo from "../../../assets/logo/lumora-logo-bold.svg";

import analyticsService from "../../../services/analytics/analyticsService";
import apiClient from "../../../services/api/apiClient";

import "./Analytics.css";

function Analytics() {
  // =====================================================
  // STATE
  // =====================================================

  const [dashboard, setDashboard] = useState(null);
  const [stories, setStories] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [showTimeRange, setShowTimeRange] = useState(false);
  const [timeRange, setTimeRange] = useState(
    "Current"
  );

  const dropdownRef = useRef(null);

  // =====================================================
  // TIME RANGE
  // =====================================================

  const timeRanges = ["Current"];

  // =====================================================
  // LOAD ANALYTICS
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    const loadAnalytics = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [
          dashboardResponse,
          storiesResponse,
          reviewsResponse,
        ] = await Promise.all([
          analyticsService.getDashboardSummary(),
          apiClient.get("/stories/my"),
          analyticsService.getReviewsAnalytics(),
        ]);

        if (cancelled) {
          return;
        }

        console.log(
          "ANALYTICS DASHBOARD:",
          dashboardResponse
        );

        console.log(
          "ANALYTICS STORIES:",
          storiesResponse.data
        );

        console.log(
          "ANALYTICS REVIEWS:",
          reviewsResponse
        );

        // -------------------------------------------------
        // DASHBOARD
        // -------------------------------------------------

        const dashboardData =
          dashboardResponse?.dashboard ||
          dashboardResponse?.data?.dashboard ||
          dashboardResponse?.data ||
          {};

        setDashboard(dashboardData);

        // -------------------------------------------------
        // STORIES
        // -------------------------------------------------

        const storyData =
          storiesResponse?.data?.stories ||
          storiesResponse?.data?.data?.stories ||
          storiesResponse?.data?.data ||
          [];

        setStories(
          Array.isArray(storyData)
            ? storyData
            : []
        );

        // -------------------------------------------------
        // REVIEWS
        // -------------------------------------------------

        const reviewData =
          reviewsResponse?.analytics ||
          reviewsResponse?.data?.analytics ||
          reviewsResponse?.data ||
          {};

        setReviews(
          Array.isArray(reviewData?.reviews)
            ? reviewData.reviews
            : []
        );
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          "Analytics loading error:",
          err
        );

        setError(
          err?.response?.data?.message ||
            "Unable to load analytics."
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadAnalytics();

    return () => {
      cancelled = true;
    };
  }, []);

  // =====================================================
  // CLOSE DROPDOWN OUTSIDE CLICK
  // =====================================================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target
        )
      ) {
        setShowTimeRange(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  // =====================================================
  // CLOSE DROPDOWN ESCAPE
  // =====================================================

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowTimeRange(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  // =====================================================
  // HELPERS
  // =====================================================

  const formatNumber = (value) => {
    const number = Number(value || 0);

    return number.toLocaleString("en-IN");
  };

  const getStoryId = (story) => {
    return story?._id || story?.id;
  };

  const getStoryLikes = (story) => {
    if (Array.isArray(story?.likes)) {
      return story.likes.length;
    }

    return Number(story?.likes || 0);
  };

  const getStoryComments = (story) => {
    if (
      Array.isArray(story?.comments)
    ) {
      return story.comments.length;
    }

    return Number(
      story?.commentsCount ||
        story?.commentCount ||
        story?.comments ||
        0
    );
  };

  // =====================================================
  // SORT STORIES
  // =====================================================

  const sortedStories = [...stories].sort(
    (a, b) =>
      Number(b?.views || 0) -
      Number(a?.views || 0)
  );

  // =====================================================
  // REAL VALUES
  // =====================================================

  const totalViews =
    Number(dashboard?.totalViews || 0);

  const totalFollowers =
    Number(
      dashboard?.totalFollowers || 0
    );

  const totalReviews =
    Number(
      dashboard?.totalReviews || 0
    );

  const totalReaders =
    Number(
      dashboard?.totalReaders || 0
    );

  const totalStories =
    Number(
      dashboard?.totalStories ??
        stories.length
    );

  const publishedStories =
    Number(
      dashboard?.publishedStories || 0
    );

  const draftStories =
    Number(
      dashboard?.draftStories || 0
    );

  const averageRating =
    Number(
      dashboard?.averageRating || 0
    );

  // =====================================================
  // TOTAL LIKES
  // =====================================================

  const totalLikes = stories.reduce(
    (total, story) =>
      total + getStoryLikes(story),
    0
  );

  // =====================================================
  // TOTAL COMMENTS
  // =====================================================

  const totalComments = stories.reduce(
    (total, story) =>
      total + getStoryComments(story),
    0
  );

  // =====================================================
  // STATS
  // =====================================================

  const stats = [
    {
      label: "Total Views",
      value: formatNumber(totalViews),
      change: "All published stories",
      icon: Eye,
    },
    {
      label: "Total Likes",
      value: formatNumber(totalLikes),
      change: "Across your stories",
      icon: Heart,
    },
    {
      label: "Comments",
      value: formatNumber(totalComments),
      change: "Reader engagement",
      icon: MessageCircle,
    },
    {
      label: "Stories",
      value: formatNumber(totalStories),
      change: `${publishedStories} published`,
      icon: BookOpen,
    },
  ];

  // =====================================================
  // CHART
  // =====================================================

  const chartValues = [
    Math.max(totalViews, 0),
  ];

  const chartMonths = ["Current"];

  const getChartPath = () => {
    const values = chartValues;

    if (!values.length) {
      return "M 0 140 L 900 140";
    }

    if (values.length === 1) {
  return `M 0 225 L 900 225`;
}

    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;

    const points = values.map(
      (value, index) => {
        const x =
          (index /
            (values.length - 1)) *
          900;

        const y =
          225 -
          ((value - min) /
            range) *
            165;

        return { x, y };
      }
    );

    let path = `M ${points[0].x} ${points[0].y}`;

    for (
      let i = 1;
      i < points.length;
      i += 1
    ) {
      const previous =
        points[i - 1];

      const current =
        points[i];

      const controlX =
        (previous.x +
          current.x) /
        2;

      path += `
        C ${controlX} ${previous.y},
          ${controlX} ${current.y},
          ${current.x} ${current.y}
      `;
    }

    return path;
  };

  const chartPath =
    getChartPath();

  const chartFillPath = `
    ${chartPath}
    L 900 280
    L 0 280
    Z
  `;

  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {
    return (
      <div className="analytics-page">
        <main className="analytics-main">
          <div
            style={{
              padding: "80px 20px",
              textAlign: "center",
              color: "#777",
            }}
          >
            Loading analytics...
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
      <div className="analytics-page">
        <main className="analytics-main">
          <div
            style={{
              padding: "40px",
              border: "1px solid #ffd5ca",
              borderRadius: "11px",
              background: "#fff6f3",
              color: "#d94f2b",
            }}
          >
            <strong>
              Unable to load analytics
            </strong>

            <p>{error}</p>

            <button
              type="button"
              className="create-button"
              onClick={() =>
                window.location.reload()
              }
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="analytics-page">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="writer-sidebar">

        <Link
          to="/writer/dashboard"
          className="writer-brand"
        >
          <img
            src={lumoraLogo}
            alt="Lumora"
            className="writer-brand-logo"
          />
        </Link>

        <nav className="writer-nav">

          <Link to="/writer/dashboard">
            <BarChart3 size={18} />
            <span>Dashboard</span>
          </Link>

          <Link to="/writer/my-stories">
            <BookOpen size={18} />
            <span>My Stories</span>
          </Link>

          <Link to="/create-story">
            <Plus size={18} />
            <span>Create Story</span>
          </Link>

          <Link to="/drafts">
            <PenLine size={18} />
            <span>Drafts</span>
          </Link>

          <Link
            to="/analytics"
            className="active"
          >
            <TrendingUp size={18} />
            <span>Analytics</span>
          </Link>

        </nav>

        <div className="sidebar-bottom">

          <Link to="/settings">
            <Settings size={18} />
            <span>Settings</span>
          </Link>

          <div className="writer-user">

            <div className="writer-avatar">
              W
            </div>

            <div>
              <strong>Writer</strong>
              <span>Lumora Writer</span>
            </div>

          </div>

        </div>

      </aside>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="analytics-main">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="analytics-header">

          <div>

            <span className="eyebrow">
              WRITER ANALYTICS
            </span>

            <h1>
              See how your stories are doing.
            </h1>

            <p>
              Track your readers, understand
              your audience, and see how your
              stories are performing.
            </p>

          </div>

          <div className="analytics-actions">

            {/* TIME RANGE */}

            <div
              className="analytics-period-wrapper"
              ref={dropdownRef}
            >

              <button
                type="button"
                className={`analytics-period ${
                  showTimeRange
                    ? "open"
                    : ""
                }`}
                onClick={() =>
                  setShowTimeRange(
                    (previous) =>
                      !previous
                  )
                }
                aria-expanded={
                  showTimeRange
                }
                aria-haspopup="listbox"
              >

                <span>
                  {timeRange}
                </span>

                <ChevronDown
                  size={15}
                  className={
                    showTimeRange
                      ? "rotate-chevron"
                      : ""
                  }
                />

              </button>

              {showTimeRange && (
                <div
                  className="analytics-period-menu"
                  role="listbox"
                >

                  {timeRanges.map(
                    (range) => (
                      <button
                        type="button"
                        key={range}
                        role="option"
                        aria-selected={
                          timeRange ===
                          range
                        }
                        className={`analytics-period-option ${
                          timeRange ===
                          range
                            ? "active"
                            : ""
                        }`}
                        onClick={() => {
                          setTimeRange(
                            range
                          );
                          setShowTimeRange(
                            false
                          );
                        }}
                      >

                        <span>
                          {range}
                        </span>

                        {timeRange ===
                          range && (
                          <Check
                            size={14}
                          />
                        )}

                      </button>
                    )
                  )}

                </div>
              )}

            </div>

            <Link
              to="/create-story"
              className="create-button"
            >
              <Plus size={17} />
              Create Story
            </Link>

          </div>

        </header>

        {/* =================================================
            STATS
        ================================================= */}

        <section className="analytics-stats">

          {stats.map((stat) => {
            const Icon =
              stat.icon;

            return (
              <div
                className="analytics-stat-card"
                key={stat.label}
              >

                <div className="stat-icon">
                  <Icon size={19} />
                </div>

                <div className="stat-content">

                  <span>
                    {stat.label}
                  </span>

                  <strong>
                    {stat.value}
                  </strong>

                  <small>
                    {stat.change}
                  </small>

                </div>

              </div>
            );
          })}

        </section>

        {/* =================================================
            EXTRA REAL SUMMARY
        ================================================= */}

        <section className="analytics-stats">

          <div className="analytics-stat-card">

            <div className="stat-icon">
              <Users size={19} />
            </div>

            <div className="stat-content">

              <span>
                Followers
              </span>

              <strong>
                {formatNumber(
                  totalFollowers
                )}
              </strong>

              <small>
                Current followers
              </small>

            </div>

          </div>

          <div className="analytics-stat-card">

            <div className="stat-icon">
              <Eye size={19} />
            </div>

            <div className="stat-content">

              <span>
                Readers
              </span>

              <strong>
                {formatNumber(
                  totalReaders
                )}
              </strong>

              <small>
                Unique readers
              </small>

            </div>

          </div>

          <div className="analytics-stat-card">

            <div className="stat-icon">
              <Star size={19} />
            </div>

            <div className="stat-content">

              <span>
                Average Rating
              </span>

              <strong>
                {averageRating.toFixed(
                  1
                )}
              </strong>

              <small>
                From {formatNumber(
                  totalReviews
                )} reviews
              </small>

            </div>

          </div>

          <div className="analytics-stat-card">

            <div className="stat-icon">
              <PenLine size={19} />
            </div>

            <div className="stat-content">

              <span>
                Draft Stories
              </span>

              <strong>
                {formatNumber(
                  draftStories
                )}
              </strong>

              <small>
                Currently in draft
              </small>

            </div>

          </div>

        </section>

        {/* =================================================
            CHART
        ================================================= */}

        <section className="analytics-chart-card">

          <div className="card-heading">

            <div>

              <span className="section-label">
                PERFORMANCE
              </span>

              <h2>
                Story views
              </h2>

              <p>
                Total views across your
                published stories.
              </p>

            </div>

            <div className="chart-total">

              <strong>
                {formatNumber(
                  totalViews
                )}
              </strong>

              <span>
                Current total
              </span>

            </div>

          </div>

          <div className="chart-area">

            <div className="chart-y-labels">
              <span>100K</span>
              <span>75K</span>
              <span>50K</span>
              <span>25K</span>
              <span>0</span>
            </div>

            <div className="chart">

              <div className="chart-grid">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>

              <svg
                className="analytics-line"
                viewBox="0 0 900 280"
                preserveAspectRatio="none"
              >

                <defs>

                  <linearGradient
                    id="analyticsFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      stopOpacity="0.18"
                    />

                    <stop
                      offset="100%"
                      stopOpacity="0"
                    />

                  </linearGradient>

                </defs>

                <path
                  className="chart-fill"
                  d={chartFillPath}
                />

                <path
                  className="chart-line"
                  d={chartPath}
                />

              </svg>

              <div className="chart-months">

                {chartMonths.map(
                  (month) => (
                    <span key={month}>
                      {month}
                    </span>
                  )
                )}

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            LOWER GRID
        ================================================= */}

        <section className="analytics-grid">

          {/* =================================================
              TOP STORIES
          ================================================= */}

          <div className="analytics-panel">

            <div className="panel-heading">

              <div>

                <span className="section-label">
                  YOUR STORIES
                </span>

                <h2>
                  Story performance
                </h2>

              </div>

              <Link to="/writer/my-stories">
                View all
                <ArrowUpRight size={15} />
              </Link>

            </div>

            <div className="top-stories">

              {sortedStories.length ===
              0 ? (
                <div
                  style={{
                    padding:
                      "30px 0",
                    color: "#999",
                    fontSize:
                      "12px",
                  }}
                >
                  No stories found.
                </div>
              ) : (
                sortedStories
                  .slice(0, 5)
                  .map(
                    (
                      story,
                      index
                    ) => {

                      const storyId =
                        getStoryId(
                          story
                        );

                      const likes =
                        getStoryLikes(
                          story
                        );

                      const comments =
                        getStoryComments(
                          story
                        );

                      return (
                        <div
                          className="top-story"
                          key={
                            storyId ||
                            story.title
                          }
                        >

                          <div className="story-rank">
                            #{index + 1}
                          </div>

                          <div className="story-mini-cover">

                            {story?.coverImage ? (
                              <img
                                src={
                                  story.coverImage
                                }
                                alt={
                                  story.title
                                }
                                style={{
                                  width:
                                    "100%",
                                  height:
                                    "100%",
                                  objectFit:
                                    "cover",
                                  borderRadius:
                                    "7px",
                                }}
                              />
                            ) : (
                              <BookOpen
                                size={19}
                              />
                            )}

                          </div>

                          <div className="story-info">

                            <div className="story-title-row">

                              <h3>
                                {story?.title ||
                                  "Untitled Story"}
                              </h3>

                              {story?.category && (
                                <span>
                                  {
                                    story.category
                                  }
                                </span>
                              )}

                            </div>

                            <div className="story-metrics">

                              <span>
                                <Eye size={13} />
                                {formatNumber(
                                  story?.views ||
                                    0
                                )}
                              </span>

                              <span>
                                <Heart size={13} />
                                {formatNumber(
                                  likes
                                )}
                              </span>

                              <span>
                                <MessageCircle
                                  size={13}
                                />
                                {formatNumber(
                                  comments
                                )}
                              </span>

                            </div>

                          </div>

                        </div>
                      );
                    }
                  )
              )}

            </div>

          </div>

          {/* =================================================
              ENGAGEMENT
          ================================================= */}

          <div className="analytics-panel engagement-panel">

            <div className="panel-heading">

              <div>

                <span className="section-label">
                  ENGAGEMENT
                </span>

                <h2>
                  Reader activity
                </h2>

              </div>

            </div>

            <div className="engagement-items">

              <div className="engagement-item">

                <div className="engagement-icon">
                  <Eye size={18} />
                </div>

                <div>
                  <strong>
                    {formatNumber(
                      totalViews
                    )}
                  </strong>

                  <span>
                    Total views
                  </span>
                </div>

                <b>
                  Current
                </b>

              </div>

              <div className="engagement-item">

                <div className="engagement-icon">
                  <Heart size={18} />
                </div>

                <div>
                  <strong>
                    {formatNumber(
                      totalLikes
                    )}
                  </strong>

                  <span>
                    Total likes
                  </span>
                </div>

                <b>
                  Current
                </b>

              </div>

              <div className="engagement-item">

                <div className="engagement-icon">
                  <MessageCircle size={18} />
                </div>

                <div>
                  <strong>
                    {formatNumber(
                      totalComments
                    )}
                  </strong>

                  <span>
                    Comments
                  </span>
                </div>

                <b>
                  Current
                </b>

              </div>

              <div className="engagement-item">

                <div className="engagement-icon">
                  <BookOpen size={18} />
                </div>

                <div>
                  <strong>
                    {formatNumber(
                      totalReaders
                    )}
                  </strong>

                  <span>
                    Unique readers
                  </span>
                </div>

                <b>
                  Current
                </b>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            AUDIENCE
        ================================================= */}

        <section className="audience-card">

          <div>

            <span className="section-label">
              AUDIENCE
            </span>

            <h2>
              Your readers are here.
            </h2>

            <p>
              These numbers represent the
              current audience and activity
              recorded by Lumora.
            </p>

          </div>

          <div className="audience-number">

            <strong>
              {formatNumber(
                totalFollowers
              )}
            </strong>

            <span>
              Followers
            </span>

            <b>
              <Users size={14} />
              Current total
            </b>

          </div>

        </section>

        {/* =================================================
            REVIEWS
        ================================================= */}

        <section
          className="analytics-panel"
          style={{
            marginBottom: "28px",
          }}
        >

          <div className="panel-heading">

            <div>

              <span className="section-label">
                REVIEWS
              </span>

              <h2>
                Reader feedback
              </h2>

            </div>

            <div
              style={{
                display:
                  "flex",
                alignItems:
                  "center",
                gap: "6px",
                color:
                  "#ff6339",
                fontSize:
                  "12px",
                fontWeight:
                  "700",
              }}
            >
              <Star size={14} />

              {averageRating.toFixed(
                1
              )}
            </div>

          </div>

          {reviews.length === 0 ? (
            <div
              style={{
                padding:
                  "25px 0",
                color: "#999",
                fontSize:
                  "12px",
              }}
            >
              No reviews yet.
            </div>
          ) : (
            <div
              style={{
                display:
                  "flex",
                flexDirection:
                  "column",
                gap:
                  "12px",
              }}
            >

              {reviews
                .slice(0, 5)
                .map(
                  (review) => (
                    <div
                      key={
                        review?._id ||
                        `${review?.user?._id}-${review?.createdAt}`
                      }
                      style={{
                        padding:
                          "12px 0",
                        borderBottom:
                          "1px solid #eee",
                      }}
                    >

                      <div
                        style={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "space-between",
                          gap:
                            "12px",
                        }}
                      >

                        <strong
                          style={{
                            fontSize:
                              "11px",
                          }}
                        >
                          {review?.user
                            ?.username ||
                            "Reader"}
                        </strong>

                        <span
                          style={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            gap:
                              "3px",
                            color:
                              "#ff6339",
                            fontSize:
                              "10px",
                            fontWeight:
                              "700",
                          }}
                        >
                          <Star
                            size={11}
                          />

                          {review?.rating ||
                            0}
                        </span>

                      </div>

                      <p
                        style={{
                          margin:
                            "6px 0 0",
                          color:
                            "#888",
                          fontSize:
                            "11px",
                          lineHeight:
                            "1.6",
                        }}
                      >
                        {review?.content ||
                          review?.comment ||
                          "No review text."}
                      </p>

                    </div>
                  )
                )}

            </div>
          )}

        </section>

        {/* =================================================
            CTA
        ================================================= */}

        <section className="analytics-cta">

          <div className="cta-icon">
            <PenLine size={21} />
          </div>

          <span className="section-label">
            KEEP CREATING
          </span>

          <h2>
            Great stories grow with every chapter.
          </h2>

          <p>
            Keep writing, keep publishing,
            and give your readers another
            world to discover.
          </p>

          <Link
            to="/create-story"
            className="create-button"
          >
            <Plus size={17} />
            Start Writing
          </Link>

        </section>

      </main>

    </div>
  );
}

export default Analytics;