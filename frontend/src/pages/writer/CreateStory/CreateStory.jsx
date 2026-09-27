import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Image,
  X,
  Check,
  ChevronDown,
} from "lucide-react";

import lumoraLogo from "../../../assets/logo/lumora-logo-bold.svg";
import storyService from "../../../services/stories/storyService";
import uploadService from "../../../services/uploads/uploadService";

import "./CreateStory.css";

function CreateStory() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    shortDescription: "",
    category: "",
    language: "English",
    storyType: "Fiction",
    targetAudience: "General",
    mature: false,
    tags: [],
    visibility: "Public",
  });

  const [tagInput, setTagInput] = useState("");
  const [coverPreview, setCoverPreview] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "Fantasy",
    "Romance",
    "Horror",
    "Mystery",
    "Sci-Fi",
    "Thriller",
    "Fiction",
    "Poetry",
    "Nonfiction",
  ];

  const storyTypes = [
    "Fiction",
    "Fanfic",
    "Nonfiction",
    "Poetry",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setCoverFile(file);
    setCoverPreview(imageUrl);
  };

  const addTag = () => {
    const tag = tagInput.trim();

    if (!tag) return;

    if (formData.tags.includes(tag)) {
      setTagInput("");
      return;
    }

    if (formData.tags.length >= 8) return;

    setFormData((current) => ({
      ...current,
      tags: [...current.tags, tag],
    }));

    setTagInput("");
  };

  const removeTag = (tagToRemove) => {
    setFormData((current) => ({
      ...current,
      tags: current.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      let coverImage = "";
      if (coverFile) {
        const upload = await uploadService.uploadImage(coverFile);
        coverImage = upload.url;
      }
      await storyService.createStory({ ...formData, coverImage });
navigate("/writer/my-stories", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to create story. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-story-page">
      {/* Top bar */}
      <header className="create-story-topbar">
        <Link to="/dashboard" className="back-link">
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        <div className="create-story-brand">
  <img
    src={lumoraLogo}
    alt="Lumora"
    className="create-story-logo"
  />
</div>

        <span className="draft-status">
          <span className="status-dot" />
          Draft saved
        </span>
      </header>

      <main className="create-story-main">
        {/* Header */}
        <div className="create-story-heading">
          <div>
            <span className="eyebrow">NEW STORY</span>
            <h1>Bring your story to life.</h1>
            <p>
              Tell readers what your story is about and give your world a
              place to begin.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <p className="auth-form-error" role="alert">{error}</p>}
          <div className="create-story-layout">
            {/* Left */}
            <section className="story-form-card">
              <div className="form-section-heading">
                <div className="form-step">01</div>

                <div>
                  <h2>Story details</h2>
                  <p>Start with the basics of your story.</p>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="title">
                  Story title <span>*</span>
                </label>

                <input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Give your story a memorable title"
                  maxLength={100}
                  required
                />

                <small>{formData.title.length}/100</small>
              </div>

              <div className="form-group">
                <label htmlFor="subtitle">Subtitle</label>

                <input
                  id="subtitle"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  placeholder="A short line that captures your story"
                  maxLength={160}
                />
              </div>

              <div className="form-group">
                <label htmlFor="shortDescription">
                  Short description <span>*</span>
                </label>

                <textarea
                  id="shortDescription"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  placeholder="What is your story about?"
                  rows="5"
                  maxLength={500}
                  required
                />

                <small>{formData.shortDescription.length}/500</small>
              </div>

              {/* Category */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">
                    Category <span>*</span>
                  </label>

                  <div className="select-wrapper">
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Choose a category</option>

                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>

                    <ChevronDown size={16} />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="storyType">Story type</label>

                  <div className="select-wrapper">
                    <select
                      id="storyType"
                      name="storyType"
                      value={formData.storyType}
                      onChange={handleChange}
                    >
                      {storyTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>

                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              {/* Language */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="language">Language</label>

                  <div className="select-wrapper">
                    <select
                      id="language"
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                    >
                      <option>English</option>
                      <option>Hindi</option>
                      <option>Marathi</option>
                      <option>Other</option>
                    </select>

                    <ChevronDown size={16} />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="targetAudience">Target audience</label>

                  <div className="select-wrapper">
                    <select
                      id="targetAudience"
                      name="targetAudience"
                      value={formData.targetAudience}
                      onChange={handleChange}
                    >
                      <option>General</option>
                      <option>Young Adult</option>
                      <option>Adult</option>
                    </select>

                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="form-group">
                <label htmlFor="tags">Tags</label>

                <div className="tag-input">
                  <div className="tag-list">
                    {formData.tags.map((tag) => (
                      <span className="tag" key={tag}>
                        {tag}

                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          aria-label={`Remove ${tag}`}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}

                    <input
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      placeholder={
                        formData.tags.length
                          ? "Add another tag..."
                          : "Fantasy, magic, adventure..."
                      }
                    />
                  </div>
                </div>

                <small>Press Enter to add a tag. Up to 8 tags.</small>
              </div>
            </section>

            {/* Right */}
            <aside className="create-story-sidebar">
              {/* Cover */}
              <section className="cover-card">
                <div className="form-section-heading compact">
                  <div className="form-step">02</div>

                  <div>
                    <h2>Story cover</h2>
                    <p>Choose an image that represents your story.</p>
                  </div>
                </div>

                <label className="cover-upload">
                  {coverPreview ? (
                    <img src={coverPreview} alt="Story cover preview" />
                  ) : (
                    <>
                      <div className="cover-icon">
                        <Image size={22} />
                      </div>

                      <strong>Upload a cover</strong>

                      <span>
                        JPG, PNG or WEBP
                        <br />
                        Recommended 600 × 900
                      </span>
                    </>
                  )}

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleCoverChange}
                  />
                </label>
              </section>

              {/* Publishing */}
              <section className="publishing-card">
                <div className="form-section-heading compact">
                  <div className="form-step">03</div>

                  <div>
                    <h2>Publishing</h2>
                    <p>Choose how readers can discover your story.</p>
                  </div>
                </div>

                <div className="visibility-options">
                  <label
                    className={
                      formData.visibility === "Public"
                        ? "visibility-option selected"
                        : "visibility-option"
                    }
                  >
                    <input
                      type="radio"
                      name="visibility"
                      value="Public"
                      checked={formData.visibility === "Public"}
                      onChange={handleChange}
                    />

                    <div>
                      <strong>Public</strong>
                      <span>Anyone can discover and read it.</span>
                    </div>
                  </label>

                  <label
                    className={
                      formData.visibility === "Private"
                        ? "visibility-option selected"
                        : "visibility-option"
                    }
                  >
                    <input
                      type="radio"
                      name="visibility"
                      value="Private"
                      checked={formData.visibility === "Private"}
                      onChange={handleChange}
                    />

                    <div>
                      <strong>Private</strong>
                      <span>Only you can access this story.</span>
                    </div>
                  </label>
                </div>

                <label className="mature-option">
                  <input
                    type="checkbox"
                    name="mature"
                    checked={formData.mature}
                    onChange={handleChange}
                  />

                  <span>
                    <strong>Mature content</strong>
                    <small>
                      This story contains mature themes or content.
                    </small>
                  </span>
                </label>
              </section>

              {/* Tips */}
              <section className="create-tips">
                <div className="tips-icon">
                  <BookOpen size={17} />
                </div>

                <div>
                  <strong>Make it discoverable</strong>

                  <p>
                    A clear description, relevant category and useful tags
                    help readers find your story.
                  </p>
                </div>
              </section>
            </aside>
          </div>

          {/* Footer actions */}
          <div className="create-story-footer">
            <Link to="/writer/my-stories" className="cancel-button">
              Cancel
            </Link>

            <div className="footer-actions">
              <button type="button" className="save-draft-button">
                Save as Draft
              </button>

              <button type="submit" className="publish-button" disabled={isSubmitting}>
                <Check size={16} />
                {isSubmitting ? "Creating..." : "Create Story"}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

export default CreateStory;
