import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaComments,
  FaHeart,
  FaPlus,
  FaUserGroup,
  FaCircle,
  FaFire,
  FaEllipsis,
} from "react-icons/fa6";

import Footer from "../../../components/layout/Footer/Footer";

import "./CommunityDetail.css";

const communityData = {
  "community-1": {
    name: "Fantasy Writers",
    category: "Writing",
    description:
      "A space for fantasy writers to share ideas, characters, worlds and writing advice.",
    members: "12.8K",
    posts: "4.2K",
  },

  "community-2": {
    name: "Horror Readers",
    category: "Horror",
    description:
      "Talk about horror stories, terrifying characters, theories and unforgettable endings.",
    members: "9.6K",
    posts: "3.1K",
  },

  "community-3": {
    name: "Romance Corner",
    category: "Romance",
    description:
      "For readers who love romance, emotional stories and unforgettable characters.",
    members: "8.4K",
    posts: "2.7K",
  },

  "community-4": {
    name: "Sci-Fi Collective",
    category: "Sci-Fi",
    description:
      "Discuss futuristic worlds, technology, space adventures and science fiction.",
    members: "7.1K",
    posts: "2.2K",
  },

  "community-5": {
    name: "Mystery & Crime",
    category: "Mystery",
    description:
      "Share theories, solve fictional mysteries and discuss crime stories.",
    members: "6.8K",
    posts: "1.9K",
  },

  "community-6": {
    name: "Young Writers Hub",
    category: "Writing",
    description:
      "A friendly place for new writers to share their work and learn from others.",
    members: "5.3K",
    posts: "1.5K",
  },
};

const discussions = [
  {
    id: 1,
    author: "Aarav Mehta",
    avatar: "AM",
    time: "12 min ago",
    title: "What makes a fantasy world actually feel alive?",
    content:
      "I've been working on my worldbuilding and I'm curious about what other writers focus on first — history, cultures, magic systems or characters?",
    likes: 48,
    comments: 16,
  },
  {
    id: 2,
    author: "Riya Kapoor",
    avatar: "RK",
    time: "38 min ago",
    title: "Share one character you're currently writing",
    content:
      "Let's introduce our characters. Tell us their name, role and the one thing that makes them different.",
    likes: 34,
    comments: 21,
  },
  {
    id: 3,
    author: "Dev Malhotra",
    avatar: "DM",
    time: "1 hr ago",
    title: "How do you handle difficult endings?",
    content:
      "Sometimes the ending is harder than writing the entire story. How do you know when a story is actually finished?",
    likes: 27,
    comments: 13,
  },
];

const activeMembers = [
  {
    name: "Aarav Mehta",
    username: "@aaravwrites",
    avatar: "AM",
  },
  {
    name: "Riya Kapoor",
    username: "@riyawrites",
    avatar: "RK",
  },
  {
    name: "Dev Malhotra",
    username: "@devstories",
    avatar: "DM",
  },
  {
    name: "Mira Sen",
    username: "@mirasen",
    avatar: "MS",
  },
];

