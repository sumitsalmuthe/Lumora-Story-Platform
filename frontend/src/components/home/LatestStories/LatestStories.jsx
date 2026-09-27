import { useEffect, useState } from "react";

import SectionHeader from "../../common/SectionHeader/SectionHeader";
import StoryRow from "../../story/StoryRow/StoryRow";

import storyService from "../../../services/stories/storyService";

import "./LatestStories.css";

function LatestStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLatestStories = async () => {
      try {
        setLoading(true);

        const response =
          await storyService.getStories();

        const realStories =
          Array.isArray(response?.stories)
            ? response.stories
            : Array.isArray(response?.data?.stories)
            ? response.data.stories
            : [];

        const latest = [...realStories]
          .filter(
            (story) =>
              story?.status?.toLowerCase() ===
                "published" &&
              story?.visibility?.toLowerCase() ===
                "public"
          )
          .sort(
            (a, b) =>
              new Date(
                b.createdAt || 0
              ) -
              new Date(
                a.createdAt || 0
              )
          )
          .slice(0, 4)
          .map((story) => ({
            ...story,

            id: story._id,

            author: {
              id: story.author?._id,
              username:
                story.author?.username ||
                "Unknown Writer",
            },

            likes: Array.isArray(story.likes)
              ? story.likes.length
              : story.likes || 0,

            bookmarks: Array.isArray(
              story.bookmarks
            )
              ? story.bookmarks.length
              : story.bookmarks || 0,
          }));

        setStories(latest);
      } catch (error) {
        console.error(
          "Latest Stories Error:",
          error
        );

        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    loadLatestStories();
  }, []);

  return (
    <section className="lumora-latest-stories">
      <div className="lumora-latest-stories__container">

        <SectionHeader
          title="Latest Stories"
          description="Fresh stories and new voices to discover."
          viewAllPath="/discover"
        />

        {loading ? (
          <div className="home-section-loading">
            Loading stories...
          </div>
        ) : stories.length === 0 ? (
          <div className="home-section-empty">
            No latest stories available yet.
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

export default LatestStories;