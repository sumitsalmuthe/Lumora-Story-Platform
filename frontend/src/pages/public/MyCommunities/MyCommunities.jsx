import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaComments,
  FaPlus,
  FaUsers,
  FaPenNib,
  FaHeart,
  FaClock,
} from "react-icons/fa6";

import Footer from "../../../components/layout/Footer/Footer";

import "./MyCommunities.css";

const joinedCommunities = [
  {
    id: "fantasy-worlds",
    name: "Fantasy Worlds",
    category: "Fantasy",
    description:
      "Discuss magic systems, kingdoms, mythical creatures and unforgettable fantasy stories.",
    members: "11.2K",
    discussions: "2.4K",
    activity: "Active today",
    role: "Member",
    icon: FaPenNib,
  },
  {
    id: "writers-corner",
    name: "Writers' Corner",
    category: "Writing",
    description:
      "A place to share ideas, writing progress, feedback and everything about the craft.",
    members: "8.2K",
    discussions: "1.9K",
    activity: "Active 12m ago",
    role: "Member",
    icon: FaComments,
  },
  {
    id: "romance-readers",
    name: "Romance Readers",
    category: "Romance",
    description:
      "Talk about characters, relationships, tropes and the romance stories you cannot put down.",
    members: "10.4K",
    discussions: "3.1K",
    activity: "Active 28m ago",
    role: "Member",
    icon: FaHeart,
  },
];

const createdCommunities = [
  {
    id: "midnight-writers",
    name: "Midnight Writers",
    category: "Writing",
    members: "184",
    discussions: "42",
    activity: "Active today",
    role: "Owner",
    icon: FaPenNib,
  },
];

function MyCommunities() {
  return (
    <div className="lumora-my-communities">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="lumora-my-communities__hero">
        <div className="lumora-my-communities__container">
          <span className="lumora-my-communities__eyebrow">
            YOUR COMMUNITY
          </span>

          <h1>
            Your communities.
            <br />
            <span>Your conversations.</span>
          </h1>

          <p>
            Keep track of the communities you joined and the
            spaces you created on Lumora.
          </p>

          <div className="lumora-my-communities__actions">
            <Link
              to="/community"
              className="lumora-my-communities__secondary"
            >
              Explore Communities
              <FaArrowRight size={9} />
            </Link>

            <Link
              to="/create-community"
              className="lumora-my-communities__primary"
            >
              <FaPlus size={9} />
              Create Community
            </Link>
          </div>
        </div>
      </section>

      <main>
        {/* =====================================================
            CREATED BY ME
        ===================================================== */}

        <section className="lumora-my-communities__section">
          <div className="lumora-my-communities__container">
            <div className="lumora-my-communities__section-header">
              <div>
                <span>CREATED BY YOU</span>

                <h2>Your communities</h2>

                <p>
                  Communities you created and manage.
                </p>
              </div>

              <span className="lumora-my-communities__count">
                {createdCommunities.length} community
              </span>
            </div>

            <div className="lumora-my-communities__created-grid">
              {createdCommunities.map((community) => {
                const Icon = community.icon;

                return (
                  <Link
                    key={community.id}
                    to={`/community/${community.id}`}
                    className="lumora-my-communities__created-card"
                  >
                    <div className="lumora-my-communities__icon">
                      <Icon size={17} />
                    </div>

                    <span className="lumora-my-communities__category">
                      {community.category}
                    </span>

                    <h3>{community.name}</h3>

                    <div className="lumora-my-communities__stats">
                      <span>
                        <FaUsers size={9} />
                        {community.members}
                      </span>

                      <span>
                        <FaComments size={9} />
                        {community.discussions}
                      </span>
                    </div>

                    <div className="lumora-my-communities__card-footer">
                      <span>
                        {community.role}
                      </span>

                      <FaArrowRight size={9} />
                    </div>
                  </Link>
                );
              })}

              <Link
                to="/create-community"
                className="lumora-my-communities__create-card"
              >
                <div className="lumora-my-communities__create-icon">
                  <FaPlus size={15} />
                </div>

                <h3>Create another community</h3>

                <p>
                  Start a new space around something you love.
                </p>

                <span>
                  Create Community
                  <FaArrowRight size={9} />
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* =====================================================
            JOINED
        ===================================================== */}

        <section className="lumora-my-communities__section lumora-my-communities__section--muted">
          <div className="lumora-my-communities__container">
            <div className="lumora-my-communities__section-header">
              <div>
                <span>JOINED COMMUNITIES</span>

                <h2>Communities you're part of</h2>

                <p>
                  Continue conversations and discover what's
                  happening in your communities.
                </p>
              </div>

              <span className="lumora-my-communities__count">
                {joinedCommunities.length} joined
              </span>
            </div>

            <div className="lumora-my-communities__joined-list">
              {joinedCommunities.map((community) => {
                const Icon = community.icon;

                return (
                  <Link
                    key={community.id}
                    to={`/community/${community.id}`}
                    className="lumora-my-communities__joined-card"
                  >
                    <div className="lumora-my-communities__joined-icon">
                      <Icon size={16} />
                    </div>

                    <div className="lumora-my-communities__joined-content">
                      <span>
                        {community.category}
                      </span>

                      <h3>{community.name}</h3>

                      <p>{community.description}</p>

                      <div className="lumora-my-communities__joined-meta">
                        <span>
                          <FaUsers size={8} />
                          {community.members}
                        </span>

                        <span>
                          <FaComments size={8} />
                          {community.discussions}
                        </span>

                        <span>
                          <FaClock size={8} />
                          {community.activity}
                        </span>
                      </div>
                    </div>

                    <div className="lumora-my-communities__member-badge">
                      {community.role}
                    </div>

                    <FaArrowRight
                      className="lumora-my-communities__joined-arrow"
                      size={9}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            EMPTY / DISCOVER CTA
        ===================================================== */}

        <section className="lumora-my-communities__discover">
          <div className="lumora-my-communities__container">
            <div className="lumora-my-communities__discover-box">
              <FaUsers size={20} />

              <span>KEEP EXPLORING</span>

              <h2>Looking for another community?</h2>

              <p>
                There are more readers and writers waiting for
                you. Explore Lumora and find your next
                conversation.
              </p>

              <Link to="/community">
                Explore Communities
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

export default MyCommunities;