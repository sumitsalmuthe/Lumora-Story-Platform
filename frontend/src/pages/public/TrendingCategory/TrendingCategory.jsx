import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaBookOpen,
  FaChartLine,
  FaComments,
  FaHeart,
} from "react-icons/fa6";

import Footer from "../../../components/layout/Footer/Footer";

import "./TrendingCategory.css";

const trendingPages = {
  now: {
    eyebrow: "TRENDING NOW",
    title: "Stories everyone is discovering.",
    description:
      "Stories gaining attention from readers across Lumora right now.",
    metric: "Trending",

    stories: [
      {
        id: "now-1",
        rank: 1,
        title: "Under a Dead Sky",
        author: "Aarav Mehta",
        category: "Horror",
        description:
          "When the world falls silent, survival becomes the only rule.",
        views: "92.4K",
        likes: "5.8K",
        comments: "1.9K",
        growth: "+84%",
      },
      {
        id: "now-2",
        rank: 2,
        title: "The Last Signal",
        author: "Mira Sen",
        category: "Sci-Fi",
        description:
          "A mysterious signal reaches Earth from somewhere beyond the stars.",
        views: "78.3K",
        likes: "4.6K",
        comments: "1.4K",
        growth: "+72%",
      },
      {
        id: "now-3",
        rank: 3,
        title: "Where Shadows Sleep",
        author: "Riya Kapoor",
        category: "Fantasy",
        description:
          "A forgotten kingdom hides a secret that should never be awakened.",
        views: "64.1K",
        likes: "3.9K",
        comments: "1.2K",
        growth: "+65%",
      },
    ],
  },

  rising: {
    eyebrow: "RISING STORIES",
    title: "Stories gaining momentum.",
    description:
      "Discover stories whose readership is growing quickly.",
    metric: "Growth",

    stories: [
      {
        id: "rising-1",
        rank: 1,
        title: "The City After Midnight",
        author: "Arjun Verma",
        category: "Mystery",
        description:
          "A city changes after midnight, and one detective knows why.",
        views: "38.2K",
        likes: "3.2K",
        comments: "840",
        growth: "+124%",
      },
      {
        id: "rising-2",
        rank: 2,
        title: "A World Between Pages",
        author: "Ishita Roy",
        category: "Fantasy",
        description:
          "A reader discovers a world hidden inside an unfinished book.",
        views: "31.7K",
        likes: "2.8K",
        comments: "720",
        growth: "+109%",
      },
      {
        id: "rising-3",
        rank: 3,
        title: "The Girl Who Remembered Tomorrow",
        author: "Anaya Singh",
        category: "Sci-Fi",
        description:
          "She remembers events that have not happened yet.",
        views: "27.4K",
        likes: "2.5K",
        comments: "680",
        growth: "+96%",
      },
    ],
  },

  "most-read": {
    eyebrow: "MOST READ",
    title: "The stories readers can't put down.",
    description:
      "Explore the most-read stories across Lumora.",
    metric: "Reads",

    stories: [
      {
        id: "read-1",
        rank: 1,
        title: "The Last Kingdom",
        author: "Dev Malhotra",
        category: "Fantasy",
        description:
          "A fallen prince returns to a kingdom that no longer remembers his name.",
        views: "245K",
        likes: "18.2K",
        comments: "4.8K",
        growth: "+41%",
      },
      {
        id: "read-2",
        rank: 2,
        title: "Under a Dead Sky",
        author: "Aarav Mehta",
        category: "Horror",
        description:
          "When the world falls silent, survival becomes the only rule.",
        views: "198K",
        likes: "15.4K",
        comments: "4.1K",
        growth: "+38%",
      },
      {
        id: "read-3",
        rank: 3,
        title: "The Silent Room",
        author: "Naina Kapoor",
        category: "Mystery",
        description:
          "Every house has a secret. This one has a room no one should enter.",
        views: "176K",
        likes: "12.8K",
        comments: "3.7K",
        growth: "+34%",
      },
    ],
  },

  "most-liked": {
    eyebrow: "MOST LIKED",
    title: "Stories readers are loving.",
    description:
      "Discover the stories receiving the most appreciation from readers.",
    metric: "Likes",

    stories: [
      {
        id: "liked-1",
        rank: 1,
        title: "The Last Kingdom",
        author: "Dev Malhotra",
        category: "Fantasy",
        description:
          "A fallen prince returns to a kingdom that no longer remembers his name.",
        views: "245K",
        likes: "18.2K",
        comments: "4.8K",
        growth: "+41%",
      },
      {
        id: "liked-2",
        rank: 2,
        title: "Letters Never Sent",
        author: "Kabir Rao",
        category: "Romance",
        description:
          "Some stories begin with words that were never meant to be read.",
        views: "112K",
        likes: "17.6K",
        comments: "3.9K",
        growth: "+53%",
      },
      {
        id: "liked-3",
        rank: 3,
        title: "Where Shadows Sleep",
        author: "Riya Kapoor",
        category: "Fantasy",
        description:
          "A forgotten kingdom hides a secret that should never be awakened.",
        views: "128K",
        likes: "15.9K",
        comments: "3.2K",
        growth: "+47%",
      },
    ],
  },

  "most-discussed": {
    eyebrow: "MOST DISCUSSED",
    title: "Stories creating conversations.",
    description:
      "See the stories generating the most discussion among readers.",
    metric: "Comments",

    stories: [
      {
        id: "discussion-1",
        rank: 1,
        title: "The Silent Room",
        author: "Naina Kapoor",
        category: "Mystery",
        description:
          "Every house has a secret. This one has a room no one should enter.",
        views: "176K",
        likes: "12.8K",
        comments: "8.4K",
        growth: "+61%",
      },
      {
        id: "discussion-2",
        rank: 2,
        title: "Under a Dead Sky",
        author: "Aarav Mehta",
        category: "Horror",
        description:
          "When the world falls silent, survival becomes the only rule.",
        views: "198K",
        likes: "15.4K",
        comments: "7.9K",
        growth: "+54%",
      },
      {
        id: "discussion-3",
        rank: 3,
        title: "The Last Signal",
        author: "Mira Sen",
        category: "Sci-Fi",
        description:
          "A mysterious signal reaches Earth from somewhere beyond the stars.",
        views: "154K",
        likes: "11.6K",
        comments: "6.8K",
        growth: "+49%",
      },
    ],
  },

  "this-week": {
    eyebrow: "POPULAR THIS WEEK",
    title: "This week's biggest stories.",
    description:
      "The stories dominating Lumora's reading activity this week.",
    metric: "This week",

    stories: [
      {
        id: "week-1",
        rank: 1,
        title: "Under a Dead Sky",
        author: "Aarav Mehta",
        category: "Horror",
        description:
          "When the world falls silent, survival becomes the only rule.",
        views: "92.4K",
        likes: "5.8K",
        comments: "1.9K",
        growth: "+84%",
      },
      {
        id: "week-2",
        rank: 2,
        title: "Seven Minutes to Dawn",
        author: "Rahul Shah",
        category: "Thriller",
        description:
          "Seven minutes remain before everything changes forever.",
        views: "86K",
        likes: "6.9K",
        comments: "1.8K",
        growth: "+76%",
      },
      {
        id: "week-3",
        rank: 3,
        title: "The Last Signal",
        author: "Mira Sen",
        category: "Sci-Fi",
        description:
          "A mysterious signal reaches Earth from somewhere beyond the stars.",
        views: "78.3K",
        likes: "4.6K",
        comments: "1.4K",
        growth: "+72%",
      },
    ],
  },

  new: {
    eyebrow: "NEW & TRENDING",
    title: "Fresh stories getting noticed.",
    description:
      "New stories already catching the attention of Lumora readers.",
    metric: "New",

    stories: [
      {
        id: "new-1",
        rank: 1,
        title: "The House Beyond the Rain",
        author: "Meera Joshi",
        category: "Mystery",
        description:
          "A house appears only when it rains, and someone is waiting inside.",
        views: "12.8K",
        likes: "1.4K",
        comments: "320",
        growth: "+91%",
      },
      {
        id: "new-2",
        rank: 2,
        title: "Echoes of Tomorrow",
        author: "Karan Shah",
        category: "Sci-Fi",
        description:
          "A message from tomorrow changes one man's entire life.",
        views: "10.6K",
        likes: "1.2K",
        comments: "280",
        growth: "+83%",
      },
      {
        id: "new-3",
        rank: 3,
        title: "The Forgotten Garden",
        author: "Sara Khan",
        category: "Fantasy",
        description:
          "A hidden garden holds the memories of everyone who enters it.",
        views: "9.4K",
        likes: "1.1K",
        comments: "240",
        growth: "+78%",
      },
    ],
  },
};

