import { Link } from "react-router-dom";
import {
  FaBookOpen,
  FaHeart,
  FaRegBookmark,
} from "react-icons/fa";

import Badge from "../../common/Badge/Badge";

import "./StoryCard.css";

function StoryCard({
  story,
  variant = "default",
  showDescription = true,
  showStats = true,
  showBookmark = false,
  onBookmark,
  className = "",
}) {
  if (!story) {
    return null;
  }

  const {
    _id,
    id,
    title = "Untitled Story",
    author,
    coverImage,
    category,
    storyType,
    shortDescription,
    description,
    views = 0,
    likes = 0,
    bookmarks = 0,
    status,
    mature = false,
  } = story;

  const storyId = _id || id;

  const authorName =
    typeof author === "string"
      ? author
      : author?.username ||
        author?.name ||
        "Unknown Writer";

  const authorId =
    typeof author === "object"
      ? author?._id || author?.id
      : null;

  const storyPath = storyId
    ? `/stories/${storyId}`
    : "#";

  const formattedViews = new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(views);

  const formattedLikes = new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(likes);

  const formattedBookmarks = new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(bookmarks);

  /*
    Creates a stable visual class based on the story category.
    This is only used when no real cover image exists.
  */
  const coverTheme =
    category?.toLowerCase().replace(/\s+/g, "-") ||
    "default";

  return (
    <article
      className={`lumora-story-card lumora-story-card--${variant} ${className}`}
    >
      {/* =====================================================
          COVER
      ===================================================== */}

      <Link
        to={storyPath}
        className="lumora-story-card__cover-link"
        aria-label={`Read ${title}`}
      >
        <div
          className={`lumora-story-card__cover lumora-story-card__cover--${coverTheme}`}
        >
          {coverImage ? (
            <img
              src={coverImage}
              alt={`${title} cover`}
              className="lumora-story-card__image"
              loading="lazy"
            />
          ) : (
            /*
              Fallback cover.
              Used only when the story does not have
              a real coverImage.
            */
            <div className="lumora-story-card__fallback">
              <div className="lumora-story-card__fallback-glow" />

              <div className="lumora-story-card__fallback-content">
                <span className="lumora-story-card__fallback-category">
                  {category || "STORY"}
                </span>

                <div className="lumora-story-card__fallback-book">
                  <FaBookOpen size={22} />
                </div>

                <h3>
                  {title}
                </h3>

                {authorName && (
                  <span>
                    {authorName}
                  </span>
                )}
              </div>
            </div>
          )}

          {mature && (
            <span className="lumora-story-card__mature">
              Mature
            </span>
          )}
        </div>
      </Link>

      {/* =====================================================
          BODY
      ===================================================== */}

      <div className="lumora-story-card__body">
        {/* META */}

        <div className="lumora-story-card__meta">
          {category && (
            <Badge
              variant="primary"
              size="small"
            >
              {category}
            </Badge>
          )}

          {storyType && (
            <span className="lumora-story-card__type">
              {storyType}
            </span>
          )}
        </div>

        {/* TITLE */}

        <Link
          to={storyPath}
          className="lumora-story-card__title"
        >
          {title}
        </Link>

        {/* AUTHOR */}

        {authorId ? (
          <Link
            to={`/profile/${authorId}`}
            className="lumora-story-card__author"
          >
            {authorName}
          </Link>
        ) : (
          <span className="lumora-story-card__author">
            {authorName}
          </span>
        )}

        {/* DESCRIPTION */}

        {showDescription &&
          (shortDescription || description) && (
            <p className="lumora-story-card__description">
              {shortDescription || description}
            </p>
          )}

        {/* STATS */}

        {showStats && (
          <div className="lumora-story-card__stats">
            <span title={`${views} views`}>
              <FaBookOpen size={11} />
              {formattedViews}
            </span>

            <span title={`${likes} likes`}>
              <FaHeart size={11} />
              {formattedLikes}
            </span>

            <span title={`${bookmarks} bookmarks`}>
              <FaRegBookmark size={11} />
              {formattedBookmarks}
            </span>

            {status && (
              <span className="lumora-story-card__status">
                {status}
              </span>
            )}
          </div>
        )}

        {/* BOOKMARK */}

        {showBookmark && (
          <button
            type="button"
            className="lumora-story-card__bookmark"
            onClick={() => onBookmark?.(story)}
            aria-label={`Bookmark ${title}`}
          >
            <FaRegBookmark size={14} />
          </button>
        )}
      </div>
    </article>
  );
}

export default StoryCard;