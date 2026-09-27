import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaArrowRight,
  FaBookOpen,
  FaChartLine,
  FaFire,
  FaHeart,
  FaComments,
  FaClock,
  FaBolt,
  FaUserGroup,
} from "react-icons/fa6";

import Footer from "../../../components/layout/Footer/Footer";

import storyService from "../../../services/stories/storyService";

import "./Trending.css";

/*
=========================================================
TRENDING SECTIONS
=========================================================
*/

const trendingSections = [
  {
    slug: "now",
    title: "Trending Now",
    description: "Stories readers are discovering right now.",
    icon: FaFire,
    metric: "Live momentum",
  },
  {
    slug: "rising",
    title: "Rising Stories",
    description: "Stories gaining attention faster than ever.",
    icon: FaChartLine,
    metric: "Growing fast",
  },
  {
    slug: "most-read",
    title: "Most Read",
    description: "The stories with the highest readership.",
    icon: FaBookOpen,
    metric: "By reads",
  },
  {
    slug: "most-liked",
    title: "Most Liked",
    description: "Stories readers are showing the most love.",
    icon: FaHeart,
    metric: "By likes",
  },
  {
    slug: "most-discussed",
    title: "Most Discussed",
    description: "Stories creating the biggest conversations.",
    icon: FaComments,
    metric: "By comments",
  },
  {
    slug: "this-week",
    title: "Popular This Week",
    description: "The stories dominating this week's reading.",
    icon: FaClock,
    metric: "This week",
  },
  {
    slug: "new",
    title: "New & Trending",
    description:
      "Fresh stories already catching readers' attention.",
    icon: FaBolt,
    metric: "Recently discovered",
  },
  {
    slug: "fastest-growing",
    title: "Fastest Growing",
    description:
      "Stories with the strongest recent momentum.",
    icon: FaChartLine,
    metric: "Fast growth",
  },
  {
    slug: "genres",
    title: "Trending by Genre",
    description:
      "See what is trending across every genre.",
    icon: FaBookOpen,
    metric: "Explore genres",
  },
  {
    slug: "writers",
    title: "Trending Writers",
    description:
      "Writers readers are discovering and following.",
    icon: FaUserGroup,
    metric: "Popular writers",
  },
];

