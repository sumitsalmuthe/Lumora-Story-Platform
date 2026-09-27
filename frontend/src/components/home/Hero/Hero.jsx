import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight, FaPenNib } from "react-icons/fa";

import SearchBar from "../../common/SearchBar/SearchBar";

import "./Hero.css";

function Hero() {
  const navigate = useNavigate();

  const handleSearch = (query) => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      navigate("/search");
      return;
    }

    navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  };

  return (
    <section className="lumora-hero">
      <div className="lumora-hero__container">
        <div className="lumora-hero__content">

          {/* Eyebrow */}
          <p className="lumora-hero__eyebrow">
            READ • WRITE • INSPIRE
          </p>

          {/* Title */}
          <h1 className="lumora-hero__title">
            Find a story.
            <br />
            <span>Find your world.</span>
          </h1>

          {/* Description */}
          <p className="lumora-hero__description">
            Discover stories from emerging writers, explore new
            worlds, and share the stories you've always wanted to tell.
          </p>

          {/* Actions */}
          <div className="lumora-hero__actions">
            <Link
              to="/discover"
              className="lumora-hero__primary-action"
            >
              Explore Stories
              <FaArrowRight size={12} />
            </Link>

            <Link
              to="/become-writer"
              className="lumora-hero__secondary-action"
            >
              <FaPenNib size={13} />
              Start Writing
            </Link>
          </div>

          {/* Search */}
          <div className="lumora-hero__search">
            <SearchBar
              onSubmit={handleSearch}
              placeholder="Search stories, writers, genres..."
            />
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;