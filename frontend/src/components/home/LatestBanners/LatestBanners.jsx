import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaBookOpen } from "react-icons/fa6";

import storyService from "../../../services/stories/storyService";

import "./LatestBanners.css";

function StoryBanner({ story, type }) {
  const label =
    type === "latest"
      ? "LATEST"
      : "TRENDING";

  return (
    <article
      className="lumora-latest-banner"
      style={{
        "--banner-image": `url("${
          story.coverImage || ""
        }")`,
      }}
    >
      <div className="lumora-latest-banner__background" />

      <div className="lumora-latest-banner__overlay" />

      <div className="lumora-latest-banner__content">

        <div className="lumora-latest-banner__cover">
          {story.coverImage ? (
            <img
              src={story.coverImage}
              alt={story.title}
            />
          ) : (
            <div className="lumora-latest-banner__cover-placeholder">
              <FaBookOpen size={28} />
            </div>
          )}
        </div>

        <div className="lumora-latest-banner__info">

          <div className="lumora-latest-banner__top">

            <span className="lumora-latest-banner__category">
              {story.category || "Story"}
            </span>

            <span className="lumora-latest-banner__label">
              {label}
            </span>

          </div>

          <h3>
            {story.title}
          </h3>

          <p className="lumora-latest-banner__author">
            by{" "}
            {story.author?.username ||
              story.author?.displayName ||
              "Unknown Writer"}
          </p>

          <p className="lumora-latest-banner__description">
            {story.shortDescription ||
              story.description ||
              "Discover this story on Lumora."}
          </p>

          <Link
            to={`/stories/${story._id}`}
            className="lumora-latest-banner__button"
          >
            <FaBookOpen size={11} />
            Read Story
            <FaArrowRight size={10} />
          </Link>

        </div>
      </div>

      <div className="lumora-latest-banner__progress">
        <span />
      </div>
    </article>
  );
}

function LatestBanners() {
  const [latestStories, setLatestStories] = useState([]);
  const [trendingStories, setTrendingStories] = useState([]);

  const [latestIndex, setLatestIndex] = useState(0);
  const [trendingIndex, setTrendingIndex] =
    useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStories = async () => {
      try {
        setLoading(true);

        const response =
          await storyService.getStories();

        const realStories =
          Array.isArray(response?.stories)
            ? response.stories
            : Array.isArray(
                response?.data?.stories
              )
            ? response.data.stories
            : [];

        const publishedStories =
          realStories.filter(
            (story) =>
              story?.status?.toLowerCase() ===
                "published" &&
              story?.visibility?.toLowerCase() ===
                "public"
          );

        // Latest = newest published stories
        const latest = [...publishedStories]
          .sort(
            (a, b) =>
              new Date(b.createdAt || 0) -
              new Date(a.createdAt || 0)
          )
          .slice(0, 6);

        // Trending = highest viewed stories
        const trending = [...publishedStories]
          .sort(
            (a, b) =>
              Number(b.views || 0) -
              Number(a.views || 0)
          )
          .slice(0, 6);

        setLatestStories(latest);
        setTrendingStories(trending);

        setLatestIndex(0);
        setTrendingIndex(0);
      } catch (error) {
        console.error(
          "Latest Banners Error:",
          error
        );

        setLatestStories([]);
        setTrendingStories([]);
      } finally {
        setLoading(false);
      }
    };

    loadStories();
  }, []);

  useEffect(() => {
    if (
      latestStories.length === 0 &&
      trendingStories.length === 0
    ) {
      return;
    }

    const interval = setInterval(() => {
      setLatestIndex((current) =>
        latestStories.length
          ? (current + 1) %
            latestStories.length
          : 0
      );

      setTrendingIndex((current) =>
        trendingStories.length
          ? (current + 1) %
            trendingStories.length
          : 0
      );
    }, 4000);

    return () => {
      clearInterval(interval);
    };
  }, [
    latestStories.length,
    trendingStories.length,
  ]);

  return (
    <section className="lumora-latest-banners">

      <div className="lumora-latest-banners__container">

        <div className="lumora-latest-banners__header">

          <div>

            <span className="lumora-latest-banners__eyebrow">
              FRESH ON LUMORA
            </span>

            <h2>
              Stories worth discovering.
            </h2>

            <p>
              Discover the newest stories and
              see what's capturing readers'
              attention.
            </p>

          </div>

          <Link
            to="/discover"
            className="lumora-latest-banners__view-all"
          >
            View all
            <FaArrowRight size={11} />
          </Link>

        </div>

        {loading ? (
          <div className="home-section-loading">
            Loading stories...
          </div>
        ) : latestStories.length === 0 &&
          trendingStories.length === 0 ? (
          <div className="home-section-empty">
            No published stories available yet.
          </div>
        ) : (
          <div className="lumora-latest-banners__grid">

            {/* LATEST */}
            {latestStories.length > 0 ? (
              <StoryBanner
                key={`latest-${latestIndex}`}
                story={
                  latestStories[
                    latestIndex
                  ]
                }
                type="latest"
              />
            ) : null}

            {/* TRENDING */}
            {trendingStories.length > 0 ? (
              <StoryBanner
                key={`trending-${trendingIndex}`}
                story={
                  trendingStories[
                    trendingIndex
                  ]
                }
                type="trending"
              />
            ) : null}

          </div>
        )}

      </div>

    </section>
  );
}

export default LatestBanners;