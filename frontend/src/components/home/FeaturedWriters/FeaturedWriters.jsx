import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaPenNib } from "react-icons/fa6";

import SectionHeader from "../../common/SectionHeader/SectionHeader";

import storyService from "../../../services/stories/storyService";

import apiClient from "../../../services/api/apiClient";

import "./FeaturedWriters.css";

function FeaturedWriters() {
  const [writers, setWriters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedWriters = async () => {
      try {
        setLoading(true);

        const response =
          await storyService.getStories();

        const stories =
          Array.isArray(response?.stories)
            ? response.stories
            : Array.isArray(response?.data?.stories)
            ? response.data.stories
            : [];

        const publishedStories = stories.filter(
          (story) =>
            story?.status?.toLowerCase() ===
              "published" &&
            story?.visibility?.toLowerCase() ===
              "public" &&
            story?.author?._id
        );

        // -------------------------------------------------
        // Group published stories by writer
        // -------------------------------------------------

        const writerMap = new Map();

        publishedStories.forEach((story) => {
          const author = story.author;

          const writerId = author?._id;

          if (!writerId) {
            return;
          }

          if (!writerMap.has(writerId)) {
            writerMap.set(writerId, {
              id: writerId,
              username:
                author.username ||
                author.displayName ||
                "Writer",
              bio: author.bio || "",
              stories: 0,
              totalViews: 0,
              avatar: author.avatar || "",
            });
          }

          const writer =
            writerMap.get(writerId);

          writer.stories += 1;

          writer.totalViews +=
            Number(story.views || 0);
        });

        const writersFromStories = Array.from(
          writerMap.values()
        )
          .sort(
            (a, b) =>
              b.totalViews -
              a.totalViews
          )
          .slice(0, 4);

        // -------------------------------------------------
        // Get real follower counts
        // -------------------------------------------------

        const writersWithFollowers =
          await Promise.all(
            writersFromStories.map(
              async (writer) => {
                try {
                  const followerResponse =
                    await apiClient.get(
                      `/follows/${writer.id}/followers/count`
                    );

                  return {
                    ...writer,
                    followers:
                      followerResponse
                        ?.data
                        ?.count ??
                      followerResponse
                        ?.count ??
                      0,
                  };
                } catch (error) {
                  console.error(
                    `Follower count error for ${writer.id}:`,
                    error
                  );

                  return {
                    ...writer,
                    followers: 0,
                  };
                }
              }
            )
          );

        setWriters(
          writersWithFollowers
        );
      } catch (error) {
        console.error(
          "Featured Writers Error:",
          error
        );

        setWriters([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedWriters();
  }, []);

  // -------------------------------------------------
  // Helpers
  // -------------------------------------------------

  const formatFollowers = (value) => {
    const count = Number(value || 0);

    if (count >= 1000000) {
      return `${(count / 1000000)
        .toFixed(1)
        .replace(".0", "")}M`;
    }

    if (count >= 1000) {
      return `${(count / 1000)
        .toFixed(1)
        .replace(".0", "")}K`;
    }

    return count.toLocaleString("en-IN");
  };

  const getInitials = (username) => {
    const words = String(
      username || "Writer"
    )
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`
        .toUpperCase();
    }

    return String(
      username || "W"
    )
      .charAt(0)
      .toUpperCase();
  };

  return (
    <section className="lumora-featured-writers">
      <div className="lumora-featured-writers__container">

        <SectionHeader
          title="Featured Writers"
          description="Meet some of the voices behind the stories."
          viewAllPath="/community"
        />

        {loading ? (
          <div className="home-section-loading">
            Loading writers...
          </div>
        ) : writers.length === 0 ? (
          <div className="home-section-empty">
            No writers available yet.
          </div>
        ) : (
          <div className="lumora-featured-writers__grid">

            {writers.map((writer) => (
              <article
                key={writer.id}
                className="lumora-featured-writers__card"
              >

                <div className="lumora-featured-writers__avatar">

                  {writer.avatar ? (
                    <img
                      src={writer.avatar}
                      alt={writer.username}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "inherit",
                      }}
                    />
                  ) : (
                    getInitials(
                      writer.username
                    )
                  )}

                </div>

                <div className="lumora-featured-writers__content">

                  <Link
                    to={`/profile/${writer.id}`}
                    className="lumora-featured-writers__name"
                  >
                    {writer.username}
                  </Link>

                  <p className="lumora-featured-writers__bio">
                    {writer.bio ||
                      "Writer on Lumora."}
                  </p>

                  <div className="lumora-featured-writers__stats">

                    <span>
                      <strong>
                        {writer.stories}
                      </strong>
                      Stories
                    </span>

                    <span>
                      <strong>
                        {formatFollowers(
                          writer.followers
                        )}
                      </strong>
                      Followers
                    </span>

                  </div>

                </div>

                <Link
                  to={`/profile/${writer.id}`}
                  className="lumora-featured-writers__action"
                >
                  <FaArrowRight size={11} />
                </Link>

              </article>
            ))}

          </div>
        )}

        <div className="lumora-featured-writers__bottom">

          <Link
            to="/become-writer"
            className="lumora-featured-writers__writer-link"
          >
            <FaPenNib size={12} />
            Start writing on Lumora
          </Link>

        </div>

      </div>
    </section>
  );
}

export default FeaturedWriters;