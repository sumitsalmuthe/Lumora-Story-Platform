import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaComments,
  FaFire,
  FaUsers,
} from "react-icons/fa6";

import Footer from "../../../components/layout/Footer/Footer";

import "./CommunityCategory.css";

const communityPages = {
  featured: {
    eyebrow: "FEATURED COMMUNITIES",
    title: "Find people who love the same stories.",
    description:
      "Explore communities highlighted by Lumora for their conversations, creativity and active members.",
    label: "Featured",
  },

  writing: {
    eyebrow: "WRITING COMMUNITIES",
    title: "Write together. Learn together.",
    description:
      "Connect with writers, share ideas, discuss writing and grow your craft together.",
    label: "Writing",
  },

  genres: {
    eyebrow: "GENRE COMMUNITIES",
    title: "Find your kind of story.",
    description:
      "Join communities built around the genres and worlds you love reading.",
    label: "Genres",
  },

  popular: {
    eyebrow: "POPULAR COMMUNITIES",
    title: "Where the biggest conversations happen.",
    description:
      "Discover Lumora communities with active discussions and growing audiences.",
    label: "Popular",
  },

  new: {
    eyebrow: "NEW COMMUNITIES",
    title: "Fresh communities are waiting.",
    description:
      "Discover recently created communities and be one of the first members.",
    label: "New",
  },

  my: {
    eyebrow: "MY COMMUNITIES",
    title: "Your communities, all in one place.",
    description:
      "Keep track of the communities you have joined and the conversations you follow.",
    label: "My Communities",
  },
};

const communities = [
  {
    id: "community-1",
    name: "Fantasy Writers",
    category: "Writing",
    description:
      "A space for fantasy writers to share ideas, characters, worlds and writing advice.",
    members: "12.8K",
    posts: "4.2K",
    activity: "Very active",
    featured: true,
  },
  {
    id: "community-2",
    name: "Horror Readers",
    category: "Horror",
    description:
      "Talk about horror stories, terrifying characters, theories and unforgettable endings.",
    members: "9.6K",
    posts: "3.1K",
    activity: "Very active",
    featured: true,
  },
  {
    id: "community-3",
    name: "Romance Corner",
    category: "Romance",
    description:
      "For readers who love romance, emotional stories and unforgettable characters.",
    members: "8.4K",
    posts: "2.7K",
    activity: "Active",
    featured: false,
  },
  {
    id: "community-4",
    name: "Sci-Fi Collective",
    category: "Sci-Fi",
    description:
      "Discuss futuristic worlds, technology, space adventures and science fiction.",
    members: "7.1K",
    posts: "2.2K",
    activity: "Active",
    featured: false,
  },
  {
    id: "community-5",
    name: "Mystery & Crime",
    category: "Mystery",
    description:
      "Share theories, solve fictional mysteries and discuss crime stories.",
    members: "6.8K",
    posts: "1.9K",
    activity: "Active",
    featured: false,
  },
  {
    id: "community-6",
    name: "Young Writers Hub",
    category: "Writing",
    description:
      "A friendly place for new writers to share their work and learn from others.",
    members: "5.3K",
    posts: "1.5K",
    activity: "Growing",
    featured: false,
  },
];

function CommunityCategory() {
  const { communityType } = useParams();

  const page =
    communityPages[communityType] || communityPages.featured;

  return (
    <>
      <main className="lumora-community-category">
        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="lumora-community-category__hero">
          <div className="lumora-community-category__container">
            <Link
              to="/community"
              className="lumora-community-category__back"
            >
              <FaArrowLeft size={10} />
              Community
            </Link>

            <span className="lumora-community-category__eyebrow">
              {page.eyebrow}
            </span>

            <h1>{page.title}</h1>

            <p>{page.description}</p>
          </div>
        </section>

        {/* =====================================================
            COMMUNITY LIST
        ===================================================== */}

        <section className="lumora-community-category__content">
          <div className="lumora-community-category__container">
            <div className="lumora-community-category__header">
              <div>
                <span>{page.label}</span>

                <h2>Explore communities</h2>

                <p>
                  Find a community and join the conversation.
                </p>
              </div>

              <span className="lumora-community-category__count">
                {communities.length} communities
              </span>
            </div>

            <div className="lumora-community-category__grid">
              {communities.map((community) => (
                <article
                  key={community.id}
                  className="lumora-community-category__card"
                >
                  {/* ICON */}

                  <div className="lumora-community-category__icon">
                    <FaUsers size={18} />
                  </div>

                  {/* META */}

                  <div className="lumora-community-category__meta">
                    <span>{community.category}</span>

                    {community.featured && (
                      <small>
                        <FaFire size={8} />
                        Featured
                      </small>
                    )}
                  </div>

                  {/* NAME */}

                  <h3>{community.name}</h3>

                  {/* DESCRIPTION */}

                  <p>{community.description}</p>

                  {/* STATS */}

                  <div className="lumora-community-category__stats">
                    <span>
                      <FaUsers size={10} />
                      {community.members} members
                    </span>

                    <span>
                      <FaComments size={10} />
                      {community.posts} posts
                    </span>
                  </div>

                  {/* ACTIVITY */}

                  <div className="lumora-community-category__footer">
                    <span className="lumora-community-category__activity">
                      <span />
                      {community.activity}
                    </span>

                    <Link
                      to={`/community/view/${community.id}`}
                      className="lumora-community-category__join"
                    >
                      Explore
                      <FaArrowRight size={9} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            CREATE COMMUNITY CTA
        ===================================================== */}

        <section className="lumora-community-category__cta">
          <div className="lumora-community-category__container">
            <div className="lumora-community-category__cta-box">
              <div>
                <span>BUILD YOUR OWN COMMUNITY</span>

                <h2>
                  Can't find the community you're looking for?
                </h2>

                <p>
                  Create your own space and bring readers and
                  writers together around something you love.
                </p>
              </div>

              <Link to="/create-community">
                Create Community
                <FaArrowRight size={10} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default CommunityCategory;