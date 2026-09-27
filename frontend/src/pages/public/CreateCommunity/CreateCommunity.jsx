import { Link } from "react-router-dom";
import { useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaGlobe,
  FaLock,
  FaUsers,
} from "react-icons/fa6";

import Footer from "../../../components/layout/Footer/Footer";

import "./CreateCommunity.css";

const categories = [
  "Writing",
  "Fantasy",
  "Romance",
  "Mystery",
  "Horror",
  "Sci-Fi",
  "Thriller",
  "Poetry",
  "Nonfiction",
  "Fanfiction",
  "Young Adult",
  "Other",
];

function CreateCommunity() {
  const [formData, setFormData] = useState({
    name: "",
    handle: "",
    description: "",
    category: "Writing",
    visibility: "public",
    rules: "",
  });

  const [created, setCreated] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setCreated(true);
  };

  return (
    <>
      <main className="lumora-create-community">
        <section className="lumora-create-community__hero">
          <div className="lumora-create-community__container">
            <Link
              to="/community"
              className="lumora-create-community__back"
            >
              <FaArrowLeft size={10} />
              Back to Community
            </Link>

            <div className="lumora-create-community__intro">
              <span>BUILD YOUR COMMUNITY</span>

              <h1>
                Create a place
                <br />
                <strong>people want to belong to.</strong>
              </h1>

              <p>
                Bring readers and writers together around a
                shared interest, genre, idea or passion.
              </p>
            </div>
          </div>
        </section>

        <section className="lumora-create-community__content">
          <div className="lumora-create-community__container">
            {created ? (
              <div className="lumora-create-community__success">
                <div className="lumora-create-community__success-icon">
                  <FaUsers size={20} />
                </div>

                <span>COMMUNITY READY</span>

                <h2>Your community is ready to go.</h2>

                <p>
                  This is currently a frontend preview. Once
                  the backend is connected, your community
                  will be created and saved here.
                </p>

                <div className="lumora-create-community__success-actions">
                  <button
                    type="button"
                    onClick={() => setCreated(false)}
                  >
                    Edit Community
                  </button>

                  <Link to="/community/my">
                    My Communities
                    <FaArrowRight size={9} />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="lumora-create-community__layout">
                {/* =================================================
                    FORM
                ================================================= */}

                <form
                  className="lumora-create-community__form"
                  onSubmit={handleSubmit}
                >
                  <div className="lumora-create-community__form-header">
                    <span>COMMUNITY DETAILS</span>

                    <h2>Tell us about your community</h2>

                    <p>
                      Give your community a clear identity so
                      people know what they are joining.
                    </p>
                  </div>

                  {/* NAME */}

                  <div className="lumora-create-community__field">
                    <label htmlFor="community-name">
                      Community Name
                    </label>

                    <input
                      id="community-name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Fantasy Writers"
                      maxLength={60}
                      required
                    />

                    <small>
                      Choose a name that is easy to recognize.
                    </small>
                  </div>

                  {/* HANDLE */}

                  <div className="lumora-create-community__field">
                    <label htmlFor="community-handle">
                      Community Handle
                    </label>

                    <div className="lumora-create-community__input-prefix">
                      <span>lumora.com/c/</span>

                      <input
                        id="community-handle"
                        name="handle"
                        type="text"
                        value={formData.handle}
                        onChange={handleChange}
                        placeholder="fantasywriters"
                        maxLength={40}
                        required
                      />
                    </div>

                    <small>
                      Use lowercase letters, numbers and
                      hyphens.
                    </small>
                  </div>

                  {/* DESCRIPTION */}

                  <div className="lumora-create-community__field">
                    <label htmlFor="community-description">
                      Description
                    </label>

                    <textarea
                      id="community-description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="What is this community about?"
                      rows={5}
                      maxLength={300}
                      required
                    />

                    <small>
                      {formData.description.length}/300
                    </small>
                  </div>

                  {/* CATEGORY */}

                  <div className="lumora-create-community__field">
                    <label htmlFor="community-category">
                      Category
                    </label>

                    <select
                      id="community-category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      {categories.map((category) => (
                        <option
                          key={category}
                          value={category}
                        >
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* VISIBILITY */}

                  <div className="lumora-create-community__field">
                    <label>Community Visibility</label>

                    <div className="lumora-create-community__visibility">
                      <label
                        className={
                          formData.visibility === "public"
                            ? "lumora-create-community__visibility-card lumora-create-community__visibility-card--active"
                            : "lumora-create-community__visibility-card"
                        }
                      >
                        <input
                          type="radio"
                          name="visibility"
                          value="public"
                          checked={
                            formData.visibility === "public"
                          }
                          onChange={handleChange}
                        />

                        <FaGlobe size={16} />

                        <div>
                          <strong>Public</strong>

                          <span>
                            Anyone can discover and join.
                          </span>
                        </div>
                      </label>

                      <label
                        className={
                          formData.visibility === "private"
                            ? "lumora-create-community__visibility-card lumora-create-community__visibility-card--active"
                            : "lumora-create-community__visibility-card"
                        }
                      >
                        <input
                          type="radio"
                          name="visibility"
                          value="private"
                          checked={
                            formData.visibility === "private"
                          }
                          onChange={handleChange}
                        />

                        <FaLock size={15} />

                        <div>
                          <strong>Private</strong>

                          <span>
                            Only approved members can join.
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* RULES */}

                  <div className="lumora-create-community__field">
                    <label htmlFor="community-rules">
                      Community Rules
                    </label>

                    <textarea
                      id="community-rules"
                      name="rules"
                      value={formData.rules}
                      onChange={handleChange}
                      placeholder={
                        "1. Respect other members.\n2. Keep discussions relevant.\n3. No spam."
                      }
                      rows={6}
                      maxLength={800}
                    />

                    <small>
                      Set expectations for your members.
                    </small>
                  </div>

                  {/* ACTIONS */}

                  <div className="lumora-create-community__actions">
                    <Link to="/community">
                      Cancel
                    </Link>

                    <button type="submit">
                      Create Community
                      <FaArrowRight size={10} />
                    </button>
                  </div>
                </form>

                {/* =================================================
                    PREVIEW
                ================================================= */}

                <aside className="lumora-create-community__preview">
                  <div className="lumora-create-community__preview-label">
                    LIVE PREVIEW
                  </div>

                  <div className="lumora-create-community__preview-card">
                    <div className="lumora-create-community__preview-icon">
                      <FaUsers size={22} />
                    </div>

                    <span>
                      {formData.category}
                    </span>

                    <h3>
                      {formData.name ||
                        "Your Community Name"}
                    </h3>

                    <p>
                      {formData.description ||
                        "Your community description will appear here."}
                    </p>

                    <div className="lumora-create-community__preview-meta">
                      <span>
                        <FaUsers size={9} />
                        1 member
                      </span>

                      <span>
                        {formData.visibility === "public"
                          ? "Public"
                          : "Private"}
                      </span>
                    </div>

                    <button type="button">
                      Join Community
                    </button>
                  </div>

                  <div className="lumora-create-community__preview-note">
                    <strong>
                      A good community starts with clarity.
                    </strong>

                    <p>
                      Choose a focused topic, write clear
                      rules and give people a reason to join
                      the conversation.
                    </p>
                  </div>
                </aside>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default CreateCommunity;