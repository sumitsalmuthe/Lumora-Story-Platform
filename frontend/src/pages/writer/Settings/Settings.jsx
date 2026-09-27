import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowLeft,
  User,
  Shield,
  Bell,
  Globe,
  Lock,
  Save,
} from "lucide-react";

import apiClient from "../../../services/api/apiClient";

import "./Settings.css";

function Settings() {
  const [settings, setSettings] = useState({
    displayName: "",
    username: "",
    bio: "",
    email: "",
    language: "English",
    profileVisibility: "Public",
    emailNotifications: true,
    commentNotifications: true,
    followerNotifications: true,
    showReadingActivity: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [saved, setSaved] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // LOAD REAL PROFILE
  // =====================================================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await apiClient.get("/profile/me");

        const profile =
          response?.profile ||
          response?.data?.profile ||
          response?.data ||
          {};

        setSettings((current) => ({
          ...current,

          displayName:
            profile.displayName ||
            profile.username ||
            "",

          username:
            profile.username || "",

          bio:
            profile.bio || "",

          email:
            profile.email || "",

          language:
            profile.language ||
            "English",
        }));
      } catch (err) {
        console.error(
          "Settings profile loading error:",
          err
        );

        setError(
          err?.response?.data?.message ||
            "Unable to load your profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setSettings((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setSaved(false);
    setMessage("");
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response =
        await apiClient.put(
          "/profile/me",
          {
            username:
              settings.username.trim(),

            bio:
              settings.bio.trim(),
          }
        );

      if (response?.success === false) {
        throw new Error(
          response.message ||
            "Profile update failed."
        );
      }

      setSaved(true);

      setMessage(
        response?.message ||
          response?.data?.message ||
          "Profile updated successfully."
      );
    } catch (err) {
      console.error(
        "Settings save error:",
        err
      );

      setSaved(false);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to save profile changes."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="writer-settings-page">
        <main className="writer-settings-main">
          <div
            style={{
              padding: "80px 20px",
              textAlign: "center",
              color: "#888",
            }}
          >
            Loading settings...
          </div>
        </main>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="writer-settings-page">

      {/* TOP BAR */}

      <header className="settings-topbar">

        <Link
          to="/dashboard"
          className="settings-back"
        >
          <ArrowLeft size={16} />
          <span>
            Back to Dashboard
          </span>
        </Link>

        <div className="settings-title">
          <span>Writer</span>
          <strong>Settings</strong>
        </div>

        <div
          className={`settings-save-status ${
            saved
              ? "saved"
              : "changed"
          }`}
        >
          <span />

          {saved
            ? "All changes saved"
            : "Unsaved changes"}
        </div>

      </header>

      <main className="writer-settings-main">

        {/* INTRO */}

        <div className="settings-intro">

          <span className="settings-eyebrow">
            ACCOUNT SETTINGS
          </span>

          <h1>
            Manage your writer space.
          </h1>

          <p>
            Update your profile, privacy
            and notification preferences
            from one place.
          </p>

        </div>

        {/* ERROR */}

        {error && (
          <div
            style={{
              marginBottom: "20px",
              padding: "14px 16px",
              borderRadius: "10px",
              background: "#fff3f0",
              color: "#d94f2b",
              border:
                "1px solid #ffd2c8",
            }}
          >
            {error}
          </div>
        )}

        {/* SUCCESS */}

        {message && (
          <div
            style={{
              marginBottom: "20px",
              padding: "14px 16px",
              borderRadius: "10px",
              background: "#effaf3",
              color: "#26834d",
              border:
                "1px solid #ccebd8",
            }}
          >
            {message}
          </div>
        )}

        <div className="settings-layout">

          {/* LEFT NAV */}

          <aside className="settings-nav">

            <a
              href="#profile"
              className="settings-nav-item active"
            >
              <User size={16} />
              <span>Profile</span>
            </a>

            <a
              href="#privacy"
              className="settings-nav-item"
            >
              <Shield size={16} />
              <span>Privacy</span>
            </a>

            <a
              href="#notifications"
              className="settings-nav-item"
            >
              <Bell size={16} />
              <span>Notifications</span>
            </a>

            <a
              href="#preferences"
              className="settings-nav-item"
            >
              <Globe size={16} />
              <span>Preferences</span>
            </a>

          </aside>

          {/* CONTENT */}

          <section className="settings-content">

            {/* =================================================
                PROFILE
            ================================================= */}

            <section
              className="settings-card"
              id="profile"
            >

              <div className="settings-card-heading">

                <div className="settings-card-icon">
                  <User size={18} />
                </div>

                <div>
                  <h2>
                    Profile information
                  </h2>

                  <p>
                    This information will appear
                    on your public writer profile.
                  </p>
                </div>

              </div>

              {/* AVATAR */}

              <div className="settings-avatar-row">

                <div className="settings-avatar">
                  {(
                    settings.username ||
                    "W"
                  )
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>

                  <strong>
                    Profile picture
                  </strong>

                  <p>
                    JPG, PNG or WEBP.
                    Recommended size
                    400 × 400.
                  </p>

                  <button
                    type="button"
                    className="outline-small-button"
                    disabled
                    title="Avatar upload can be connected separately"
                  >
                    Change picture
                  </button>

                </div>

              </div>

              {/* DISPLAY NAME + USERNAME */}

              <div className="settings-form-grid">

                <div className="settings-field">

                  <label htmlFor="displayName">
                    Display name
                  </label>

                  <input
                    id="displayName"
                    name="displayName"
                    value={
                      settings.displayName
                    }
                    onChange={handleChange}
                    disabled
                  />

                  <small>
                    Display name is currently
                    read-only because the
                    backend profile API does
                    not update this field.
                  </small>

                </div>

                <div className="settings-field">

                  <label htmlFor="username">
                    Username
                  </label>

                  <div className="username-input">

                    <span>@</span>

                    <input
                      id="username"
                      name="username"
                      value={
                        settings.username
                      }
                      onChange={handleChange}
                    />

                  </div>

                </div>

              </div>

              {/* BIO */}

              <div className="settings-field">

                <label htmlFor="bio">
                  Bio
                </label>

                <textarea
                  id="bio"
                  name="bio"
                  value={settings.bio}
                  onChange={handleChange}
                  rows="4"
                  maxLength="250"
                />

                <small>
                  {settings.bio.length}/250
                </small>

              </div>

              {/* EMAIL */}

              <div className="settings-field">

                <label htmlFor="email">
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={settings.email}
                  disabled
                />

                <small>
                  Your email is not publicly
                  displayed. Email changes
                  are not supported by the
                  current profile API.
                </small>

              </div>

            </section>

            {/* =================================================
                PRIVACY
            ================================================= */}

            <section
              className="settings-card"
              id="privacy"
            >

              <div className="settings-card-heading">

                <div className="settings-card-icon">
                  <Lock size={18} />
                </div>

                <div>
                  <h2>Privacy</h2>

                  <p>
                    Control how readers can
                    see your activity.
                  </p>
                </div>

              </div>

              <div className="settings-option">

                <div className="settings-option-text">

                  <strong>
                    Profile visibility
                  </strong>

                  <span>
                    Decide who can view your
                    writer profile.
                  </span>

                </div>

                <select
                  name="profileVisibility"
                  value={
                    settings.profileVisibility
                  }
                  onChange={handleChange}
                  disabled
                  title="Privacy preference API is not available yet"
                >
                  <option value="Public">
                    Public
                  </option>

                  <option value="Private">
                    Private
                  </option>
                </select>

              </div>

              <div className="settings-option">

                <div className="settings-option-text">

                  <strong>
                    Show reading activity
                  </strong>

                  <span>
                    Allow readers to see stories
                    you are currently reading.
                  </span>

                </div>

                <label className="toggle">

                  <input
                    type="checkbox"
                    name="showReadingActivity"
                    checked={
                      settings.showReadingActivity
                    }
                    onChange={handleChange}
                    disabled
                  />

                  <span className="toggle-slider" />

                </label>

              </div>

            </section>

            {/* =================================================
                NOTIFICATIONS
            ================================================= */}

            <section
              className="settings-card"
              id="notifications"
            >

              <div className="settings-card-heading">

                <div className="settings-card-icon">
                  <Bell size={18} />
                </div>

                <div>
                  <h2>
                    Notifications
                  </h2>

                  <p>
                    Choose what you want
                    to hear about.
                  </p>
                </div>

              </div>

              <div className="settings-option">

                <div className="settings-option-text">

                  <strong>
                    Email notifications
                  </strong>

                  <span>
                    Receive important account
                    updates by email.
                  </span>

                </div>

                <label className="toggle">

                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={
                      settings.emailNotifications
                    }
                    onChange={handleChange}
                    disabled
                  />

                  <span className="toggle-slider" />

                </label>

              </div>

              <div className="settings-option">

                <div className="settings-option-text">

                  <strong>
                    Comment notifications
                  </strong>

                  <span>
                    Get notified when readers
                    comment on your stories.
                  </span>

                </div>

                <label className="toggle">

                  <input
                    type="checkbox"
                    name="commentNotifications"
                    checked={
                      settings.commentNotifications
                    }
                    onChange={handleChange}
                    disabled
                  />

                  <span className="toggle-slider" />

                </label>

              </div>

              <div className="settings-option">

                <div className="settings-option-text">

                  <strong>
                    Follower notifications
                  </strong>

                  <span>
                    Get notified when someone
                    follows your profile.
                  </span>

                </div>

                <label className="toggle">

                  <input
                    type="checkbox"
                    name="followerNotifications"
                    checked={
                      settings.followerNotifications
                    }
                    onChange={handleChange}
                    disabled
                  />

                  <span className="toggle-slider" />

                </label>

              </div>

            </section>

            {/* =================================================
                PREFERENCES
            ================================================= */}

            <section
              className="settings-card"
              id="preferences"
            >

              <div className="settings-card-heading">

                <div className="settings-card-icon">
                  <Globe size={18} />
                </div>

                <div>
                  <h2>
                    Preferences
                  </h2>

                  <p>
                    Customize your Lumora
                    experience.
                  </p>
                </div>

              </div>

              <div className="settings-option">

                <div className="settings-option-text">

                  <strong>
                    Content language
                  </strong>

                  <span>
                    Choose the language used
                    for your writing experience.
                  </span>

                </div>

                <select
                  name="language"
                  value={
                    settings.language
                  }
                  onChange={handleChange}
                  disabled
                >
                  <option value="English">
                    English
                  </option>

                  <option value="Hindi">
                    Hindi
                  </option>

                  <option value="Marathi">
                    Marathi
                  </option>

                </select>

              </div>

            </section>

            {/* =================================================
                SAVE
            ================================================= */}

            <div className="settings-actions">

              <span>
                {saved
                  ? message ||
                    "Your settings are up to date."
                  : "You have unsaved changes."}
              </span>

              <button
                type="button"
                className="settings-save-button"
                onClick={handleSave}
                disabled={
                  saving || saved
                }
              >

                <Save size={15} />

                {saving
                  ? "Saving..."
                  : "Save changes"}

              </button>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default Settings;