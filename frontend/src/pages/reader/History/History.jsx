import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBookOpen,
  FaClock,
  FaArrowRight,
  FaTrash,
} from "react-icons/fa6";

import historyService from "../../../services/history/historyService";
import "./History.css";

function History() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD READING HISTORY
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    const fetchHistory = async () => {
      try {
        const response =
          await historyService.getHistory();

        console.log(
          "READING HISTORY RESPONSE:",
          response
        );

        if (cancelled) {
          return;
        }

        const historyData =
          response?.history ||
          response?.data?.history ||
          response?.data ||
          [];

        setHistory(
          Array.isArray(historyData)
            ? historyData
            : []
        );
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          "Load reading history error:",
          err
        );

        setError(
          err?.response?.data?.message ||
            "Unable to load reading history."
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchHistory();

    return () => {
      cancelled = true;
    };
  }, []);

  // =====================================================
  // REMOVE HISTORY ITEM
  // =====================================================

  const handleRemoveHistory = async (
    storyId
  ) => {
    if (!storyId || removingId) {
      return;
    }

    try {
      setRemovingId(storyId);
      setError("");

      await historyService.clearHistory(
        storyId
      );

      setHistory((current) =>
        current.filter((item) => {
          const story =
            item?.story || item;

          const id =
            story?._id ||
            story?.id ||
            item?.storyId;

          return (
            String(id) !== String(storyId)
          );
        })
      );
    } catch (err) {
      console.error(
        "Remove history error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to remove reading history."
      );
    } finally {
      setRemovingId(null);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {
    return (
      <main className="lumora-history">
        <div className="lumora-history__container">
          <div className="lumora-history__loading">
            Loading your reading history...
          </div>
        </div>
      </main>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main className="lumora-history">
      <div className="lumora-history__container">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="lumora-history__header">
          <div>
            <span className="lumora-history__eyebrow">
              YOUR READING
            </span>

            <h1>Reading History</h1>

            <p>
              Continue the stories you've been reading.
            </p>
          </div>

          <div className="lumora-history__count">
            <FaClock size={14} />

            <span>
              {history.length}{" "}
              {history.length === 1
                ? "story"
                : "stories"}
            </span>
          </div>
        </header>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="lumora-history__error">
            {error}
          </div>
        )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {history.length === 0 ? (
          <section className="lumora-history__empty">

            <div className="lumora-history__empty-icon">
              <FaBookOpen size={24} />
            </div>

            <h2>
              No reading history yet
            </h2>

            <p>
              Start reading a story and your
              progress will appear here.
            </p>

            <Link
              to="/discover"
              className="lumora-history__discover-button"
            >
              Discover Stories
              <FaArrowRight size={11} />
            </Link>

          </section>
        ) : (

          /* =================================================
             HISTORY LIST
          ================================================= */

          <section className="lumora-history__list">

            {history.map((item) => {
              const story =
                item?.story || item;

              const lastChapter =
                item?.lastChapter;

              const storyId =
                story?._id ||
                story?.id ||
                item?.storyId;

              const chapterId =
                lastChapter?._id ||
                lastChapter?.id ||
                item?.chapterId;

              const storyTitle =
                story?.title ||
                "Untitled Story";

              const storyDescription =
                story?.shortDescription ||
                story?.description ||
                "No description available.";

              const coverImage =
                story?.coverImage ||
                story?.cover ||
                "";

              const progress = Math.min(
                100,
                Math.max(
                  0,
                  Number(item?.progress || 0)
                )
              );

              const chapterNumber =
                lastChapter?.chapterNumber ||
                item?.lastChapterNumber ||
                "";

              const chapterTitle =
                lastChapter?.title ||
                item?.lastChapterTitle ||
                "";

              const readUrl =
                chapterId
                  ? `/read/${storyId}/${chapterId}`
                  : `/stories/${storyId}`;

              return (
                <article
                  key={
                    item?._id ||
                    storyId
                  }
                  className="lumora-history__card"
                >

                  {/* COVER */}

                  <Link
                    to={readUrl}
                    className="lumora-history__cover"
                  >
                    {coverImage ? (
                      <img
                        src={coverImage}
                        alt={storyTitle}
                      />
                    ) : (
                      <FaBookOpen size={22} />
                    )}
                  </Link>

                  {/* CONTENT */}

                  <div className="lumora-history__content">

                    <Link
                      to={readUrl}
                      className="lumora-history__title"
                    >
                      {storyTitle}
                    </Link>

                    <p className="lumora-history__description">
                      {storyDescription}
                    </p>

                    {(chapterNumber ||
                      chapterTitle) && (
                      <div className="lumora-history__chapter">
                        <FaBookOpen size={10} />

                        <span>
                          {chapterNumber
                            ? `Chapter ${chapterNumber}`
                            : ""}

                          {chapterTitle
                            ? ` — ${chapterTitle}`
                            : ""}
                        </span>
                      </div>
                    )}

                    {/* PROGRESS */}

                    <div className="lumora-history__progress">

                      <div className="lumora-history__progress-header">
                        <span>
                          Reading progress
                        </span>

                        <strong>
                          {progress}%
                        </strong>
                      </div>

                      <div className="lumora-history__progress-track">
                        <div
                          className="lumora-history__progress-bar"
                          style={{
                            width: `${progress}%`,
                          }}
                        />
                      </div>

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="lumora-history__actions">

                    <Link
                      to={readUrl}
                      className="lumora-history__continue"
                      title="Continue reading"
                    >
                      <FaArrowRight size={11} />
                    </Link>

                    <button
                      type="button"
                      className="lumora-history__remove"
                      onClick={() =>
                        handleRemoveHistory(
                          storyId
                        )
                      }
                      disabled={
                        removingId === storyId
                      }
                      title="Remove from history"
                    >
                      <FaTrash size={11} />
                    </button>

                  </div>

                </article>
              );
            })}

          </section>
        )}

      </div>
    </main>
  );
}

export default History;