function Trending() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  /*
  =========================================================
  LOAD REAL STORIES
  =========================================================
  */

  useEffect(() => {
    const loadTrendingStories = async () => {
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

        /*
        Current backend does not provide a dedicated
        time-based trending score.

        So for the main Trending page we use views
        as the real measurable popularity signal.
        */

        const trendingStories = [...publishedStories]
          .sort(
            (a, b) =>
              (Number(b?.views) || 0) -
              (Number(a?.views) || 0)
          )
          .slice(0, 4);

        setStories(trendingStories);
      } catch (error) {
        console.error(
          "Trending stories error:",
          error
        );

        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    loadTrendingStories();
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

  const getCommentsCount = (story) => {
    if (Array.isArray(story?.comments)) {
      return story.comments.length;
    }

    return Number(story?.comments) || 0;
  };

  return (
    <>
      <main className="lumora-trending">

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="lumora-trending__hero">
          <div className="lumora-trending__container">

            <span className="lumora-trending__eyebrow">
              LUMORA TRENDING
            </span>

            <h1>
              Discover what
              <br />
              <span>everyone is reading.</span>
            </h1>

            <p>
              Explore the stories gaining attention,
              growing quickly, and creating conversations
              across Lumora.
            </p>

          </div>
        </section>

        {/* =====================================================
            TRENDING CATEGORIES
        ===================================================== */}

        <section className="lumora-trending__categories">
          <div className="lumora-trending__container">

            <div className="lumora-trending__section-header">

              <div>
                <span>EXPLORE TRENDING</span>

                <h2>What's happening on Lumora</h2>

                <p>
                  Find stories based on what readers
                  are doing right now.
                </p>
              </div>

              <span className="lumora-trending__count">
                {trendingSections.length} sections
              </span>

            </div>

            <div className="lumora-trending__category-grid">

              {trendingSections.map((section) => {
                const Icon = section.icon;

                return (
                  <Link
                    key={section.slug}
                    to={`/trending/${section.slug}`}
                    className="lumora-trending__category-card"
                  >
                    <div className="lumora-trending__category-icon">
                      <Icon size={16} />
                    </div>

                    <div className="lumora-trending__category-content">

                      <span>{section.metric}</span>

                      <h3>{section.title}</h3>

                      <p>{section.description}</p>

                    </div>

                    <FaArrowRight
                      size={10}
                      className="lumora-trending__category-arrow"
                    />
                  </Link>
                );
              })}

            </div>

          </div>
        </section>

        {/* =====================================================
            TRENDING NOW
        ===================================================== */}

        <section className="lumora-trending__stories">
          <div className="lumora-trending__container">

            <div className="lumora-trending__section-header">

              <div>
                <span>RIGHT NOW</span>

                <h2>Trending stories</h2>

                <p>
                  The stories with the highest readership
                  among currently published stories.
                </p>
              </div>

              <Link
                to="/trending/now"
                className="lumora-trending__view-all"
              >
                View all
                <FaArrowRight size={10} />
              </Link>

            </div>

            {/* =================================================
                LOADING
            ================================================= */}

            {loading ? (

              <div className="lumora-trending__story-list">

                {[1, 2, 3, 4].map((item) => (
                  <article
                    key={item}
                    className="lumora-trending__story"
                  >
                    <div className="lumora-trending__rank">
                      #{item}
                    </div>

                    <div className="lumora-trending__story-cover">
                      <FaBookOpen size={20} />
                    </div>

                    <div className="lumora-trending__story-content">

                      <span className="lumora-trending__story-category">
                        Loading...
                      </span>

                      <span className="lumora-trending__story-title">
                        Loading story...
                      </span>

                      <span className="lumora-trending__story-author">
                        Please wait
                      </span>

                    </div>
                  </article>
                ))}

              </div>

            ) : stories.length > 0 ? (

              /* =================================================
                  REAL STORIES
              ================================================= */

              <div className="lumora-trending__story-list">

                {stories.map((story, index) => (

                  <article
                    key={story._id}
                    className="lumora-trending__story"
                  >

                    <div className="lumora-trending__rank">
                      #{index + 1}
                    </div>

                    <div className="lumora-trending__story-cover">

                      {story.coverImage ? (
                        <img
                          src={story.coverImage}
                          alt={story.title}
                        />
                      ) : (
                        <FaBookOpen size={20} />
                      )}

                    </div>

                    <div className="lumora-trending__story-content">

                      <span className="lumora-trending__story-category">
                        {story.category ||
                          "Uncategorized"}
                      </span>

                      <Link
                        to={`/stories/${story._id}`}
                        className="lumora-trending__story-title"
                      >
                        {story.title}
                      </Link>

                      <span className="lumora-trending__story-author">
                        by{" "}
                        {story.author?.username ||
                          "Unknown Writer"}
                      </span>

                      <p>
                        {story.shortDescription ||
                          "Discover this story on Lumora."}
                      </p>

                      <div className="lumora-trending__story-stats">

                        <span>
                          <FaBookOpen size={9} />
                          {formatNumber(story.views)}
                        </span>

                        <span>
                          <FaHeart size={9} />
                          {formatNumber(
                            getLikesCount(story)
                          )}
                        </span>

                        <span>
                          <FaComments size={9} />
                          {formatNumber(
                            getCommentsCount(story)
                          )}
                        </span>

                      </div>

                    </div>

                    <Link
                      to={`/stories/${story._id}`}
                      className="lumora-trending__story-arrow"
                      aria-label={`Read ${story.title}`}
                    >
                      <FaArrowRight size={11} />
                    </Link>

                  </article>

                ))}

              </div>

            ) : (

              /* =================================================
                  EMPTY STATE
              ================================================= */

              <div className="lumora-trending__empty">

                <FaBookOpen size={24} />

                <h3>
                  No trending stories yet
                </h3>

                <p>
                  Published stories will appear here
                  as readers discover them.
                </p>

                <Link to="/discover">
                  Discover Stories
                  <FaArrowRight size={10} />
                </Link>

              </div>

            )}

          </div>
        </section>

        {/* =====================================================
            WRITER CTA
        ===================================================== */}

        <section className="lumora-trending__writer">
          <div className="lumora-trending__container">

            <div className="lumora-trending__writer-box">

              <span>FOR WRITERS</span>

              <h2>
                Your story could be trending next.
              </h2>

              <p>
                Share your story with Lumora readers
                and start building your audience.
              </p>

              <Link to="/become-writer">
                Start Writing
                <FaArrowRight size={10} />
              </Link>

            </div>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}

export default Trending;