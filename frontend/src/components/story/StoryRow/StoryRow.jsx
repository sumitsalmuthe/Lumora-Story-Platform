import StoryCard from "../StoryCard/StoryCard";

import "./StoryRow.css";

function StoryRow({
  stories = [],
  columns = 5,
  variant = "default",
  showDescription = true,
  showStats = true,
  showBookmark = false,
  onBookmark,
  emptyMessage = "No stories available.",
  className = "",
}) {
  return (
    <div
      className={`lumora-story-row lumora-story-row--${variant} ${className}`}
      style={{
        "--story-columns": columns,
      }}
    >
      {stories.length > 0 ? (
        stories.map((story) => (
          <StoryCard
            key={story._id || story.id}
            story={story}
            variant={variant}
            showDescription={showDescription}
            showStats={showStats}
            showBookmark={showBookmark}
            onBookmark={onBookmark}
          />
        ))
      ) : (
        <div className="lumora-story-row__empty">
          {emptyMessage}
        </div>
      )}
    </div>
  );
}

export default StoryRow;