import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import {
  FaArrowRight,
  FaBookmark,
  FaBookOpen,
  FaEye,
  FaHeart,
  FaRegBookmark,
} from "react-icons/fa6";

import "./StoryDetails.css";

import storyService from "../../../services/stories/storyService";
import bookmarkService from "../../../services/bookmarks/bookmarkService";
import commentService from "../../../services/comments/commentService";
import useAuth from "../../../context/AuthContext/useAuth";


// =====================================================
// STORY COVER
// =====================================================

function StoryCover({ story }) {
  return (
    <div className="lumora-story-details__cover">

      {story?.coverImage ? (
        <img
          src={story.coverImage}
          alt={story.title || "Story cover"}
        />
      ) : (
        <div className="lumora-story-details__cover-placeholder">
          <FaBookOpen size={30} />

          <span>
            {story?.category || "Story"}
          </span>
        </div>
      )}

    </div>
  );
}


// =====================================================
// STORY DETAILS
// =====================================================

function StoryDetails() {
  const { storyId } = useParams();

  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();


  // =====================================================
  // STORY STATE
  // =====================================================

  const [story, setStory] =
    useState(null);

  const [chapters, setChapters] =
    useState([]);

  const [isBookmarked, setIsBookmarked] =
    useState(false);

  const [isLiked, setIsLiked] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =====================================================
  // COMMENT STATE
  // =====================================================

  const [comments, setComments] =
    useState([]);

  const [commentText, setCommentText] =
    useState("");

  const [commentsLoading, setCommentsLoading] =
    useState(false);

  const [commentSubmitting, setCommentSubmitting] =
    useState(false);


  // =====================================================
  // COMMENT LIKE
  // =====================================================

  const [commentLikes, setCommentLikes] =
    useState({});

  const [commentLikeLoading, setCommentLikeLoading] =
    useState({});


  // =====================================================
  // REPLY STATE
  // =====================================================

  const [replyText, setReplyText] =
    useState({});

  const [replies, setReplies] =
    useState({});

  const [repliesLoading, setRepliesLoading] =
    useState({});

  const [replySubmitting, setReplySubmitting] =
    useState({});


  // =====================================================
  // COMMENT EDIT
  // =====================================================

  const [editingCommentId, setEditingCommentId] =
    useState(null);

  const [editCommentText, setEditCommentText] =
    useState("");

  const [editSubmitting, setEditSubmitting] =
    useState({});


  // =====================================================
  // COMMENT DELETE
  // =====================================================

  const [deleteLoading, setDeleteLoading] =
    useState({});


  // =====================================================
  // REPLY LIKE
  // =====================================================

  const [replyLikes, setReplyLikes] =
    useState({});

  const [replyLikeLoading, setReplyLikeLoading] =
    useState({});


  // =====================================================
  // REPLY EDIT
  // =====================================================

  const [replyEditingId, setReplyEditingId] =
    useState(null);

  const [replyEditText, setReplyEditText] =
    useState("");

  const [replyEditLoading, setReplyEditLoading] =
    useState({});


  // =====================================================
  // REPLY DELETE
  // =====================================================

  const [replyDeleteLoading, setReplyDeleteLoading] =
    useState({});


  // =====================================================
  // CHECK VALID MONGODB STORY ID
  // =====================================================

  const isApiStory =
    /^[a-f\d]{24}$/i.test(
      storyId || ""
    );


  // =====================================================
  // LOAD STORY
  // =====================================================

  useEffect(() => {

    if (!isApiStory) {
      return;
    }


    const loadStory = async () => {

      setIsLoading(true);

      setError("");


      try {

        // =================================================
        // LOAD STORY
        // =================================================

        const response =
          await storyService.getStoryById(
            storyId
          );


        const apiStory =
          response.story;


        if (!apiStory) {
          throw new Error(
            "Story not found."
          );
        }


        setStory({
          ...apiStory,

          description:
            apiStory.shortDescription ||
            "",

          author:
            apiStory.author?.username ||
            "Unknown Writer",

          authorId:
            apiStory.author?._id ||
            "",

          likes:
            Array.isArray(apiStory.likes)
              ? apiStory.likes.length
              : apiStory.likes || 0,

          views:
            apiStory.views || 0,

          updated:
            apiStory.updatedAt
              ? new Date(
                  apiStory.updatedAt
                ).toLocaleDateString()
              : "",
        });


        // =================================================
        // LOAD CHAPTERS
        // =================================================

        setChapters(
          response.chapters || []
        );


        // =================================================
        // LOAD COMMENTS
        // =================================================

        setCommentsLoading(true);


        try {

          const commentsResponse =
            await commentService.getStoryComments(
              storyId
            );


          setComments(
            commentsResponse.comments || []
          );

        } catch (commentError) {

          console.error(
            "Load comments error:",
            commentError
          );

          setComments([]);

        } finally {

          setCommentsLoading(false);

        }


        // =================================================
        // BOOKMARK + LIKE STATUS
        // =================================================

        if (isAuthenticated) {

          try {

            const [
              bookmarkResponse,
              likeResponse,
            ] = await Promise.all([

              bookmarkService.checkBookmark(
                storyId
              ),

              storyService.checkLike(
                storyId
              ),

            ]);


            setIsBookmarked(
              !!bookmarkResponse?.bookmarked
            );


            setIsLiked(
              !!likeResponse?.liked
            );

          } catch (statusError) {

            console.error(
              "Load story status error:",
              statusError
            );

          }

        }

      } catch (requestError) {

        console.error(
          "Load story error:",
          requestError
        );


        setError(
          requestError.response?.data?.message ||
          requestError.message ||
          "Unable to load this story."
        );

      } finally {

        setIsLoading(false);

      }

    };


    loadStory();

  }, [
    isApiStory,
    isAuthenticated,
    storyId,
  ]);


  // =====================================================
  // LOGIN
  // =====================================================

  const requireLogin = () => {

    navigate("/login", {
      state: {
        from: {
          pathname: `/stories/${storyId}`,
        },
      },
    });

  };

    // =====================================================
  // BOOKMARK
  // =====================================================

  const toggleBookmark = async () => {

    if (!isAuthenticated) {
      requireLogin();
      return;
    }

    try {

      setError("");

      if (isBookmarked) {

        await bookmarkService.removeBookmark(
          storyId
        );

        setIsBookmarked(false);

      } else {

        await bookmarkService.addBookmark(
          storyId
        );

        setIsBookmarked(true);

      }

    } catch (requestError) {

      console.error(
        "Bookmark error:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
        "Unable to update bookmark."
      );

    }
  };


  // =====================================================
  // STORY LIKE
  // =====================================================

  const toggleLike = async () => {

    if (!isAuthenticated) {
      requireLogin();
      return;
    }

    try {

      setError("");

      const response = isLiked
        ? await storyService.removeLike(
            storyId
          )
        : await storyService.likeStory(
            storyId
          );


      setIsLiked(
        (current) => !current
      );


      setStory(
        (current) => {

          if (!current) {
            return current;
          }

          return {
            ...current,
            likes:
              response?.totalLikes ??
              current.likes ??
              0,
          };

        }
      );

    } catch (requestError) {

      console.error(
        "Story like error:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
        "Unable to update story like."
      );

    }
  };


  // =====================================================
  // ADD COMMENT
  // =====================================================

  const handleAddComment = async (
    event
  ) => {

    event.preventDefault();


    if (!isAuthenticated) {
      requireLogin();
      return;
    }


    const content =
      commentText.trim();


    if (!content) {
      return;
    }


    try {

      setCommentSubmitting(true);

      setError("");


      const response =
        await commentService.createComment(
          storyId,
          content
        );


      if (response?.comment) {

        setComments(
          (current) => [
            response.comment,
            ...current,
          ]
        );

      }


      setCommentText("");

    } catch (requestError) {

      console.error(
        "Add comment error:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
        "Unable to add comment."
      );

    } finally {

      setCommentSubmitting(false);

    }
  };


  // =====================================================
  // COMMENT LIKE
  // =====================================================

  const toggleCommentLike = async (
    commentId
  ) => {

    if (!isAuthenticated) {
      requireLogin();
      return;
    }


    try {

      setCommentLikeLoading(
        (current) => ({
          ...current,
          [commentId]: true,
        })
      );


      setError("");


      const currentlyLiked =
        !!commentLikes[commentId];


      const response =
        currentlyLiked
          ? await commentService.removeLike(
              commentId
            )
          : await commentService.likeComment(
              commentId
            );


      setCommentLikes(
        (current) => ({
          ...current,
          [commentId]:
            !currentlyLiked,
        })
      );


      setComments(
        (currentComments) =>
          currentComments.map(
            (comment) => {

              if (
                comment._id !==
                commentId
              ) {
                return comment;
              }


              return {
                ...comment,

                likes:
                  response?.totalLikes ??
                  (
                    Array.isArray(
                      comment.likes
                    )
                      ? comment.likes.length
                      : comment.likes || 0
                  ),
              };

            }
          )
      );

    } catch (requestError) {

      console.error(
        "Comment like error:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
        "Unable to update comment like."
      );

    } finally {

      setCommentLikeLoading(
        (current) => ({
          ...current,
          [commentId]: false,
        })
      );

    }
  };


  // =====================================================
  // LOAD / HIDE REPLIES
  // =====================================================

  const toggleReplies = async (
    commentId
  ) => {

    // -----------------------------------------------
    // IF ALREADY OPEN → HIDE
    // -----------------------------------------------

    if (
      Object.prototype.hasOwnProperty.call(
        replies,
        commentId
      )
    ) {

      setReplies(
        (current) => {

          const updated = {
            ...current,
          };

          delete updated[commentId];

          return updated;

        }
      );

      return;
    }


    // -----------------------------------------------
    // LOAD REPLIES
    // -----------------------------------------------

    try {

      setRepliesLoading(
        (current) => ({
          ...current,
          [commentId]: true,
        })
      );


      setError("");


      const response =
        await commentService.getReplies(
          commentId
        );


      const loadedReplies =
        response?.replies || [];


      setReplies(
        (current) => ({
          ...current,
          [commentId]:
            loadedReplies,
        })
      );


      // ---------------------------------------------
      // INITIALIZE REPLY LIKE STATES
      // ---------------------------------------------

      const initialLikes = {};


      loadedReplies.forEach(
        (reply) => {

          initialLikes[
            reply._id
          ] = false;

        }
      );


      setReplyLikes(
        (current) => ({
          ...initialLikes,
          ...current,
        })
      );

    } catch (requestError) {

      console.error(
        "Load replies error:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
        "Unable to load replies."
      );

    } finally {

      setRepliesLoading(
        (current) => ({
          ...current,
          [commentId]: false,
        })
      );

    }
  };


  // =====================================================
  // ADD REPLY
  // =====================================================

  const handleReply = async (
    commentId
  ) => {

    if (!isAuthenticated) {
      requireLogin();
      return;
    }


    const content =
      (
        replyText[commentId] ||
        ""
      ).trim();


    if (!content) {
      return;
    }


    try {

      setReplySubmitting(
        (current) => ({
          ...current,
          [commentId]: true,
        })
      );


      setError("");


      const response =
        await commentService.replyToComment(
          commentId,
          content
        );


      if (response?.reply) {

        setReplies(
          (current) => ({
            ...current,

            [commentId]: [
              ...(current[commentId] || []),
              response.reply,
            ],

          })
        );


        setComments(
          (currentComments) =>
            currentComments.map(
              (comment) => {

                if (
                  comment._id !==
                  commentId
                ) {
                  return comment;
                }


                return {
                  ...comment,

                  replyCount:
                    (
                      comment.replyCount ||
                      0
                    ) + 1,

                };

              }
            )
        );


        setReplyLikes(
          (current) => ({
            ...current,

            [response.reply._id]:
              false,

          })
        );

      }


      setReplyText(
        (current) => ({
          ...current,
          [commentId]: "",
        })
      );

    } catch (requestError) {

      console.error(
        "Add reply error:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
        "Unable to add reply."
      );

    } finally {

      setReplySubmitting(
        (current) => ({
          ...current,
          [commentId]: false,
        })
      );

    }
  };


  // =====================================================
  // REPLY LIKE
  // =====================================================

  const toggleReplyLike = async (
    replyId
  ) => {

    if (!isAuthenticated) {
      requireLogin();
      return;
    }


    try {

      setReplyLikeLoading(
        (current) => ({
          ...current,
          [replyId]: true,
        })
      );


      setError("");


      const currentlyLiked =
        !!replyLikes[replyId];


      const response =
        currentlyLiked
          ? await commentService.removeLike(
              replyId
            )
          : await commentService.likeComment(
              replyId
            );


      setReplyLikes(
        (current) => ({
          ...current,
          [replyId]:
            !currentlyLiked,
        })
      );


      // ---------------------------------------------
      // UPDATE REPLY LIKE COUNT
      // ---------------------------------------------

      setReplies(
        (current) => {

          const updated = {
            ...current,
          };


          Object.keys(updated).forEach(
            (commentId) => {

              updated[commentId] =
                (
                  updated[commentId] || []
                ).map(
                  (reply) => {

                    if (
                      reply._id !==
                      replyId
                    ) {
                      return reply;
                    }


                    return {
                      ...reply,

                      likes:
                        response?.totalLikes ??
                        (
                          Array.isArray(
                            reply.likes
                          )
                            ? reply.likes.length
                            : reply.likes || 0
                        ),
                    };

                  }
                );

            }
          );


          return updated;

        }
      );

    } catch (requestError) {

      console.error(
        "Reply like error:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
        "Unable to update reply like."
      );

    } finally {

      setReplyLikeLoading(
        (current) => ({
          ...current,
          [replyId]: false,
        })
      );

    }
  };

    // =====================================================
  // START EDIT COMMENT
  // =====================================================

  const startEditingComment = (comment) => {
    setEditingCommentId(comment._id);

    setEditCommentText(
      comment.content || ""
    );
  };


  // =====================================================
  // CANCEL EDIT COMMENT
  // =====================================================

  const cancelEditingComment = () => {
    setEditingCommentId(null);

    setEditCommentText("");
  };


  // =====================================================
  // SAVE EDITED COMMENT
  // =====================================================

  const saveEditedComment = async (
    commentId
  ) => {

    const content =
      editCommentText.trim();


    if (!content) {
      return;
    }


    try {

      setEditSubmitting(
        (current) => ({
          ...current,
          [commentId]: true,
        })
      );


      setError("");


      const response =
        await commentService.updateComment(
          commentId,
          content
        );


      if (response?.comment) {

        setComments(
          (currentComments) =>
            currentComments.map(
              (comment) =>
                comment._id ===
                commentId
                  ? response.comment
                  : comment
            )
        );

      }


      cancelEditingComment();

    } catch (requestError) {

      console.error(
        "Edit comment error:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
        "Unable to edit comment."
      );

    } finally {

      setEditSubmitting(
        (current) => ({
          ...current,
          [commentId]: false,
        })
      );

    }
  };


  // =====================================================
  // DELETE COMMENT
  // =====================================================

  const handleDeleteComment = async (
    commentId
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this comment?"
      );


    if (!confirmed) {
      return;
    }


    try {

      setDeleteLoading(
        (current) => ({
          ...current,
          [commentId]: true,
        })
      );


      setError("");


      await commentService.deleteComment(
        commentId
      );


      // -----------------------------------------------
      // REMOVE COMMENT
      // -----------------------------------------------

      setComments(
        (currentComments) =>
          currentComments.filter(
            (comment) =>
              comment._id !==
              commentId
          )
      );


      // -----------------------------------------------
      // REMOVE LOADED REPLIES
      // -----------------------------------------------

      setReplies(
        (current) => {

          const updated = {
            ...current,
          };

          delete updated[commentId];

          return updated;

        }
      );


      // -----------------------------------------------
      // REMOVE REPLY TEXT
      // -----------------------------------------------

      setReplyText(
        (current) => {

          const updated = {
            ...current,
          };

          delete updated[commentId];

          return updated;

        }
      );


      // -----------------------------------------------
      // CANCEL EDIT IF ACTIVE
      // -----------------------------------------------

      if (
        editingCommentId ===
        commentId
      ) {
        cancelEditingComment();
      }

    } catch (requestError) {

      console.error(
        "Delete comment error:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
        "Unable to delete comment."
      );

    } finally {

      setDeleteLoading(
        (current) => ({
          ...current,
          [commentId]: false,
        })
      );

    }
  };


  // =====================================================
  // START EDIT REPLY
  // =====================================================

  const startEditingReply = (
    reply
  ) => {

    setReplyEditingId(
      reply._id
    );

    setReplyEditText(
      reply.content || ""
    );

  };


  // =====================================================
  // CANCEL EDIT REPLY
  // =====================================================

  const cancelEditingReply = () => {

    setReplyEditingId(null);

    setReplyEditText("");

  };


  // =====================================================
  // SAVE EDITED REPLY
  // =====================================================

  const saveEditedReply = async (
    replyId
  ) => {

    const content =
      replyEditText.trim();


    if (!content) {
      return;
    }


    try {

      setReplyEditLoading(
        (current) => ({
          ...current,
          [replyId]: true,
        })
      );


      setError("");


      const response =
        await commentService.updateComment(
          replyId,
          content
        );


      if (response?.comment) {

        setReplies(
          (current) => {

            const updated = {
              ...current,
            };


            Object.keys(
              updated
            ).forEach(
              (commentId) => {

                updated[commentId] =
                  (
                    updated[commentId] ||
                    []
                  ).map(
                    (reply) =>
                      reply._id ===
                      replyId
                        ? response.comment
                        : reply
                  );

              }
            );


            return updated;

          }
        );

      }


      cancelEditingReply();

    } catch (requestError) {

      console.error(
        "Edit reply error:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
        "Unable to edit reply."
      );

    } finally {

      setReplyEditLoading(
        (current) => ({
          ...current,
          [replyId]: false,
        })
      );

    }
  };


  // =====================================================
  // DELETE REPLY
  // =====================================================

  const handleDeleteReply = async (
    replyId
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this reply?"
      );


    if (!confirmed) {
      return;
    }


    try {

      setReplyDeleteLoading(
        (current) => ({
          ...current,
          [replyId]: true,
        })
      );


      setError("");


      await commentService.deleteComment(
        replyId
      );


      // -----------------------------------------------
      // FIND PARENT COMMENT + REMOVE REPLY
      // -----------------------------------------------

      let parentCommentId =
        null;


      setReplies(
        (current) => {

          const updated = {
            ...current,
          };


          Object.keys(
            updated
          ).forEach(
            (commentId) => {

              const replyList =
                updated[commentId] || [];


              const exists =
                replyList.some(
                  (reply) =>
                    reply._id ===
                    replyId
                );


              if (exists) {

                parentCommentId =
                  commentId;


                updated[commentId] =
                  replyList.filter(
                    (reply) =>
                      reply._id !==
                      replyId
                  );

              }

            }
          );


          return updated;

        }
      );


      // -----------------------------------------------
      // REMOVE REPLY LIKE STATE
      // -----------------------------------------------

      setReplyLikes(
        (current) => {

          const updated = {
            ...current,
          };

          delete updated[replyId];

          return updated;

        }
      );


      // -----------------------------------------------
      // REMOVE REPLY TEXT STATE
      // -----------------------------------------------

      setReplyText(
        (current) => {

          const updated = {
            ...current,
          };

          delete updated[replyId];

          return updated;

        }
      );


      // -----------------------------------------------
      // UPDATE PARENT REPLY COUNT
      // -----------------------------------------------

      if (parentCommentId) {

        setComments(
          (currentComments) =>
            currentComments.map(
              (comment) =>
                comment._id ===
                parentCommentId
                  ? {
                      ...comment,

                      replyCount:
                        Math.max(
                          (
                            comment.replyCount ||
                            0
                          ) - 1,
                          0
                        ),
                    }
                  : comment
            )
        );

      }


      // -----------------------------------------------
      // CANCEL REPLY EDIT
      // -----------------------------------------------

      if (
        replyEditingId ===
        replyId
      ) {
        cancelEditingReply();
      }

    } catch (requestError) {

      console.error(
        "Delete reply error:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
        "Unable to delete reply."
      );

    } finally {

      setReplyDeleteLoading(
        (current) => ({
          ...current,
          [replyId]: false,
        })
      );

    }
  };

    // =====================================================
  // RENDER
  // =====================================================

  if (!isApiStory) {
    return (
      <main className="lumora-story-details">
        <div className="lumora-story-details__error">
          Invalid story ID.
        </div>
      </main>
    );
  }


  if (isLoading) {
    return (
      <main className="lumora-story-details">
        <div className="lumora-story-details__loading">
          Loading story...
        </div>
      </main>
    );
  }


  if (!story) {
    return (
      <main className="lumora-story-details">
        <div className="lumora-story-details__error">
          {error || "Story not found."}
        </div>
      </main>
    );
  }


  return (
    <main className="lumora-story-details">

      {/* =====================================================
          ERROR MESSAGE
      ===================================================== */}

      {error && (
        <div className="lumora-story-details__error-banner">
          {error}
        </div>
      )}


      {/* =====================================================
          STORY HERO
      ===================================================== */}

      <section className="lumora-story-details__hero">

        <div className="lumora-story-details__container">

          <div className="lumora-story-details__hero-grid">

            {/* COVER */}

            <StoryCover story={story} />


            {/* STORY INFORMATION */}

            <div className="lumora-story-details__hero-content">

              <span className="lumora-story-details__eyebrow">
                {story.category || "STORY"}
              </span>


              <h1>
                {story.title}
              </h1>


              {story.subtitle && (
                <p className="lumora-story-details__subtitle">
                  {story.subtitle}
                </p>
              )}


              <p className="lumora-story-details__description">
                {story.description ||
                  "No description available for this story."}
              </p>


              {/* AUTHOR */}

              <div className="lumora-story-details__story-author">

                <span>
                  Written by
                </span>

                <strong>
                  {story.author ||
                    "Unknown Writer"}
                </strong>

              </div>


              {/* STORY STATS */}

              <div className="lumora-story-details__stats">

                <span>
                  <FaEye size={12} />
                  {story.views || 0} views
                </span>


                <span>
                  <FaHeart size={12} />
                  {story.likes || 0} likes
                </span>


                <span>
                  <FaBookOpen size={12} />
                  {chapters.length}{" "}
                  {chapters.length === 1
                    ? "chapter"
                    : "chapters"}
                </span>

              </div>


              {/* ACTIONS */}

              <div className="lumora-story-details__actions">

                {chapters.length > 0 && (
                  <Link
                    to={`/read/${storyId}/${chapters[0]._id}`}
                    className="lumora-story-details__primary-button"
                  >
                    <FaBookOpen size={12} />
                    Start Reading
                  </Link>
                )}


                {/* LIKE */}

                <button
                  type="button"
                  className={`lumora-story-details__icon-button ${
                    isLiked
                      ? "lumora-story-details__icon-button--active"
                      : ""
                  }`}
                  onClick={toggleLike}
                  title={
                    isLiked
                      ? "Unlike story"
                      : "Like story"
                  }
                >
                  <FaHeart size={14} />
                </button>


                {/* BOOKMARK */}

                <button
                  type="button"
                  className={`lumora-story-details__icon-button ${
                    isBookmarked
                      ? "lumora-story-details__icon-button--active"
                      : ""
                  }`}
                  onClick={toggleBookmark}
                  title={
                    isBookmarked
                      ? "Remove bookmark"
                      : "Bookmark story"
                  }
                >
                  {isBookmarked ? (
                    <FaBookmark size={14} />
                  ) : (
                    <FaRegBookmark size={14} />
                  )}
                </button>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CHAPTERS
      ===================================================== */}

      <section className="lumora-story-details__chapters">

        <div className="lumora-story-details__container">

          <div className="lumora-story-details__section-header">

            <div>
              <span className="lumora-story-details__eyebrow">
                READ THE STORY
              </span>

              <h2>
                Chapters
              </h2>
            </div>


            <span className="lumora-story-details__chapter-count">
              {chapters.length}{" "}
              {chapters.length === 1
                ? "chapter"
                : "chapters"}
            </span>

          </div>


          {chapters.length === 0 ? (

            <div className="lumora-story-details__chapters-empty">

              <h3>
                No published chapters yet
              </h3>

              <p>
                The writer has not published
                any chapters for this story.
              </p>

            </div>

          ) : (

            <div className="lumora-story-details__chapter-list">

              {chapters.map(
                (chapter, index) => (

                  <Link
                    key={chapter._id}
                    to={`/read/${storyId}/${chapter._id}`}
                    className="lumora-story-details__chapter"
                  >

                    <div className="lumora-story-details__chapter-number">

                      {chapter.chapterNumber ||
                        index + 1}

                    </div>


                    <div className="lumora-story-details__chapter-info">

                      <h3>
                        {chapter.title ||
                          `Chapter ${
                            chapter.chapterNumber ||
                            index + 1
                          }`}
                      </h3>


                      <span>
                        {chapter.wordCount
                          ? `${chapter.wordCount} words`
                          : "Read chapter"}
                      </span>

                    </div>


                    <FaArrowRight
                      size={13}
                    />

                  </Link>

                )
              )}

            </div>

          )}

        </div>

      </section>


      {/* =====================================================
          COMMENTS
      ===================================================== */}

      <section className="lumora-story-details__comments">

        <div className="lumora-story-details__container">

          {/* COMMENTS HEADER */}

          <div className="lumora-story-details__section-header">

            <div>

              <span className="lumora-story-details__eyebrow">
                COMMUNITY
              </span>

              <h2>
                Comments
              </h2>

            </div>


            <span className="lumora-story-details__chapter-count">

              {comments.length}{" "}
              {comments.length === 1
                ? "comment"
                : "comments"}

            </span>

          </div>


          {/* =================================================
              ADD COMMENT
          ================================================= */}

          <form
            className="lumora-story-details__comment-form"
            onSubmit={handleAddComment}
          >

            <textarea
              value={commentText}
              onChange={(event) =>
                setCommentText(
                  event.target.value
                )
              }
              placeholder={
                isAuthenticated
                  ? "Share your thoughts about this story..."
                  : "Login to leave a comment..."
              }
              maxLength={1000}
              disabled={
                commentSubmitting
              }
            />


            <div className="lumora-story-details__comment-form-footer">

              <span>
                {commentText.length}/1000
              </span>


              <button
                type="submit"
                disabled={
                  commentSubmitting ||
                  !commentText.trim()
                }
              >
                {commentSubmitting
                  ? "Posting..."
                  : "Post Comment"}
              </button>

            </div>

          </form>


          {/* =================================================
              COMMENTS LIST
          ================================================= */}

          <div className="lumora-story-details__comments-list">

            {commentsLoading ? (

              <div className="lumora-story-details__comments-empty">

                <h3>
                  Loading comments...
                </h3>

              </div>

            ) : comments.length === 0 ? (

              <div className="lumora-story-details__comments-empty">

                <h3>
                  No comments yet
                </h3>

                <p>
                  Be the first reader to share
                  your thoughts.
                </p>

              </div>

            ) : (

              comments.map(
                (comment) => (

                  <article
                    key={comment._id}
                    className="lumora-story-details__comment"
                  >

                    {/* COMMENT AVATAR */}

                    <div className="lumora-story-details__comment-avatar">

                      {comment.user?.username
                        ?.split(" ")
                        .map(
                          (name) =>
                            name[0]
                        )
                        .join("")
                        .slice(0, 2)
                        .toUpperCase() ||
                        "U"}

                    </div>


                    <div className="lumora-story-details__comment-body">

                      {/* USER + DATE */}

                      <div className="lumora-story-details__comment-meta">

                        <strong>
                          {comment.user?.username ||
                            "Reader"}
                        </strong>

                        <span>
                          {comment.createdAt
                            ? new Date(
                                comment.createdAt
                              ).toLocaleDateString()
                            : ""}
                        </span>

                      </div>


                      {/* =================================================
                          EDIT COMMENT
                      ================================================= */}

                      {editingCommentId ===
                      comment._id ? (

                        <div className="lumora-story-details__comment-edit">

                          <textarea
                            value={
                              editCommentText
                            }
                            onChange={(event) =>
                              setEditCommentText(
                                event.target.value
                              )
                            }
                            maxLength={1000}
                            autoFocus
                          />


                          <div className="lumora-story-details__comment-edit-actions">

                            <button
                              type="button"
                              onClick={
                                cancelEditingComment
                              }
                            >
                              Cancel
                            </button>


                            <button
                              type="button"
                              onClick={() =>
                                saveEditedComment(
                                  comment._id
                                )
                              }
                              disabled={
                                editSubmitting[
                                  comment._id
                                ] ||
                                !editCommentText.trim()
                              }
                            >
                              {editSubmitting[
                                comment._id
                              ]
                                ? "Saving..."
                                : "Save"}
                            </button>

                          </div>

                        </div>

                      ) : (

                        <>

                          {/* COMMENT CONTENT */}

                          <p>
                            {comment.content}
                          </p>


                          {comment.isEdited && (
                            <span className="lumora-story-details__edited-label">
                              Edited
                            </span>
                          )}


                          {/* =================================================
                              COMMENT ACTIONS
                          ================================================= */}

                          <div className="lumora-story-details__comment-actions">

                            {/* LIKE */}

                            <button
                              type="button"
                              className={`lumora-story-details__comment-action ${
                                commentLikes[
                                  comment._id
                                ]
                                  ? "lumora-story-details__comment-action--liked"
                                  : ""
                              }`}
                              onClick={() =>
                                toggleCommentLike(
                                  comment._id
                                )
                              }
                              disabled={
                                commentLikeLoading[
                                  comment._id
                                ]
                              }
                            >

                              <FaHeart
                                size={12}
                              />

                              <span>
                                {Array.isArray(
                                  comment.likes
                                )
                                  ? comment.likes
                                      .length
                                  : comment.likes ||
                                    0}
                              </span>

                              <span>
                                Like
                              </span>

                            </button>


                            {/* REPLY */}

                            <button
                              type="button"
                              className="lumora-story-details__comment-action"
                              onClick={() =>
                                setReplyText(
                                  (current) => ({
                                    ...current,

                                    [comment._id]:
                                      current[
                                        comment._id
                                      ] ?? "",

                                  })
                                )
                              }
                            >
                              Reply
                            </button>


                            {/* VIEW REPLIES */}

                            {comment.replyCount >
                              0 && (

                              <button
                                type="button"
                                className="lumora-story-details__comment-action"
                                onClick={() =>
                                  toggleReplies(
                                    comment._id
                                  )
                                }
                              >
                                {repliesLoading[
                                  comment._id
                                ]
                                  ? "Loading..."
                                  : replies[
                                      comment._id
                                    ]
                                    ? "Hide Replies"
                                    : `View ${
                                        comment.replyCount
                                      } ${
                                        comment.replyCount ===
                                        1
                                          ? "Reply"
                                          : "Replies"
                                      }`}
                              </button>

                            )}


                            {/* EDIT */}

                            <button
                              type="button"
                              className="lumora-story-details__comment-action"
                              onClick={() =>
                                startEditingComment(
                                  comment
                                )
                              }
                            >
                              Edit
                            </button>


                            {/* DELETE */}

                            <button
                              type="button"
                              className="lumora-story-details__comment-action lumora-story-details__comment-action--delete"
                              onClick={() =>
                                handleDeleteComment(
                                  comment._id
                                )
                              }
                              disabled={
                                deleteLoading[
                                  comment._id
                                ]
                              }
                            >
                              {deleteLoading[
                                comment._id
                              ]
                                ? "Deleting..."
                                : "Delete"}
                            </button>

                          </div>


                          {/* =================================================
                              REPLY FORM
                          ================================================= */}

                          {replyText[
                            comment._id
                          ] !== undefined && (

                            <div className="lumora-story-details__reply-form">

                              <textarea
                                value={
                                  replyText[
                                    comment._id
                                  ]
                                }
                                onChange={(event) =>
                                  setReplyText(
                                    (current) => ({
                                      ...current,

                                      [comment._id]:
                                        event.target
                                          .value,

                                    })
                                  )
                                }
                                placeholder="Write a reply..."
                                maxLength={1000}
                                disabled={
                                  replySubmitting[
                                    comment._id
                                  ]
                                }
                              />


                              <div className="lumora-story-details__reply-actions">

                                <span>
                                  {
                                    (
                                      replyText[
                                        comment._id
                                      ] || ""
                                    ).length
                                  }
                                  /1000
                                </span>


                                <div>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      setReplyText(
                                        (current) => {

                                          const updated =
                                            {
                                              ...current,
                                            };

                                          delete updated[
                                            comment._id
                                          ];

                                          return updated;

                                        }
                                      )
                                    }
                                  >
                                    Cancel
                                  </button>


                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleReply(
                                        comment._id
                                      )
                                    }
                                    disabled={
                                      replySubmitting[
                                        comment._id
                                      ] ||
                                      !replyText[
                                        comment._id
                                      ]?.trim()
                                    }
                                  >
                                    {replySubmitting[
                                      comment._id
                                    ]
                                      ? "Replying..."
                                      : "Post Reply"}
                                  </button>

                                </div>

                              </div>

                            </div>

                          )}


                          {/* =================================================
                              REPLIES
                          ================================================= */}

                          {replies[
                            comment._id
                          ] && (

                            <div className="lumora-story-details__replies">

                              {replies[
                                comment._id
                              ].map(
                                (reply) => (

                                  <div
                                    key={
                                      reply._id
                                    }
                                    className="lumora-story-details__reply"
                                  >

                                    {/* REPLY AVATAR */}

                                    <div className="lumora-story-details__comment-avatar">

                                      {reply.user?.username
                                        ?.split(" ")
                                        .map(
                                          (name) =>
                                            name[0]
                                        )
                                        .join("")
                                        .slice(
                                          0,
                                          2
                                        )
                                        .toUpperCase() ||
                                        "U"}

                                    </div>


                                    <div className="lumora-story-details__reply-content">

                                      {/* REPLY USER */}

                                      <div className="lumora-story-details__comment-meta">

                                        <strong>
                                          {reply.user
                                            ?.username ||
                                            "Reader"}
                                        </strong>

                                        <span>
                                          {reply.createdAt
                                            ? new Date(
                                                reply.createdAt
                                              ).toLocaleDateString()
                                            : ""}
                                        </span>

                                      </div>


                                      {/* =================================================
                                          EDIT REPLY
                                      ================================================= */}

                                      {replyEditingId ===
                                      reply._id ? (

                                        <div className="lumora-story-details__comment-edit">

                                          <textarea
                                            value={
                                              replyEditText
                                            }
                                            onChange={(
                                              event
                                            ) =>
                                              setReplyEditText(
                                                event
                                                  .target
                                                  .value
                                              )
                                            }
                                            maxLength={
                                              1000
                                            }
                                            autoFocus
                                          />


                                          <div className="lumora-story-details__comment-edit-actions">

                                            <button
                                              type="button"
                                              onClick={
                                                cancelEditingReply
                                              }
                                            >
                                              Cancel
                                            </button>


                                            <button
                                              type="button"
                                              onClick={() =>
                                                saveEditedReply(
                                                  reply._id
                                                )
                                              }
                                              disabled={
                                                replyEditLoading[
                                                  reply._id
                                                ] ||
                                                !replyEditText.trim()
                                              }
                                            >
                                              {replyEditLoading[
                                                reply._id
                                              ]
                                                ? "Saving..."
                                                : "Save"}
                                            </button>

                                          </div>

                                        </div>

                                      ) : (

                                        <>

                                          {/* REPLY CONTENT */}

                                          <p>
                                            {
                                              reply.content
                                            }
                                          </p>


                                          {reply.isEdited && (
                                            <span className="lumora-story-details__edited-label">
                                              Edited
                                            </span>
                                          )}


                                          {/* =================================================
                                              REPLY ACTIONS
                                          ================================================= */}

                                          <div className="lumora-story-details__comment-actions">

                                            {/* LIKE */}

                                            <button
                                              type="button"
                                              className={`lumora-story-details__comment-action ${
                                                replyLikes[
                                                  reply._id
                                                ]
                                                  ? "lumora-story-details__comment-action--liked"
                                                  : ""
                                              }`}
                                              onClick={() =>
                                                toggleReplyLike(
                                                  reply._id
                                                )
                                              }
                                              disabled={
                                                replyLikeLoading[
                                                  reply._id
                                                ]
                                              }
                                            >

                                              <FaHeart
                                                size={11}
                                              />

                                              <span>
                                                {Array.isArray(
                                                  reply.likes
                                                )
                                                  ? reply.likes
                                                      .length
                                                  : reply.likes ||
                                                    0}
                                              </span>

                                              <span>
                                                Like
                                              </span>

                                            </button>


                                            {/* REPLY */}

                                            <button
                                              type="button"
                                              className="lumora-story-details__comment-action"
                                              onClick={() =>
                                                setReplyText(
                                                  (
                                                    current
                                                  ) => ({
                                                    ...current,

                                                    [reply._id]:
                                                      current[
                                                        reply._id
                                                      ] ??
                                                      "",

                                                  })
                                                )
                                              }
                                            >
                                              Reply
                                            </button>


                                            {/* EDIT */}

                                            <button
                                              type="button"
                                              className="lumora-story-details__comment-action"
                                              onClick={() =>
                                                startEditingReply(
                                                  reply
                                                )
                                              }
                                            >
                                              Edit
                                            </button>


                                            {/* DELETE */}

                                            <button
                                              type="button"
                                              className="lumora-story-details__comment-action lumora-story-details__comment-action--delete"
                                              onClick={() =>
                                                handleDeleteReply(
                                                  reply._id
                                                )
                                              }
                                              disabled={
                                                replyDeleteLoading[
                                                  reply._id
                                                ]
                                              }
                                            >
                                              {replyDeleteLoading[
                                                reply._id
                                              ]
                                                ? "Deleting..."
                                                : "Delete"}
                                            </button>

                                          </div>


                                          {/* =================================================
                                              REPLY TO REPLY
                                          ================================================= */}

                                          {replyText[
                                            reply._id
                                          ] !==
                                            undefined && (

                                            <div className="lumora-story-details__reply-form">

                                              <textarea
                                                value={
                                                  replyText[
                                                    reply._id
                                                  ]
                                                }
                                                onChange={(
                                                  event
                                                ) =>
                                                  setReplyText(
                                                    (
                                                      current
                                                    ) => ({
                                                      ...current,

                                                      [reply._id]:
                                                        event
                                                          .target
                                                          .value,

                                                    })
                                                  )
                                                }
                                                placeholder="Write a reply..."
                                                maxLength={
                                                  1000
                                                }
                                                disabled={
                                                  replySubmitting[
                                                    reply._id
                                                  ]
                                                }
                                              />


                                              <div className="lumora-story-details__reply-actions">

                                                <span>
                                                  {
                                                    (
                                                      replyText[
                                                        reply._id
                                                      ] || ""
                                                    ).length
                                                  }
                                                  /1000
                                                </span>


                                                <div>

                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      setReplyText(
                                                        (
                                                          current
                                                        ) => {

                                                          const updated =
                                                            {
                                                              ...current,
                                                            };

                                                          delete updated[
                                                            reply._id
                                                          ];

                                                          return updated;

                                                        }
                                                      )
                                                    }
                                                  >
                                                    Cancel
                                                  </button>


                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      handleReply(
                                                        reply._id
                                                      )
                                                    }
                                                    disabled={
                                                      replySubmitting[
                                                        reply._id
                                                      ] ||
                                                      !replyText[
                                                        reply._id
                                                      ]?.trim()
                                                    }
                                                  >
                                                    {replySubmitting[
                                                      reply._id
                                                    ]
                                                      ? "Replying..."
                                                      : "Post Reply"}
                                                  </button>

                                                </div>

                                              </div>

                                            </div>

                                          )}

                                        </>

                                      )}

                                    </div>

                                  </div>

                                )
                              )}

                            </div>

                          )}

                        </>

                      )}

                    </div>

                  </article>

                )
              )

            )}

          </div>

        </div>

      </section>

            {/* =====================================================
          AUTHOR SECTION
      ===================================================== */}

      <section className="lumora-story-details__author-section">

        <div className="lumora-story-details__container">

          <div className="lumora-story-details__author-card">

            {/* AUTHOR AVATAR */}

            <div className="lumora-story-details__author-large">

              {story.author
                ?.split(" ")
                .map(
                  (name) => name[0]
                )
                .join("")
                .slice(0, 2)
                .toUpperCase() || "W"}

            </div>


            {/* AUTHOR INFORMATION */}

            <div className="lumora-story-details__author-card-content">

              <span className="lumora-story-details__eyebrow">
                ABOUT THE AUTHOR
              </span>


              <h2>
                {story.author ||
                  "Unknown Writer"}
              </h2>


              <p>
                Discover more stories
                from this writer and
                explore their work on
                Lumora.
              </p>


              {story.authorId && (
                <Link
                  to={`/profile/${story.authorId}`}
                  className="lumora-story-details__author-link"
                >
                  View writer profile
                  <FaArrowRight
                    size={11}
                  />
                </Link>
              )}

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="lumora-story-details__cta">

        <div className="lumora-story-details__container">

          <div className="lumora-story-details__cta-card">

            <FaBookOpen
              size={20}
            />


            <span>
              READY TO READ?
            </span>


            <h2>
              Start the story.
            </h2>


            <p>
              Pick a chapter and
              continue reading.
            </p>


            {chapters.length > 0 && (

              <Link
                to={`/read/${storyId}/${chapters[0]._id}`}
                className="lumora-story-details__primary-button"
              >
                Read First Chapter
                <FaArrowRight
                  size={11}
                />
              </Link>

            )}

          </div>

        </div>

      </section>


    </main>
  );
}

export default StoryDetails;