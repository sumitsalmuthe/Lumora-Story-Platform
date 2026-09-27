import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaComments,
  FaMagnifyingGlass,
  FaPlus,
  FaUsers,
  FaPenNib,
  FaWandMagicSparkles,
  FaHeart,
  FaGhost,
  FaRocket,
  FaClock,
} from "react-icons/fa6";

import Footer from "../../../components/layout/Footer/Footer";

import "./Community.css";

const featuredCommunities = [
  {
    id: "featured-1",
    name: "Fantasy Writers",
    description:
      "A home for fantasy writers building kingdoms, magic systems and unforgettable worlds.",
    category: "Fantasy",
    members: "12.4K",
    posts: "3.8K",
    icon: FaWandMagicSparkles,
  },
  {
    id: "featured-2",
    name: "The Writing Room",
    description:
      "Share your writing, exchange feedback and grow together with other writers.",
    category: "Writing",
    members: "9.8K",
    posts: "2.9K",
    icon: FaPenNib,
  },
  {
    id: "featured-3",
    name: "Readers After Dark",
    description:
      "Horror, mystery and thriller readers discussing the stories that keep them awake.",
    category: "Horror",
    members: "7.6K",
    posts: "2.1K",
    icon: FaGhost,
  },
];

const writingCommunities = [
  {
    id: "writing-1",
    name: "Writers' Corner",
    category: "Writing",
    members: "8.2K",
    icon: FaPenNib,
  },
  {
    id: "writing-2",
    name: "Story Feedback",
    category: "Writing",
    members: "6.7K",
    icon: FaComments,
  },
  {
    id: "writing-3",
    name: "Novel Builders",
    category: "Writing",
    members: "5.3K",
    icon: FaUsers,
  },
  {
    id: "writing-4",
    name: "Poetry Circle",
    category: "Poetry",
    members: "4.9K",
    icon: FaPenNib,
  },
];

const genreCommunities = [
  {
    id: "genre-1",
    name: "Fantasy Worlds",
    category: "Fantasy",
    members: "11.2K",
    icon: FaWandMagicSparkles,
  },
  {
    id: "genre-2",
    name: "Romance Readers",
    category: "Romance",
    members: "10.4K",
    icon: FaHeart,
  },
  {
    id: "genre-3",
    name: "Horror Society",
    category: "Horror",
    members: "7.9K",
    icon: FaGhost,
  },
  {
    id: "genre-4",
    name: "Sci-Fi Collective",
    category: "Sci-Fi",
    members: "6.8K",
    icon: FaRocket,
  },
];

const newCommunities = [
  {
    id: "new-1",
    name: "Midnight Writers",
    category: "Writing",
    members: "184",
    created: "2 days ago",
  },
  {
    id: "new-2",
    name: "Young Adult Stories",
    category: "Young Adult",
    members: "126",
    created: "4 days ago",
  },
  {
    id: "new-3",
    name: "Dystopian Dreams",
    category: "Dystopian",
    members: "98",
    created: "6 days ago",
  },
];

