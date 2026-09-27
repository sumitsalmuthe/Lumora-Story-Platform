import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaBookOpen } from "react-icons/fa6";

import SectionHeader from "../../common/SectionHeader/SectionHeader";

import apiClient from "../../../services/api/apiClient";

import "./ContinueReading.css";

function ContinueReading() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReadingHistory = async () => {
      try {
        setLoading(true);

        const response =
          await apiClient.get("/history");

        const history =
          Array.isArray(response?.history)
            ? response.history
            : Array.isArray(
                response?.data?.history
              )
            ? response.data.history
            : Array.isArray(response?.data)
            ? response.data
            : [];

        const continueStories = history
          .filter((item) => {
            const progress =
              Number(
                item?.progress ??
                  item?.progressPercentage ??
                  0
              );

            return (
              progress > 0 &&
              progress < 100 &&
              item?.story
            );
          })
          .slice(0, 3)
          .map((item) => {
            const story =
              item.story || {};

            const progress = Math.min(
              100,
              Math.max(
                0,
                Number(
                  item?.progress ??
                    item?.progressPercentage ??
                    0
                )
              )
            );

            return {
              id:
                story._id ||
                story.id,

              title:
                story.title ||
                "Untitled Story",

              author:
                story.author?.username ||
                story.author?.displayName ||
                "Unknown Writer",

              chapter:
                item?.chapter?.title ||
                item?.lastChapter?.title ||
                `Chapter ${
                  item?.chapterNumber ||
                  item?.lastChapterNumber ||
                  1
                }`,

              progress,
            };
          });

        setStories(continueStories);
      } catch (error) {
        console.error(
          "Continue Reading Error:",
          error
        );

        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    loadReadingHistory();
  }, []);

  return (
    <section className="lumora-continue-reading">
      <div className="lumora-continue-reading__container">

        <SectionHeader
          title="Continue Reading"
          description="Pick up where you left off."
          viewAllPath="/history"
        />

        {loading ? (
          <div className="home-section-loading">
            Loading your reading history...
          </div>
        ) : stories.length === 0 ? (
          <div className="home-section-empty">
            <FaBookOpen size={20} />

            <span>
              No unfinished stories yet.
            </span>

            <Link to="/discover">
              Discover stories
            </Link>
          </div>
        ) : (
          <div className="lumora-continue-reading__list">

            {stories.map((story) => (
              <article
                key={story.id}
                className="lumora-continue-reading__card"
              >

                <div className="lumora-continue-reading__cover">
                  <FaBookOpen size={20} />
                </div>

                <div className="lumora-continue-reading__content">

                  <h3>
                    {story.title}
                  </h3>

                  <p className="lumora-continue-reading__author">
                    {story.author}
                  </p>

                  <p className="lumora-continue-reading__chapter">
                    {story.chapter}
                  </p>

                  <div className="lumora-continue-reading__progress">

                    <div
                      className="lumora-continue-reading__progress-bar"
                      style={{
                        width: `${story.progress}%`,
                      }}
                    />

                  </div>

                  <span className="lumora-continue-reading__percentage">
                    {story.progress}% completed
                  </span>

                </div>

                <Link
                  to={`/read/${story.id}`}
                  className="lumora-continue-reading__action"
                >
                  <span>
                    Continue
                  </span>

                  <FaArrowRight size={11} />
                </Link>

              </article>
            ))}

          </div>
        )}

      </div>
    </section>
  );
}

export default ContinueReading;