import { Link } from "react-router-dom";
import {
  FaBook,
  FaGhost,
  FaHeart,
  FaMask,
  FaRocket,
  FaWandMagicSparkles,
  FaMagnifyingGlass,
  FaGun,
  FaFaceLaugh,
  FaMoon,
  FaPersonRunning,
  FaFeatherPointed,
} from "react-icons/fa6";

import SectionHeader from "../../common/SectionHeader/SectionHeader";

import "./Genre.css";

const genres = [
  {
    name: "Fantasy",
    description: "Magic, kingdoms and impossible worlds.",
    path: "/categories/fantasy",
    icon: FaWandMagicSparkles,
  },
  {
    name: "Romance",
    description: "Love, connection and unforgettable emotions.",
    path: "/categories/romance",
    icon: FaHeart,
  },
  {
    name: "Horror",
    description: "Dark stories that stay with you.",
    path: "/categories/horror",
    icon: FaGhost,
  },
  {
    name: "Mystery",
    description: "Secrets, clues and unexpected answers.",
    path: "/categories/mystery",
    icon: FaMask,
  },
  {
    name: "Sci-Fi",
    description: "Technology, space and the future.",
    path: "/categories/sci-fi",
    icon: FaRocket,
  },
  {
    name: "Fiction",
    description: "Discover stories without limits.",
    path: "/categories/fiction",
    icon: FaBook,
  },
  {
    name: "Thriller",
    description: "Suspense, danger and stories that keep you guessing.",
    path: "/categories/thriller",
    icon: FaMagnifyingGlass,
  },
  {
    name: "Adventure",
    description: "Journeys, challenges and worlds waiting to be explored.",
    path: "/categories/adventure",
    icon: FaPersonRunning,
  },
  {
    name: "Comedy",
    description: "Funny characters, chaos and stories that make you smile.",
    path: "/categories/comedy",
    icon: FaFaceLaugh,
  },
  {
    name: "Dark Fiction",
    description: "Bleak worlds, difficult choices and darker stories.",
    path: "/categories/dark-fiction",
    icon: FaMoon,
  },
  {
    name: "Action",
    description: "Fast-paced stories filled with conflict and excitement.",
    path: "/categories/action",
    icon: FaGun,
  },
  {
    name: "Poetry",
    description: "Words, emotions and ideas shaped into verse.",
    path: "/categories/poetry",
    icon: FaFeatherPointed,
  },
];

/*
  Each horizontal group contains two genre cards.
  This creates the requested 2-column + horizontal-scroll layout.
*/
const genreColumns = [];

for (let index = 0; index < genres.length; index += 2) {
  genreColumns.push(genres.slice(index, index + 2));
}

function Genre() {
  return (
    <section className="lumora-genre">
      <div className="lumora-genre__container">
        <SectionHeader
          title="Explore by Genre"
          description="Find your next story by the kind of world you want to enter."
          viewAllPath="/categories"
        />

        <div className="lumora-genre__scroll">
          {genreColumns.map((column, columnIndex) => (
            <div
              className="lumora-genre__column"
              key={`genre-column-${columnIndex}`}
            >
              {column.map((genre) => {
                const Icon = genre.icon;

                return (
                  <Link
                    key={genre.name}
                    to={genre.path}
                    className="lumora-genre__card"
                  >
                    <div className="lumora-genre__icon">
                      <Icon size={18} />
                    </div>

                    <div className="lumora-genre__content">
                      <h3>{genre.name}</h3>

                      <p>{genre.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Genre;