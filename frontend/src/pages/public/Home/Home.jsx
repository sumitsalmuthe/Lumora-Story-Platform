import Navbar from "../../../components/layout/Navbar/Navbar";
import Footer from "../../../components/layout/Footer/Footer";
import Hero from "../../../components/home/Hero/Hero";
import LatestBanners from "../../../components/home/LatestBanners/LatestBanners";
import FeaturedStories from "../../../components/home/FeaturedStories/FeaturedStories";
import TrendingStories from "../../../components/home/TrendingStories/TrendingStories";
import Genre from "../../../components/home/Genre/Genre";
import ContinueReading from "../../../components/home/ContinueReading/ContinueReading";
import PopularStories from "../../../components/home/PopularStories/PopularStories";
import LatestStories from "../../../components/home/LatestStories/LatestStories";
import FeaturedWriters from "../../../components/home/FeaturedWriters/FeaturedWriters";
import Community from "../../../components/home/Community/Community";
import CTA from "../../../components/home/CTA/CTA";

import "./Home.css";

function Home() {
  return (
    <div className="lumora-home">
      <Navbar />

      <main className="lumora-home__main">
        <Hero />

        <LatestBanners />
        
        <FeaturedStories />

        <TrendingStories />

        <Genre />

        <ContinueReading />

        <PopularStories />

        <LatestStories />

        <FeaturedWriters />

        <Community />

        <CTA />
      </main>

      <Footer />
    </div>
  );
}

export default Home;