function TrendingCategory() {
const { trendType } = useParams();

const data =
  trendingPages[trendType] || trendingPages.now;

  return (
    <>
      <main className="lumora-trending-category">
        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="lumora-trending-category__hero">
          <div className="lumora-trending-category__container">
            <Link
              to="/trending"
              className="lumora-trending-category__back"
            >
              <FaArrowLeft size={10} />
              Back to Trending
            </Link>

            <span className="lumora-trending-category__eyebrow">
              {data.eyebrow}
            </span>

            <h1>{data.title}</h1>

            <p>{data.description}</p>
          </div>
        </section>

        {/* =====================================================
            STORIES
        ===================================================== */}

        <section className="lumora-trending-category__stories">
          <div className="lumora-trending-category__container">
            <div className="lumora-trending-category__header">
              <div>
                <span>DISCOVER</span>

                <h2>{data.eyebrow}</h2>
              </div>

              <span>
                {data.stories.length} stories
              </span>
            </div>

            <div className="lumora-trending-category__list">
              {data.stories.map((story) => (
                <article
                  key={story.id}
                  className="lumora-trending-category__story"
                >
                  <div className="lumora-trending-category__rank">
                    #{story.rank}
                  </div>

                  <div className="lumora-trending-category__cover">
                    <FaBookOpen size={19} />
                  </div>

                  <div className="lumora-trending-category__content">
                    <span className="lumora-trending-category__genre">
                      {story.category}
                    </span>

                    <Link
                      to={`/stories/${story.id}`}
                      className="lumora-trending-category__title"
                    >
                      {story.title}
                    </Link>

                    <span className="lumora-trending-category__author">
                      by {story.author}
                    </span>

                    <p>{story.description}</p>

                    <div className="lumora-trending-category__stats">
                      <span>
                        <FaBookOpen size={9} />
                        {story.views}
                      </span>

                      <span>
                        <FaHeart size={9} />
                        {story.likes}
                      </span>

                      <span>
                        <FaComments size={9} />
                        {story.comments}
                      </span>

                      <strong>
                        {data.metric === "Growth"
                          ? story.growth
                          : data.metric}
                      </strong>
                    </div>
                  </div>

                  <Link
                    to={`/stories/${story.id}`}
                    className="lumora-trending-category__read"
                    aria-label={`Read ${story.title}`}
                  >
                    <FaArrowRight size={11} />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            OTHER TRENDING
        ===================================================== */}

        <section className="lumora-trending-category__explore">
          <div className="lumora-trending-category__container">
            <div className="lumora-trending-category__explore-box">
              <FaChartLine size={18} />

              <div>
                <span>KEEP EXPLORING</span>

                <h2>Find more stories trending on Lumora.</h2>
              </div>

              <Link to="/trending">
                Explore Trending
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

export default TrendingCategory;