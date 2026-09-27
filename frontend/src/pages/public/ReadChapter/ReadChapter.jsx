import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaBookmark,
  FaChevronLeft,
  FaChevronRight,
  FaList,
  FaMoon,
} from "react-icons/fa6";
import storyService from "../../../services/stories/storyService";
import historyService from "../../../services/history/historyService";
import useAuth from "../../../context/AuthContext/useAuth";
import "./ReadChapter.css";

function ReadChapter() {
  const { storyId, chapterId } = useParams();
  const { isAuthenticated } = useAuth();
  const isApiStory = /^[a-f\d]{24}$/i.test(storyId || "");
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(isApiStory);

  useEffect(() => {
    if (!isApiStory) {
      return;
    }

    const loadReader = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await storyService.getStoryById(storyId);
        setStory(response.story);
        setChapters(response.chapters);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load this chapter.");
      } finally {
        setIsLoading(false);
      }
    };

    loadReader();
  }, [isApiStory, storyId]);

  const currentIndex = chapters.findIndex((chapter) => chapter._id === chapterId);
  const currentChapter = chapters[currentIndex];
  const previousChapter = chapters[currentIndex - 1];
  const nextChapter = chapters[currentIndex + 1];

  useEffect(() => {
    if (isAuthenticated && currentChapter?._id) {
      historyService.updateHistory(storyId, currentChapter._id).catch(() => {});
    }
  }, [currentChapter?._id, isAuthenticated, storyId]);

  if (isLoading) {
    return <main className="lumora-reader">Loading chapter...</main>;
  }

  if (error || !currentChapter) {
    return (
      <main className="lumora-reader">
        <section className="lumora-reader__content">
          <p>{error || (isApiStory ? "Chapter not found." : "This demo chapter is not connected to a published story yet.")}</p>
          <Link to={`/stories/${storyId}`}>Back to story</Link>
        </section>
      </main>
    );
  }

  const paragraphs = currentChapter.content.split(/\n\s*\n/).filter(Boolean);

  return (
    <main className="lumora-reader">
      <header className="lumora-reader__header">
        <div className="lumora-reader__header-inner">
          <Link to={`/stories/${storyId}`} className="lumora-reader__back">
            <FaArrowLeft size={11} />
            <span>Back to story</span>
          </Link>

          <div className="lumora-reader__title">
            <span>{story.title}</span>
            <small>Chapter {currentChapter.chapterNumber}</small>
          </div>

          <div className="lumora-reader__actions">
            <Link to={`/stories/${storyId}`} aria-label="Bookmark story" title="Bookmark story">
              <FaBookmark size={14} />
            </Link>
            <button type="button" aria-label="Reading theme unavailable" title="Reading theme unavailable">
              <FaMoon size={14} />
            </button>
            <Link to={`/stories/${storyId}`} aria-label="Chapter list" title="Chapter list">
              <FaList size={14} />
            </Link>
          </div>
        </div>
      </header>

      <section className="lumora-reader__content">
        <div className="lumora-reader__meta">
          <span>{story.title}</span>
          <span>Chapter {currentChapter.chapterNumber}</span>
        </div>
        <h1>{currentChapter.title}</h1>
        <div className="lumora-reader__byline">
          <span>By {story.author?.username || "Unknown Writer"}</span>
          <span>•</span>
          <span>{new Date(currentChapter.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="lumora-reader__divider" />
        <article className="lumora-reader__article">
          {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </article>
        <div className="lumora-reader__chapter-end">
          <span>END OF CHAPTER {currentChapter.chapterNumber}</span>
        </div>
      </section>

      <nav className="lumora-reader__navigation">
        {previousChapter ? <Link to={`/read/${storyId}/${previousChapter._id}`} className="lumora-reader__nav-button"><FaChevronLeft size={11} /><span><small>Previous chapter</small>{previousChapter.title}</span></Link> : <span className="lumora-reader__nav-button lumora-reader__nav-button--disabled"><FaChevronLeft size={11} /><span><small>Previous chapter</small>First chapter</span></span>}
        <Link to={`/stories/${storyId}`} className="lumora-reader__chapter-list"><FaList size={13} />All chapters</Link>
        {nextChapter ? <Link to={`/read/${storyId}/${nextChapter._id}`} className="lumora-reader__nav-button lumora-reader__nav-button--next"><span><small>Next chapter</small>{nextChapter.title}</span><FaChevronRight size={11} /></Link> : <span className="lumora-reader__nav-button lumora-reader__nav-button--disabled lumora-reader__nav-button--next"><span><small>Next chapter</small>End of story</span><FaChevronRight size={11} /></span>}
      </nav>
    </main>
  );
}

export default ReadChapter;
