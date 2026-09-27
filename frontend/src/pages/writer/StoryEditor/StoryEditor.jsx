import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Save,
  Eye,
  Settings,
  ChevronDown,
  Check,
  Plus,
  X,
} from "lucide-react";

import storyService from "../../../services/stories/storyService";
import chapterService from "../../../services/chapters/chapterService";

import "./StoryEditor.css";

function StoryEditor() {
  const { storyId } = useParams();

  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [activeChapter, setActiveChapter] = useState(null);

  const [chapterTitle, setChapterTitle] = useState("");
  const [content, setContent] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublishingStory, setIsPublishingStory] = useState(false);

  const [isSaved, setIsSaved] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD STORY
  // ==========================================

  useEffect(() => {
    const loadEditor = async () => {
      try {
        setIsLoading(true);
        setError("");

        const storyResponse =
          await storyService.getMyStoryById(storyId);

        const storyResponseData =
          storyResponse?.data || storyResponse;

        const loadedStory =
          storyResponseData?.story || storyResponseData;

        if (!loadedStory?._id) {
          throw new Error("Story could not be loaded.");
        }

        setStory(loadedStory);

        // Load chapters separately.
        try {
          const chaptersResponse =
            await chapterService.getChaptersByStory(storyId);

          const chaptersResponseData =
            chaptersResponse?.data || chaptersResponse;

          const loadedChapters =
            chaptersResponseData?.chapters ||
            chaptersResponseData ||
            [];

          const validChapters = Array.isArray(loadedChapters)
            ? loadedChapters
            : [];

          setChapters(validChapters);

          if (validChapters.length > 0) {
            const firstChapter = validChapters[0];

            setActiveChapter(firstChapter);
            setChapterTitle(firstChapter.title || "");
            setContent(firstChapter.content || "");
            setIsSaved(true);
          }
        } catch (chapterError) {
          console.error(
            "Failed to load chapters:",
            chapterError
          );

          // Story can still be opened even if there
          // are currently no readable/published chapters.
          setChapters([]);
        }
      } catch (requestError) {
        console.error(
          "Failed to load story editor:",
          requestError
        );

        setError(
          requestError.response?.data?.message ||
            requestError.message ||
            "Unable to load story."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (storyId) {
      loadEditor();
    }
  }, [storyId]);

  // ==========================================
  // SELECT CHAPTER
  // ==========================================

  const handleSelectChapter = async (chapter) => {
    try {
      setError("");

      // If content is already available, use it.
      if (chapter.content !== undefined) {
        setActiveChapter(chapter);
        setChapterTitle(chapter.title || "");
        setContent(chapter.content || "");
        setIsSaved(true);
        return;
      }

      // Otherwise fetch the complete chapter.
      const response =
        await chapterService.getChapterById(
          chapter._id
        );

      const responseData =
        response?.data || response;

      const loadedChapter =
        responseData?.chapter || responseData;

      setActiveChapter(loadedChapter);
      setChapterTitle(loadedChapter.title || "");
      setContent(loadedChapter.content || "");
      setIsSaved(true);
    } catch (requestError) {
      console.error(
        "Failed to load chapter:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          "Unable to load chapter."
      );
    }
  };

  // ==========================================
  // CREATE CHAPTER
  // ==========================================

  const handleCreateChapter = async () => {
    if (!storyId) {
      setError("Story ID is missing.");
      return;
    }

    try {
      setIsCreating(true);
      setError("");

      const nextNumber =
        chapters.length > 0
          ? Math.max(
              ...chapters.map(
                (chapter) =>
                  Number(chapter.chapterNumber) || 0
              )
            ) + 1
          : 1;

      const response =
        await chapterService.createChapter({
          story: storyId,
          title: `Chapter ${nextNumber}`,
        });

      const responseData =
        response?.data || response;

      const newChapter =
        responseData?.chapter || responseData;

      if (!newChapter?._id) {
        throw new Error(
          "Chapter was created but no chapter ID was returned."
        );
      }

      setChapters((current) => [
        ...current,
        newChapter,
      ]);

      setActiveChapter(newChapter);
      setChapterTitle(newChapter.title || "");
      setContent(newChapter.content || "");
      setIsSaved(true);
    } catch (requestError) {
      console.error(
        "Failed to create chapter:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to create chapter."
      );
    } finally {
      setIsCreating(false);
    }
  };

  // ==========================================
  // TITLE CHANGE
  // ==========================================

  const handleChapterTitleChange = (event) => {
    setChapterTitle(event.target.value);
    setIsSaved(false);
  };

  // ==========================================
  // CONTENT CHANGE
  // ==========================================

  const handleContentChange = (event) => {
    setContent(event.target.value);
    setIsSaved(false);
  };

  // ==========================================
  // SAVE CHAPTER
  // ==========================================

  const handleSave = async () => {
    if (!activeChapter?._id) {
      setError(
        "Please create or select a chapter first."
      );
      return false;
    }

    if (!chapterTitle.trim()) {
      setError("Chapter title is required.");
      return false;
    }

    try {
      setIsSaving(true);
      setError("");

      const response =
        await chapterService.updateChapter(
          activeChapter._id,
          {
            title: chapterTitle.trim(),
            content,
          }
        );

      const responseData =
        response?.data || response;

      const updatedChapter =
        responseData?.chapter || responseData;

      const updated = {
        ...activeChapter,
        ...(updatedChapter || {}),
        title: chapterTitle.trim(),
        content,
      };

      setActiveChapter(updated);

      setChapters((current) =>
        current.map((chapter) =>
          chapter._id === activeChapter._id
            ? updated
            : chapter
        )
      );

      setIsSaved(true);

      return true;
    } catch (requestError) {
      console.error(
        "Failed to save chapter:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to save chapter."
      );

      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // ==========================================
  // PUBLISH CHAPTER
  // ==========================================

  const handlePublish = async () => {
    if (!activeChapter?._id) {
      setError(
        "Please create or select a chapter first."
      );
      return;
    }

    try {
      setError("");

      // Save unsaved changes first.
      if (!isSaved) {
        const saved = await handleSave();

        if (!saved) {
          return;
        }
      }

      setIsPublishing(true);

      const response =
        await chapterService.publishChapter(
          activeChapter._id
        );

      const responseData =
        response?.data || response;

      const publishedChapter =
        responseData?.chapter || responseData;

      const updatedChapter = {
        ...activeChapter,
        ...(publishedChapter || {}),
        status: "published",
      };

      setActiveChapter(updatedChapter);

      setChapters((current) =>
        current.map((chapter) =>
          chapter._id === activeChapter._id
            ? updatedChapter
            : chapter
        )
      );

      setIsSaved(true);
    } catch (requestError) {
      console.error(
        "Failed to publish chapter:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to publish chapter."
      );
    } finally {
      setIsPublishing(false);
    }
  };

  // ==========================================
// PUBLISH STORY
// ==========================================

const handlePublishStory = async () => {
  if (!storyId) {
    setError("Story ID is missing.");
    return;
  }

  try {
    setIsPublishingStory(true);
    setError("");

    const response = await storyService.publishStory(storyId);

    const responseData =
      response?.data || response;

    const publishedStory =
      responseData?.story || responseData;

    setStory((current) => ({
      ...current,
      ...(publishedStory || {}),
      status: "Published",
    }));
  } catch (requestError) {
    console.error(
      "Failed to publish story:",
      requestError
    );

    setError(
      requestError.response?.data?.message ||
        requestError.message ||
        "Unable to publish story."
    );
  } finally {
    setIsPublishingStory(false);
  }
};

  // ==========================================
  // COUNTERS
  // ==========================================

  const wordCount = useMemo(() => {
    return content.trim()
      ? content.trim().split(/\s+/).length
      : 0;
  }, [content]);

  const characterCount = content.length;

  // ==========================================
  // LOADING
  // ==========================================

  if (isLoading) {
    return (
      <div className="story-editor-page">
        <div className="editor-loading">
          Loading story editor...
        </div>
      </div>
    );
  }

  // ==========================================
  // STORY NOT FOUND
  // ==========================================

  if (!story) {
    return (
      <div className="story-editor-page">
        <div className="editor-loading">
          <p>
            {error || "Story is not available."}
          </p>

          <Link
            to="/my-stories"
            className="editor-back"
          >
            <ArrowLeft size={16} />
            <span>Back to My Stories</span>
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="story-editor-page">

      {/* ======================================
          TOP BAR
      ====================================== */}

      <header className="editor-topbar">

        <div className="editor-top-left">

          <Link
            to="/writer/dashboard"
            className="editor-back"
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>

          <div className="editor-divider" />

          <div className="editor-story-info">
            <BookOpen size={17} />
            <span>{story.title}</span>
          </div>

        </div>

        <div className="editor-top-right">

          <div className="save-status">
            <span
              className={`save-status-dot ${
                isSaved
                  ? "saved"
                  : "unsaved"
              }`}
            />

            {isSaved
              ? "Saved"
              : "Unsaved changes"}
          </div>

          <button
            type="button"
            className="editor-icon-button"
            onClick={() =>
              setShowPreview(true)
            }
            title="Preview"
            disabled={!activeChapter}
          >
            <Eye size={17} />
          </button>

          <button
            type="button"
            className="editor-icon-button"
            onClick={() =>
              setShowSettings(!showSettings)
            }
            title="Settings"
          >
            <Settings size={17} />
          </button>

          <button
            type="button"
            className="editor-save-button"
            onClick={handleSave}
            disabled={
              isSaving ||
              !activeChapter
            }
          >
            <Save size={15} />

            {isSaving
              ? "Saving..."
              : "Save"}
          </button>

          <button
  type="button"
  className="editor-publish-button"
  onClick={handlePublishStory}
  disabled={isPublishingStory}
>
  {isPublishingStory
    ? "Publishing..."
    : "Publish"}
</button>

        </div>

      </header>

      {/* ======================================
          MAIN
      ====================================== */}

      <main className="story-editor-main">

        {error && (
          <div
            className="editor-error"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="editor-layout">

          {/* ==================================
              LEFT SIDEBAR
          ================================== */}

          <aside className="editor-sidebar">

            <div className="sidebar-section">

              <span className="sidebar-label">
                STORY
              </span>

              <div className="sidebar-story-title">
                <BookOpen size={16} />
                <span>{story.title}</span>
              </div>

            </div>

            <div className="sidebar-section">

              <div className="sidebar-section-header">

                <span className="sidebar-label">
                  CHAPTERS
                </span>

                <button
                  type="button"
                  className="chapter-add"
                  onClick={
                    handleCreateChapter
                  }
                  disabled={isCreating}
                  title="Add chapter"
                >
                  {isCreating ? (
                    "..."
                  ) : (
                    <Plus size={15} />
                  )}
                </button>

              </div>

              {chapters.length === 0 ? (
                <div className="empty-chapters">

                  <p>
                    No chapters yet.
                  </p>

                  <button
                    type="button"
                    onClick={
                      handleCreateChapter
                    }
                    disabled={isCreating}
                  >
                    {isCreating
                      ? "Creating..."
                      : "Create Chapter"}
                  </button>

                </div>
              ) : (
                chapters.map((chapter) => (

                  <button
                    key={chapter._id}
                    type="button"
                    className={
                      activeChapter?._id ===
                      chapter._id
                        ? "chapter-item active"
                        : "chapter-item"
                    }
                    onClick={() =>
                      handleSelectChapter(
                        chapter
                      )
                    }
                  >

                    <span className="chapter-number">
                      {String(
                        chapter.chapterNumber ||
                          1
                      ).padStart(2, "0")}
                    </span>

                    <span className="chapter-name">
                      {chapter.title}
                    </span>

                  </button>

                ))
              )}

            </div>

            <div className="sidebar-bottom">

              <button
                type="button"
                className="sidebar-settings"
                onClick={() =>
                  setShowSettings(
                    !showSettings
                  )
                }
              >
                <Settings size={16} />
                <span>
                  Chapter settings
                </span>
              </button>

            </div>

          </aside>

          {/* ==================================
              CENTER EDITOR
          ================================== */}

          <section className="editor-workspace">

            {!activeChapter ? (

              <div className="editor-empty-state">

                <BookOpen size={32} />

                <h2>
                  Create your first chapter
                </h2>

                <p>
                  Start writing your story
                  by creating a chapter.
                </p>

                <button
                  type="button"
                  onClick={
                    handleCreateChapter
                  }
                  disabled={isCreating}
                >
                  {isCreating
                    ? "Creating..."
                    : "Create Chapter"}
                </button>

              </div>

            ) : (

              <>

                <div className="chapter-heading">

                  <span className="editor-eyebrow">
                    EDITING CHAPTER{" "}
                    {String(
                      activeChapter.chapterNumber ||
                        1
                    ).padStart(2, "0")}
                  </span>

                  <input
                    type="text"
                    value={chapterTitle}
                    onChange={
                      handleChapterTitleChange
                    }
                    className="chapter-title-input"
                    aria-label="Chapter title"
                    placeholder="Chapter title"
                  />

                  <div className="chapter-meta">

                    <span>
                      {wordCount} words
                    </span>

                    <span>•</span>

                    <span>
                      {characterCount} characters
                    </span>

                  </div>

                </div>

                <div className="editor-paper">

                  <textarea
                    value={content}
                    onChange={
                      handleContentChange
                    }
                    className="story-content-editor"
                    spellCheck="true"
                    aria-label="Story content"
                    placeholder="Start writing your chapter..."
                  />

                </div>

                <div className="editor-bottom-bar">

                  <div className="editor-stats">

                    <span>
                      {wordCount} words
                    </span>

                    <span>•</span>

                    <span>
                      {activeChapter.status ===
                      "published"
                        ? "Published"
                        : "Draft"}
                    </span>

                  </div>

                  <div className="editor-actions">

                    <button
                      type="button"
                      className="secondary-editor-button"
                      onClick={handleSave}
                      disabled={
                        isSaving ||
                        !activeChapter
                      }
                    >
                      <Check size={15} />

                      {isSaving
                        ? "Saving..."
                        : "Save draft"}
                    </button>

                    <button
                      type="button"
                      className="primary-editor-button"
                      onClick={
                        handlePublish
                      }
                      disabled={
                        isPublishing ||
                        !activeChapter
                      }
                    >
                      {isPublishing
                        ? "Publishing..."
                        : "Publish chapter"}
                    </button>

                  </div>

                </div>

              </>

            )}

          </section>

          {/* ==================================
              RIGHT PANEL
          ================================== */}

          <aside className="editor-right-panel">

            <div className="editor-panel-card">

              <div className="panel-heading">

                <div>

                  <span className="panel-eyebrow">
                    CHAPTER
                  </span>

                  <h3>
                    Publishing
                  </h3>

                </div>

                <ChevronDown size={16} />

              </div>

              <div className="panel-field">

                <label>
                  Status
                </label>

                <div className="panel-select">

                  <span>
                    {activeChapter?.status ===
                    "published"
                      ? "Published"
                      : "Draft"}
                  </span>

                  <ChevronDown size={14} />

                </div>

              </div>

              <div className="panel-field">

                <label>
                  Chapter number
                </label>

                <input
                  type="text"
                  value={
                    activeChapter?.chapterNumber ||
                    ""
                  }
                  readOnly
                />

              </div>

            </div>

            <div className="editor-panel-card">

              <div className="panel-heading">

                <div>

                  <span className="panel-eyebrow">
                    READING
                  </span>

                  <h3>
                    Reader preview
                  </h3>

                </div>

              </div>

              <div className="reader-preview">

                <div className="reader-preview-icon">
                  <BookOpen size={18} />
                </div>

                <strong>
                  {chapterTitle ||
                    "Untitled Chapter"}
                </strong>

                <span>
                  See how your chapter will
                  appear to readers.
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setShowPreview(true)
                  }
                  disabled={!activeChapter}
                >
                  Preview chapter
                  <Eye size={14} />
                </button>

              </div>

            </div>

            <div className="editor-panel-card editor-tip-card">

              <span className="panel-eyebrow">
                WRITING TIP
              </span>

              <h3>
                Keep readers curious.
              </h3>

              <p>
                End chapters with a question,
                discovery, or moment that makes
                readers want to continue.
              </p>

            </div>

          </aside>

        </div>

      </main>

      {/* ======================================
          PREVIEW MODAL
      ====================================== */}

      {showPreview &&
        activeChapter && (

          <div
            className="editor-modal-overlay"
            onClick={() =>
              setShowPreview(false)
            }
          >

            <div
              className="editor-preview-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="preview-modal-header">

                <div>

                  <span className="panel-eyebrow">
                    READER PREVIEW
                  </span>

                  <h2>
                    {chapterTitle}
                  </h2>

                </div>

                <button
                  type="button"
                  className="preview-close"
                  onClick={() =>
                    setShowPreview(false)
                  }
                >
                  <X size={18} />
                </button>

              </div>

              <article className="preview-story-content">

                {content
                  .split("\n\n")
                  .filter(Boolean)
                  .map(
                    (paragraph, index) => (
                      <p key={index}>
                        {paragraph}
                      </p>
                    )
                  )}

              </article>

            </div>

          </div>

        )}

      {/* ======================================
          SETTINGS
      ====================================== */}

      {showSettings && (

        <div className="editor-settings-panel">

          <div className="settings-panel-header">

            <div>

              <span className="panel-eyebrow">
                SETTINGS
              </span>

              <h3>
                Chapter settings
              </h3>

            </div>

            <button
              type="button"
              onClick={() =>
                setShowSettings(false)
              }
            >
              <X size={18} />
            </button>

          </div>

          <div className="settings-option">

            <div>

              <strong>
                Allow comments
              </strong>

              <span>
                Let readers comment on this
                chapter.
              </span>

            </div>

            <input
              type="checkbox"
              defaultChecked
            />

          </div>

          <div className="settings-option">

            <div>

              <strong>
                Show chapter publicly
              </strong>

              <span>
                Make this chapter visible to
                readers.
              </span>

            </div>

            <input
              type="checkbox"
              defaultChecked
            />

          </div>

        </div>

      )}

    </div>
  );
}

export default StoryEditor;