import { useEffect, useState } from "react";

import SectionHeader from "../../common/SectionHeader/SectionHeader";
import StoryRow from "../../story/StoryRow/StoryRow";

import storyService from "../../../services/stories/storyService";

import "./FeaturedStories.css";

function FeaturedStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedStories = async () => {
      try {
        setLoading(true);

        const response = await storyService.getStories();

        const realStories = Array.isArray(response?.stories)
          ? response.stories
          : Array.isArray(response?.data?.stories)
          ? response.data.stories
          : [];

        const featured = [...realStories]
          .filter(
            (story) =>
              story?.status?.toLowerCase() === "published" &&
              story?.visibility?.toLowerCase() === "public"
          )
          .sort(
            (a, b) =>
              (b.views || 0) - (a.views || 0)
          )
          .slice(0, 4)
          .map((story) => ({
            ...story,
            id: story._id,
            author: {
              id: story.author?._id,
              username:
                story.author?.username || "Unknown Writer",
            },
            likes: Array.isArray(story.likes)
              ? story.likes.length
              : story.likes || 0,
            bookmarks: Array.isArray(story.bookmarks)
              ? story.bookmarks.length
              : story.bookmarks || 0,
          }));

        setStories(featured);
      } catch (error) {
        console.error(
          "Featured Stories Error:",
          error
        );

        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedStories();
  }, []);

  return (
    <section className="lumora-featured-stories">
      <div className="lumora-featured-stories__container">
        <SectionHeader
          title="Featured Stories"
          description="Discover stories worth adding to your reading list."
          viewAllPath="/discover"
        />

        {loading ? (
          <div className="home-section-loading">
            Loading stories...
          </div>
        ) : stories.length === 0 ? (
          <div className="home-section-empty">
            No featured stories available yet.
          </div>
        ) : (
          <StoryRow
            stories={stories}
            columns={4}
            showDescription={false}
            showStats
            showBookmark
          />
        )}
      </div>
    </section>
  );
}

export default FeaturedStories;