import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaBookOpen,
  FaHeart,
  FaTrash,
  FaArrowRight,
} from "react-icons/fa6";

import bookmarkService from "../../../services/bookmarks/bookmarkService";
import "./Bookmarks.css";

function Bookmarks() {
  // =====================================================
  // STATE
  // =====================================================

  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD BOOKMARKS
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    const fetchBookmarks = async () => {
      try {
        const response =
          await bookmarkService.getBookmarks();

        console.log(
          "BOOKMARKS RESPONSE:",
          response
        );

        if (cancelled) {
          return;
        }

        const bookmarkData =
          response?.bookmarks ||
          response?.data?.bookmarks ||
          response?.data ||
          [];

        setBookmarks(
          Array.isArray(bookmarkData)
            ? bookmarkData
            : []
        );
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          "Load bookmarks error:",
          err
        );

        setError(
          err?.response?.data?.message ||
            "Unable to load bookmarks."
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchBookmarks();

    return () => {
      cancelled = true;
    };
  }, []);

  // =====================================================
  // REMOVE BOOKMARK
  // =====================================================

  const handleRemoveBookmark = async (
    storyId
  ) => {
    if (!storyId || removingId) {
      return;
    }

    try {
      setRemovingId(storyId);
      setError("");

      await bookmarkService.removeBookmark(
        storyId
      );

      setBookmarks((current) =>
        current.filter((bookmark) => {
          const story =
            bookmark?.story ||
            bookmark;

          const id =
            story?._id ||
            story?.id ||
            bookmark?.storyId;

          return (
            String(id) !== String(storyId)
          );
        })
      );
    } catch (err) {
      console.error(
        "Remove bookmark error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to remove bookmark."
      );
    } finally {
      setRemovingId(null);
    }
  };

  // =====================================================
  // GET STORY FROM BOOKMARK
  // =====================================================

  const getStory = (bookmark) => {
    return (
      bookmark?.story ||
      bookmark?.storyId ||
      bookmark
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {
    return (
      <main className="lumora-bookmarks">
        <div className="lumora-bookmarks__container">
          <div className="lumora-bookmarks__loading">
            Loading your bookmarks...
          </div>
        </div>
      </main>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main className="lumora-bookmarks">
      <div className="lumora-bookmarks__container">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="lumora-bookmarks__header">
          <div>
            <span className="lumora-bookmarks__eyebrow">
              YOUR LIBRARY
            </span>

            <h1>Bookmarks</h1>

            <p>
              Stories you've saved to read later.
            </p>
          </div>

          <div className="lumora-bookmarks__count">
            <FaBookOpen size={14} />

            <span>
              {bookmarks.length}{" "}
              {bookmarks.length === 1
                ? "story"
                : "stories"}
            </span>
          </div>
        </header>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="lumora-bookmarks__error">
            {error}
          </div>
        )}

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {bookmarks.length === 0 ? (
          <section className="lumora-bookmarks__empty">

            <div className="lumora-bookmarks__empty-icon">
              <FaBookOpen size={24} />
            </div>

            <h2>
              No bookmarks yet
            </h2>

            <p>
              Save stories you want to read later
              and they'll appear here.
            </p>

            <Link
              to="/discover"
              className="lumora-bookmarks__discover-button"
            >
              Discover Stories
              <FaArrowRight size={11} />
            </Link>

          </section>
        ) : (
          /* =================================================
             BOOKMARK LIST
          ================================================= */

          <section className="lumora-bookmarks__list">

            {bookmarks.map((bookmark) => {
              const story =
                getStory(bookmark);

              const storyId =
                story?._id ||
                story?.id ||
                bookmark?.storyId;

              const title =
                story?.title ||
                "Untitled Story";

              const description =
                story?.shortDescription ||
                story?.description ||
                "No description available.";

              const coverImage =
                story?.coverImage ||
                story?.cover ||
                "";

              const views = Number(
                story?.views || 0
              );

              const likes =
                Array.isArray(story?.likes)
                  ? story.likes.length
                  : Number(
                      story?.likes || 0
                    );

              return (
                <article
                  key={
                    bookmark?._id ||
                    storyId
                  }
                  className="lumora-bookmarks__card"
                >

                  {/* =====================================
                      COVER
                  ===================================== */}

                  <Link
                    to={`/stories/${storyId}`}
                    className="lumora-bookmarks__cover"
                  >
                    {coverImage ? (
                      <img
                        src={coverImage}
                        alt={title}
                      />
                    ) : (
                      <FaBookOpen size={22} />
                    )}
                  </Link>

                  {/* =====================================
                      CONTENT
                  ===================================== */}

                  <div className="lumora-bookmarks__content">

                    <div className="lumora-bookmarks__title-row">

                      <Link
                        to={`/stories/${storyId}`}
                        className="lumora-bookmarks__title"
                      >
                        {title}
                      </Link>

                      {story?.category && (
                        <span className="lumora-bookmarks__category">
                          {story.category}
                        </span>
                      )}

                    </div>

                    <p>
                      {description}
                    </p>

                    <div className="lumora-bookmarks__meta">

                      <span>
                        <FaBookOpen size={10} />
                        {views.toLocaleString()}{" "}
                        views
                      </span>

                      <span>
                        <FaHeart size={10} />
                        {likes.toLocaleString()}{" "}
                        likes
                      </span>

                    </div>

                  </div>

                  {/* =====================================
                      ACTIONS
                  ===================================== */}

                  <div className="lumora-bookmarks__actions">

                    <Link
                      to={`/stories/${storyId}`}
                      className="lumora-bookmarks__open"
                      title="Open story"
                    >
                      <FaArrowRight size={11} />
                    </Link>

                    <button
                      type="button"
                      className="lumora-bookmarks__remove"
                      onClick={() =>
                        handleRemoveBookmark(
                          storyId
                        )
                      }
                      disabled={
                        removingId === storyId
                      }
                      title="Remove bookmark"
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

export default Bookmarks;