function Community() {
  return (
    <div className="lumora-community-page">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="lumora-community-page__hero">
        <div className="lumora-community-page__container">
          <div className="lumora-community-page__hero-content">
            <span className="lumora-community-page__eyebrow">
              LUMORA COMMUNITY
            </span>

            <h1>
              Find your people.
              <br />
              <span>Find your community.</span>
            </h1>

            <p>
              Connect with readers and writers who love the same
              stories, genres and ideas as you do.
            </p>

            <div className="lumora-community-page__hero-actions">
              <a
                href="#communities"
                className="lumora-community-page__primary-btn"
              >
                Explore Communities
                <FaArrowRight size={10} />
              </a>

              <Link
                to="/create-community"
                className="lumora-community-page__secondary-btn"
              >
                <FaPlus size={10} />
                Create Community
              </Link>
            </div>
          </div>

          <div className="lumora-community-page__hero-stats">
            <div>
              <strong>240+</strong>
              <span>Communities</span>
            </div>

            <div>
              <strong>86K+</strong>
              <span>Members</span>
            </div>

            <div>
              <strong>12K+</strong>
              <span>Discussions</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <section className="lumora-community-page__search-section">
        <div className="lumora-community-page__container">
          <div className="lumora-community-page__search">
            <FaMagnifyingGlass size={13} />

            <input
              type="search"
              placeholder="Search communities..."
              aria-label="Search communities"
            />
          </div>

          <div className="lumora-community-page__quick-links">
            <span>Explore:</span>

            <Link to="/community/featured">
              Featured
            </Link>

            <Link to="/community/writing">
              Writing
            </Link>

            <Link to="/community/genres">
              Genres
            </Link>

            <Link to="/community/popular">
              Popular
            </Link>

            <Link to="/community/new">
              New
            </Link>

            <Link to="/community/my">
              My Communities
            </Link>
          </div>
        </div>
      </section>

      <main id="communities">
        {/* =====================================================
            FEATURED
        ===================================================== */}

        <section className="lumora-community-page__section">
          <div className="lumora-community-page__container">
            <div className="lumora-community-page__section-header">
              <div>
                <span>FEATURED</span>

                <h2>Communities worth joining</h2>

                <p>
                  Discover active communities where readers and
                  writers are already having great conversations.
                </p>
              </div>

              <Link to="/community/featured">
                View all
                <FaArrowRight size={9} />
              </Link>
            </div>

            <div className="lumora-community-page__featured-grid">
              {featuredCommunities.map((community) => {
                const Icon = community.icon;

                return (
                  <Link
                    key={community.id}
                    to={`/community/${community.id}`}
                    className="lumora-community-page__featured-card"
                  >
                    <div className="lumora-community-page__community-icon">
                      <Icon size={18} />
                    </div>

                    <span className="lumora-community-page__category">
                      {community.category}
                    </span>

                    <h3>{community.name}</h3>

                    <p>{community.description}</p>

                    <div className="lumora-community-page__community-meta">
                      <span>
                        <FaUsers size={9} />
                        {community.members}
                      </span>

                      <span>
                        <FaComments size={9} />
                        {community.posts}
                      </span>
                    </div>

                    <div className="lumora-community-page__card-link">
                      Explore
                      <FaArrowRight size={9} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            WRITING
        ===================================================== */}

        <section className="lumora-community-page__section lumora-community-page__section--muted">
          <div className="lumora-community-page__container">
            <div className="lumora-community-page__section-header">
              <div>
                <span>FOR WRITERS</span>

                <h2>Writing communities</h2>

                <p>
                  Share your work, ask for feedback and connect
                  with people who understand the writing process.
                </p>
              </div>

              <Link to="/community/writing">
                Explore writing
                <FaArrowRight size={9} />
              </Link>
            </div>

            <div className="lumora-community-page__compact-grid">
              {writingCommunities.map((community) => {
                const Icon = community.icon;

                return (
                  <Link
                    key={community.id}
                    to={`/community/${community.id}`}
                    className="lumora-community-page__compact-card"
                  >
                    <div className="lumora-community-page__compact-icon">
                      <Icon size={15} />
                    </div>

                    <div>
                      <span>{community.category}</span>

                      <h3>{community.name}</h3>

                      <p>
                        <FaUsers size={8} />
                        {community.members} members
                      </p>
                    </div>

                    <FaArrowRight
                      className="lumora-community-page__compact-arrow"
                      size={9}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            GENRES
        ===================================================== */}

        <section className="lumora-community-page__section">
          <div className="lumora-community-page__container">
            <div className="lumora-community-page__section-header">
              <div>
                <span>BY GENRE</span>

                <h2>Find your kind of story</h2>

                <p>
                  Join conversations around the genres you never
                  get tired of reading.
                </p>
              </div>

              <Link to="/community/genres">
                All genres
                <FaArrowRight size={9} />
              </Link>
            </div>

            <div className="lumora-community-page__compact-grid">
              {genreCommunities.map((community) => {
                const Icon = community.icon;

                return (
                  <Link
                    key={community.id}
                    to={`/community/${community.id}`}
                    className="lumora-community-page__compact-card"
                  >
                    <div className="lumora-community-page__compact-icon">
                      <Icon size={15} />
                    </div>

                    <div>
                      <span>{community.category}</span>

                      <h3>{community.name}</h3>

                      <p>
                        <FaUsers size={8} />
                        {community.members} members
                      </p>
                    </div>

                    <FaArrowRight
                      className="lumora-community-page__compact-arrow"
                      size={9}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            NEW
        ===================================================== */}

        <section className="lumora-community-page__section lumora-community-page__section--muted">
          <div className="lumora-community-page__container">
            <div className="lumora-community-page__section-header">
              <div>
                <span>JUST CREATED</span>

                <h2>New communities</h2>

                <p>
                  Be one of the first people to join a growing
                  community.
                </p>
              </div>

              <Link to="/community/new">
                See what's new
                <FaArrowRight size={9} />
              </Link>
            </div>

            <div className="lumora-community-page__new-list">
              {newCommunities.map((community) => (
                <Link
                  key={community.id}
                  to={`/community/${community.id}`}
                  className="lumora-community-page__new-item"
                >
                  <div className="lumora-community-page__new-icon">
                    <FaUsers size={14} />
                  </div>

                  <div className="lumora-community-page__new-content">
                    <span>{community.category}</span>

                    <h3>{community.name}</h3>

                    <p>
                      <FaUsers size={8} />
                      {community.members} members
                    </p>
                  </div>

                  <div className="lumora-community-page__new-time">
                    <FaClock size={8} />
                    {community.created}
                  </div>

                  <FaArrowRight
                    className="lumora-community-page__new-arrow"
                    size={9}
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            CREATE CTA
        ===================================================== */}

        <section className="lumora-community-page__cta">
          <div className="lumora-community-page__container">
            <div className="lumora-community-page__cta-box">
              <div className="lumora-community-page__cta-icon">
                <FaUsers size={17} />
              </div>

              <span>BUILD SOMETHING YOURSELF</span>

              <h2>
                Can't find your community?
              </h2>

              <p>
                Create a space around your favorite genre,
                writing style, story idea or anything worth
                discussing.
              </p>

              <Link to="/create-community">
                Create a Community
                <FaArrowRight size={10} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Community;