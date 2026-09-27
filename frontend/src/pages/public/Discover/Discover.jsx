import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Filter, Search } from "lucide-react";

import Navbar from "../../../components/layout/Navbar/Navbar";
import Footer from "../../../components/layout/Footer/Footer";
import StoryRow from "../../../components/story/StoryRow/StoryRow";
import storyService from "../../../services/stories/storyService";

import "./Discover.css";

const categories = [
  "All",
  "Fantasy",
  "Romance",
  "Horror",
  "Mystery",
  "Sci-Fi",
  "Thriller",
  "Fiction",
];

function Discover() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch real stories from backend
  useEffect(() => {
    const loadStories = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await storyService.getStories();

        const storyData =
          response?.stories ||
          response?.data?.stories ||
          [];

        setStories(Array.isArray(storyData) ? storyData : []);
      } catch (err) {
        console.error("Failed to load stories:", err);

        setError(
          err?.response?.data?.message ||
            "Unable to load stories right now."
        );

        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    loadStories();
  }, []);

  // Search + category filtering
  const filteredStories = useMemo(() => {
    const query = search.trim().toLowerCase();

    return stories.filter((story) => {
      const authorUsername =
        story?.author?.username?.toLowerCase() || "";

      const title =
        story?.title?.toLowerCase() || "";

      const category =
        story?.category?.toLowerCase() || "";

      const matchesCategory =
        activeCategory === "All" ||
        category === activeCategory.toLowerCase();

      const matchesSearch =
        !query ||
        title.includes(query) ||
        authorUsername.includes(query) ||
        category.includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [stories, search, activeCategory]);

  // Popular stories based on views
const popularStories = useMemo(() => {
  return [...stories]
    .sort((a, b) => {
      return (b?.views || 0) - (a?.views || 0);
    })
    .slice(0, 4);
}, [stories]);

// Latest stories
const latestStories = useMemo(() => {
  return [...stories].slice(0, 4);
}, [stories]);

// Search/category is active
const isFiltering = search.trim() !== "" || activeCategory !== "All";

  return (
    <div className="lumora-discover">
      <Navbar />

      <main className="lumora-discover__main">
        {/* Hero */}
        <section className="lumora-discover__hero">
          <div className="lumora-discover__container">
            <span className="lumora-discover__eyebrow">
              DISCOVER STORIES
            </span>

            <h1>
              Find your next
              <span> favorite story.</span>
            </h1>

            <p>
              Explore stories, discover new writers and find worlds
              worth getting lost in.
            </p>

            <div className="lumora-discover__search">
              <Search size={15} strokeWidth={1.8} />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search stories, writers or genres..."
                aria-label="Search stories"
              />
            </div>
          </div>
        </section>

        {/* Category filters */}
        <section className="lumora-discover__filters">
          <div className="lumora-discover__container">
            <div className="lumora-discover__filter-header">
              <div>
                <span className="lumora-discover__filter-label">
                  BROWSE BY GENRE
                </span>

                <h2>Explore stories</h2>
              </div>

              <Filter size={14} strokeWidth={1.8} />
            </div>

            <div className="lumora-discover__categories">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={
                    activeCategory === category
                      ? "lumora-discover__category lumora-discover__category--active"
                      : "lumora-discover__category"
                  }
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Loading */}
        {loading && (
          <section className="lumora-discover__section">
            <div className="lumora-discover__container">
              <div className="lumora-discover__empty">
                <BookOpen size={22} strokeWidth={1.8} />

                <h3>Loading stories...</h3>

                <p>
                  Please wait while we fetch the latest stories.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Error */}
        {!loading && error && (
          <section className="lumora-discover__section">
            <div className="lumora-discover__container">
              <div className="lumora-discover__empty">
                <BookOpen size={22} strokeWidth={1.8} />

                <h3>Could not load stories</h3>

                <p>{error}</p>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                >
                  Try again
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Real content */}
        {!loading && !error && (
          <>

            {/* Popular */}
{!isFiltering && (
  <section className="lumora-discover__section">
              <div className="lumora-discover__container">
                <div className="lumora-discover__section-header">
                  <div>
                    <span>POPULAR</span>
                    <h2>Stories readers love</h2>
                  </div>

                  <Link to="/popular">
                    View all
                    <ArrowRight
                      size={10}
                      strokeWidth={1.8}
                    />
                  </Link>
                </div>

                {popularStories.length > 0 ? (
                  <StoryRow
                    stories={popularStories}
                    columns={4}
                    showDescription={false}
                    showStats
                    showBookmark
                  />
                ) : (
                  <div className="lumora-discover__empty">
                    <BookOpen
                      size={22}
                      strokeWidth={1.8}
                    />

                    <h3>No published stories yet</h3>

                    <p>
                      Published stories will appear here.
                    </p>
                  </div>
                )}
              </div>
            </section>
            )}

            {/* Latest */}
{!isFiltering && (
  <section className="lumora-discover__section lumora-discover__section--muted">
              <div className="lumora-discover__container">
                <div className="lumora-discover__section-header">
                  <div>
                    <span>NEW & FRESH</span>
                    <h2>Latest stories</h2>
                  </div>

                  <Link to="/discover">
                    Explore all
                    <BookOpen
                      size={22}
                      strokeWidth={1.8}
                    />
                  </Link>
                </div>

                {latestStories.length > 0 ? (
                  <StoryRow
                    stories={latestStories}
                    columns={4}
                    showDescription={false}
                    showStats
                    showBookmark
                  />
                ) : (
                  <div className="lumora-discover__empty">
                    <BookOpen
                      size={22}
                      strokeWidth={1.8}
                    />

                    <h3>No latest stories yet</h3>

                    <p>
                      New published stories will appear here.
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

            {/* All stories */}
            <section className="lumora-discover__section">
              <div className="lumora-discover__container">
                <div className="lumora-discover__section-header">
                  <div>
                    <span>DISCOVER</span>

                    <h2>
                      {activeCategory === "All"
                        ? "All stories"
                        : `${activeCategory} stories`}
                    </h2>
                  </div>

                  <span className="lumora-discover__result-count">
                    {filteredStories.length} stories
                  </span>
                </div>

                {filteredStories.length > 0 ? (
                  <StoryRow
                    stories={filteredStories}
                    columns={4}
                    showDescription={false}
                    showStats
                    showBookmark
                  />
                ) : (
                  <div className="lumora-discover__empty">
                    <BookOpen
                      size={22}
                      strokeWidth={1.8}
                    />

                    <h3>No stories found</h3>

                    <p>
                      Try another search or choose a different genre.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setActiveCategory("All");
                      }}
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Discover;