function CommunityDetail() {
  const { communityId } = useParams();

  const community =
    communityData[communityId] || communityData["community-1"];

  return (
    <>
      <main className="lumora-community-detail">
        {/* =====================================================
            COMMUNITY HEADER
        ===================================================== */}

        <section className="lumora-community-detail__hero">
          <div className="lumora-community-detail__container">
            <Link
              to="/community"
              className="lumora-community-detail__back"
            >
              <FaArrowLeft size={10} />
              Community
            </Link>

            <div className="lumora-community-detail__hero-content">
              <div className="lumora-community-detail__community-icon">
                <FaUserGroup size={28} />
              </div>

              <div className="lumora-community-detail__identity">
                <span>{community.category}</span>

                <h1>{community.name}</h1>

                <p>{community.description}</p>

                <div className="lumora-community-detail__hero-stats">
                  <span>
                    <FaUserGroup size={10} />
                    {community.members} members
                  </span>

                  <span>
                    <FaComments size={10} />
                    {community.posts} posts
                  </span>

                  <span>
                    <FaCircle size={6} />
                    Active now
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="lumora-community-detail__join"
              >
                <FaPlus size={10} />
                Join Community
              </button>
            </div>
          </div>
        </section>

        {/* =====================================================
            NAVIGATION
        ===================================================== */}

        <nav className="lumora-community-detail__tabs">
          <div className="lumora-community-detail__container">
            <div className="lumora-community-detail__tab-list">
              <button
                type="button"
                className="lumora-community-detail__tab lumora-community-detail__tab--active"
              >
                Home
              </button>

              <button
                type="button"
                className="lumora-community-detail__tab"
              >
                Discussions
              </button>

              <button
                type="button"
                className="lumora-community-detail__tab"
              >
                Members
              </button>

              <button
                type="button"
                className="lumora-community-detail__tab"
              >
                About
              </button>
            </div>
          </div>
        </nav>

        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}

        <section className="lumora-community-detail__content">
          <div className="lumora-community-detail__container">
            <div className="lumora-community-detail__layout">
              {/* =================================================
                  DISCUSSIONS
              ================================================= */}

              <div className="lumora-community-detail__main">
                <div className="lumora-community-detail__section-heading">
                  <div>
                    <span>COMMUNITY DISCUSSIONS</span>

                    <h2>Recent conversations</h2>
                  </div>

                  <button
                    type="button"
                    className="lumora-community-detail__new-post"
                  >
                    <FaPlus size={9} />
                    New Post
                  </button>
                </div>

                <div className="lumora-community-detail__discussions">
                  {discussions.map((discussion) => (
                    <article
                      key={discussion.id}
                      className="lumora-community-detail__post"
                    >
                      <div className="lumora-community-detail__post-top">
                        <div className="lumora-community-detail__avatar">
                          {discussion.avatar}
                        </div>

                        <div className="lumora-community-detail__author">
                          <strong>{discussion.author}</strong>

                          <span>{discussion.time}</span>
                        </div>

                        <button
                          type="button"
                          className="lumora-community-detail__more"
                          aria-label="More options"
                        >
                          <FaEllipsis size={12} />
                        </button>
                      </div>

                      <h3>{discussion.title}</h3>

                      <p>{discussion.content}</p>

                      <div className="lumora-community-detail__post-actions">
                        <button type="button">
                          <FaHeart size={10} />
                          {discussion.likes}
                        </button>

                        <button type="button">
                          <FaComments size={10} />
                          {discussion.comments}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* =================================================
                  SIDEBAR
              ================================================= */}

              <aside className="lumora-community-detail__sidebar">
                {/* ABOUT */}

                <div className="lumora-community-detail__side-card">
                  <span className="lumora-community-detail__side-eyebrow">
                    ABOUT COMMUNITY
                  </span>

                  <h3>{community.name}</h3>

                  <p>{community.description}</p>

                  <div className="lumora-community-detail__side-stat">
                    <span>Members</span>
                    <strong>{community.members}</strong>
                  </div>

                  <div className="lumora-community-detail__side-stat">
                    <span>Posts</span>
                    <strong>{community.posts}</strong>
                  </div>
                </div>

                {/* RULES */}

                <div className="lumora-community-detail__side-card">
                  <span className="lumora-community-detail__side-eyebrow">
                    COMMUNITY RULES
                  </span>

                  <ol className="lumora-community-detail__rules">
                    <li>Respect other members.</li>
                    <li>Keep discussions related to the community.</li>
                    <li>No spam or self-promotion.</li>
                    <li>Keep feedback constructive.</li>
                  </ol>
                </div>

                {/* ACTIVE MEMBERS */}

                <div className="lumora-community-detail__side-card">
                  <div className="lumora-community-detail__active-heading">
                    <span className="lumora-community-detail__side-eyebrow">
                      ACTIVE MEMBERS
                    </span>

                    <FaFire size={11} />
                  </div>

                  <div className="lumora-community-detail__members">
                    {activeMembers.map((member) => (
                      <div
                        key={member.username}
                        className="lumora-community-detail__member"
                      >
                        <div className="lumora-community-detail__member-avatar">
                          {member.avatar}
                        </div>

                        <div>
                          <strong>{member.name}</strong>
                          <span>{member.username}</span>
                        </div>

                        <FaCircle size={6} />
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default CommunityDetail;