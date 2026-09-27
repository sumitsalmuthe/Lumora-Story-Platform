import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  FaArrowRight,
  FaBookOpen,
  FaCalendar,
  FaCheck,
  FaHeart,
  FaUserGroup,
} from "react-icons/fa6";

import "./Profile.css";

import apiClient from "../../../services/api/apiClient";
import followService from "../../../services/follows/followService";
import useAuth from "../../../context/AuthContext/useAuth";

function Profile() {
  const { userId } = useParams();
  const { isAuthenticated } = useAuth();

  // =====================================================
  // STATE
  // =====================================================

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [stories, setStories] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  // =====================================================
  // LOAD PROFILE
  // =====================================================

  
useEffect(() => {
  if (!userId) {
    return;
  }

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      setError("");

        // -------------------------------------------------
        // PROFILE
        // -------------------------------------------------

        const profileResponse = await apiClient.get(
          `/profile/id/${userId}`
        );

        const profileData =
          profileResponse?.data?.profile ||
          profileResponse?.data?.data ||
          profileResponse?.data;

        setProfile(profileData);

        // -------------------------------------------------
        // WRITER STATS
        // -------------------------------------------------

        try {
          const statsResponse = await apiClient.get(
            `/profile/${userId}/stats`
          );

          const statsData =
            statsResponse?.data?.stats ||
            statsResponse?.data?.data ||
            statsResponse?.data;

          setStats(statsData);
        } catch (statsError) {
          console.error(
            "Load writer stats error:",
            statsError
          );

          setStats(null);
        }

        // -------------------------------------------------
        // FOLLOWER COUNT
        // -------------------------------------------------

        try {
          const followerResponse =
            await followService.getFollowerCount(
              userId
            );

          const followerData =
            followerResponse?.data ||
            followerResponse;

          const count =
            followerData?.count ??
            followerData?.followersCount ??
            followerData?.data?.count ??
            0;

          setFollowerCount(Number(count));
        } catch (followerError) {
          console.error(
            "Load follower count error:",
            followerError
          );

          setFollowerCount(0);
        }

        // -------------------------------------------------
        // FOLLOW STATUS
        // -------------------------------------------------

        if (isAuthenticated) {
          try {
            const followResponse =
              await followService.checkFollowing(
                userId
              );

            const followData =
              followResponse?.data ||
              followResponse;

            const following =
              followData?.isFollowing ??
              followData?.following ??
              followData?.exists ??
              followData?.data?.isFollowing ??
              false;

            setIsFollowing(Boolean(following));
          } catch (followStatusError) {
            console.error(
              "Load follow status error:",
              followStatusError
            );

            setIsFollowing(false);
          }
        } else {
          setIsFollowing(false);
        }

        // -------------------------------------------------
        // WRITER STORIES
        // -------------------------------------------------

        try {
          const storiesResponse =
            await apiClient.get("/stories");

          const allStories =
            storiesResponse?.data?.stories ||
            storiesResponse?.data?.data ||
            [];

          const writerStories =
            allStories.filter((story) => {
              const authorId =
                story?.author?._id ||
                story?.author?.id ||
                story?.author;

              return (
                String(authorId) ===
                String(userId)
              );
            });

          setStories(writerStories);
        } catch (storiesError) {
          console.error(
            "Load writer stories error:",
            storiesError
          );

          setStories([]);
        }
      } catch (requestError) {
        console.error(
          "Load profile error:",
          requestError
        );

        setError(
          requestError?.response?.data?.message ||
            requestError?.message ||
            "Unable to load writer profile."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [userId, isAuthenticated]);

  // =====================================================
  // FOLLOW / UNFOLLOW
  // =====================================================

  const handleFollowToggle = async () => {
    console.log("FOLLOW BUTTON CLICKED");
    console.log("Writer ID:", userId);
    console.log(
      "Authenticated:",
      isAuthenticated
    );
    console.log(
      "Current following status:",
      isFollowing
    );

    if (!userId || followLoading) {
      return;
    }

    if (!isAuthenticated) {
      setError(
        "Please login to follow this writer."
      );
      return;
    }

    try {
      setFollowLoading(true);
      setError("");

      // -------------------------------------------------
      // UNFOLLOW
      // -------------------------------------------------

      if (isFollowing) {
        const response =
          await followService.unfollowWriter(
            userId
          );

        console.log(
          "UNFOLLOW RESPONSE:",
          response
        );

        setIsFollowing(false);

        setFollowerCount((current) =>
          Math.max(0, current - 1)
        );

        return;
      }

      // -------------------------------------------------
      // FOLLOW
      // -------------------------------------------------

      const response =
        await followService.followWriter(
          userId
        );

      console.log(
        "FOLLOW RESPONSE:",
        response
      );

      setIsFollowing(true);

      setFollowerCount(
        (current) => current + 1
      );
    } catch (followError) {
      console.error(
        "FOLLOW / UNFOLLOW ERROR:",
        followError
      );

      console.error(
        "API RESPONSE:",
        followError?.response?.data
      );

      setError(
        followError?.response?.data?.message ||
          "Unable to update follow status."
      );
    } finally {
      setFollowLoading(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {
    return (
      <main className="lumora-profile">
        <div className="lumora-profile__container">
          <div className="lumora-profile__loading">
            Loading profile...
          </div>
        </div>
      </main>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error && !profile) {
    return (
      <main className="lumora-profile">
        <div className="lumora-profile__container">
          <div className="lumora-profile__error">
            {error}
          </div>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="lumora-profile">
        <div className="lumora-profile__container">
          <div className="lumora-profile__error">
            Writer profile not found.
          </div>
        </div>
      </main>
    );
  }

  // =====================================================
  // PROFILE DATA
  // =====================================================

  const username =
    profile.username || "Writer";

  const initials = username
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const totalStories =
    stats?.totalStories ??
    stories.length;

  const totalViews = stories.reduce(
    (total, story) =>
      total + Number(story?.views || 0),
    0
  );

  const joinedDate = profile.createdAt
    ? new Date(
        profile.createdAt
      ).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <main className="lumora-profile">

      {/* =================================================
          PROFILE HERO
      ================================================= */}

      <section className="lumora-profile__hero">
        <div className="lumora-profile__container">

          <div className="lumora-profile__hero-content">

            {/* AVATAR */}

            <div className="lumora-profile__avatar">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={username}
                />
              ) : (
                initials
              )}
            </div>

            {/* IDENTITY */}

            <div className="lumora-profile__identity">

              <div className="lumora-profile__name-row">
                <h1>{username}</h1>

                {profile.verified && (
                  <span
                    className="lumora-profile__verified"
                    title="Verified writer"
                  >
                    <FaCheck size={9} />
                  </span>
                )}
              </div>

              <p>
                {profile.bio ||
                  "Writer on Lumora. Creating stories and building new worlds."}
              </p>

              <div className="lumora-profile__meta">

                <span>
                  <FaCalendar size={10} />
                  Joined {joinedDate}
                </span>

                <span>
                  <FaBookOpen size={10} />
                  {totalStories}{" "}
                  {totalStories === 1
                    ? "Story"
                    : "Stories"}
                </span>

              </div>
            </div>

            {/* =================================================
                FOLLOW BUTTON
            ================================================= */}

            <button
              type="button"
              className="lumora-profile__follow-button"
              onClick={handleFollowToggle}
              disabled={followLoading}
              title={
                !isAuthenticated
                  ? "Login to follow this writer"
                  : "Follow this writer"
              }
            >
              <FaUserGroup size={12} />

              {followLoading
                ? "Please wait..."
                : isFollowing
                  ? "Following"
                  : "Follow"}
            </button>

          </div>

          {/* =================================================
              FOLLOW ERROR
          ================================================= */}

          {error && profile && (
            <div className="lumora-profile__error">
              {error}
            </div>
          )}

          {/* =================================================
              STATS
          ================================================= */}

          <div className="lumora-profile__stats">

            {/* FOLLOWERS */}

            <div>
              <strong>
                {followerCount.toLocaleString()}
              </strong>

              <span>Followers</span>
            </div>

            {/* FOLLOWING */}

            <div>
              <strong>—</strong>

              <span>Following</span>
            </div>

            {/* STORIES */}

            <div>
              <strong>
                {totalStories}
              </strong>

              <span>Stories</span>
            </div>

            {/* VIEWS */}

            <div>
              <strong>
                {totalViews.toLocaleString()}
              </strong>

              <span>Total views</span>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          STORIES
      ===================================================== */}

      <section className="lumora-profile__stories">
        <div className="lumora-profile__container">

          <div className="lumora-profile__section-header">

            <div>
              <span className="lumora-profile__eyebrow">
                WRITTEN BY{" "}
                {username.toUpperCase()}
              </span>

              <h2>Stories</h2>
            </div>

            <span className="lumora-profile__story-count">
              {stories.length} published
            </span>

          </div>

          {/* STORY LIST */}

          <div className="lumora-profile__story-list">

            {stories.length === 0 ? (
              <div className="lumora-profile__empty">

                <FaBookOpen size={24} />

                <p>
                  This writer has no published
                  stories yet.
                </p>

              </div>
            ) : (
              stories.map((story) => {

                const storyLikes =
                  Array.isArray(story?.likes)
                    ? story.likes.length
                    : Number(
                        story?.likes || 0
                      );

                const storyViews =
                  Number(
                    story?.views || 0
                  );

                return (
                  <article
                    key={story._id}
                    className="lumora-profile__story-card"
                  >

                    {/* COVER */}

                    <div className="lumora-profile__story-cover">

                      {story?.coverImage ? (
                        <img
                          src={story.coverImage}
                          alt={
                            story.title ||
                            "Story cover"
                          }
                        />
                      ) : (
                        <>
                          <FaBookOpen
                            size={21}
                          />

                          <span>
                            {story.category ||
                              "Story"}
                          </span>
                        </>
                      )}

                    </div>

                    {/* CONTENT */}

                    <div className="lumora-profile__story-content">

                      <div className="lumora-profile__story-title-row">

                        <Link
                          to={`/stories/${story._id}`}
                          className="lumora-profile__story-title"
                        >
                          {story.title}
                        </Link>

                        <span className="lumora-profile__story-status">
                          {story.status ||
                            "Published"}
                        </span>

                      </div>

                      <p>
                        {story.shortDescription ||
                          story.description ||
                          "No description available."}
                      </p>

                      <div className="lumora-profile__story-stats">

                        <span>
                          <FaBookOpen
                            size={10}
                          />

                          {storyViews.toLocaleString()}{" "}
                          views
                        </span>

                        <span>
                          <FaHeart
                            size={10}
                          />

                          {storyLikes.toLocaleString()}{" "}
                          likes
                        </span>

                      </div>

                    </div>

                    {/* OPEN STORY */}

                    <Link
                      to={`/stories/${story._id}`}
                      className="lumora-profile__story-action"
                      aria-label={`Open ${story.title}`}
                    >
                      <FaArrowRight size={11} />
                    </Link>

                  </article>
                );
              })
            )}

          </div>
        </div>
      </section>

      {/* =====================================================
          ABOUT WRITER
      ===================================================== */}

      <section className="lumora-profile__about">
        <div className="lumora-profile__container">

          <div className="lumora-profile__about-card">

            <div className="lumora-profile__about-icon">
              <FaBookOpen size={17} />
            </div>

            <div>

              <span className="lumora-profile__eyebrow">
                ABOUT THE WRITER
              </span>

              <h2>{username}</h2>

              <p>
                {profile.bio ||
                  "Writer on Lumora. Creating stories and building new worlds."}
              </p>

              <Link to="/community">
                Connect with the writer
                <FaArrowRight size={10} />
              </Link>

            </div>

          </div>
        </div>
      </section>

    </main>
  );
}

export default Profile;