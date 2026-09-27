import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute/ProtectedRoute";
import WriterRoute from "./routes/WriterRoute/WriterRoute";

// Public Pages
import Home from "./pages/public/Home/Home";
import Discover from "./pages/public/Discover/Discover";
import Search from "./pages/public/Search/Search";
import Popular from "./pages/public/Popular/Popular";
import Categories from "./pages/public/Categories/Categories";
import About from "./pages/public/About/About";
import BecomeWriter from "./pages/public/BecomeWriter/BecomeWriter";
import StoryDetails from "./pages/public/StoryDetails/StoryDetails";
import ReadChapter from "./pages/public/ReadChapter/ReadChapter";


// Authentication
import Login from "./pages/auth/Login/Login";
import Register from "./pages/auth/Register/Register";
import VerifyEmail from "./pages/auth/VerifyEmail/VerifyEmail";

// Writer
import Dashboard from "./pages/writer/Dashboard/Dashboard";
import MyStories from "./pages/writer/MyStories/MyStories";
import Drafts from "./pages/writer/Drafts/Drafts";
import Analytics from "./pages/writer/Analytics/Analytics";
import CreateStory from "./pages/writer/CreateStory/CreateStory";
import StoryEditor from "./pages/writer/StoryEditor/StoryEditor";
import Settings from "./pages/writer/Settings/Settings";

import Community from "./pages/public/Community/Community";

import Trending from "./pages/public/Trending/Trending";

import Privacy from "./pages/public/Privacy/Privacy";

import Terms from "./pages/public/Terms/Terms";

import GenreStories from "./pages/public/GenreStories/GenreStories";

import TrendingCategory from "./pages/public/TrendingCategory/TrendingCategory";

import CommunityCategory from "./pages/public/CommunityCategory/CommunityCategory";

import CommunityDetail from "./pages/public/CommunityDetail/CommunityDetail";

import CreateCommunity from "./pages/public/CreateCommunity/CreateCommunity";

import MyCommunities from "./pages/public/MyCommunities/MyCommunities";

import ResetPassword from "./pages/auth/ResetPassword/ResetPassword";

import Profile from "./pages/reader/Profile/Profile";

import Bookmarks from "./pages/reader/Bookmarks/Bookmarks";

import History from "./pages/reader/History/History";

import Notifications from "./pages/reader/Notifications/Notifications";

function App() {
  return (
    <Routes>
      {/* ========================================
          PUBLIC
      ======================================== */}

      <Route path="/" element={<Home />} />

      <Route path="/discover" element={<Discover />} />

      <Route path="/search" element={<Search />} />

      <Route path="/popular" element={<Popular />} />

      <Route path="/categories" element={<Categories />} />

      <Route path="/about" element={<About />} />

      <Route path="/become-writer" element={<BecomeWriter />} />

      {/* ========================================
          STORIES
      ======================================== */}

      <Route
  path="/stories/:storyId"
  element={<StoryDetails />}
/>

      <Route
        path="/read/:storyId/:chapterId"
        element={<ReadChapter />}
      />

      {/* ========================================
          READER
      ======================================== */}

      <Route
        path="/profile/:userId"
        element={<Profile />}
      />

      {/* ========================================
          AUTHENTICATION
      ======================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
  path="/reset-password"
  element={<ResetPassword />}
/>

<Route
  path="/verify-email"
  element={<VerifyEmail />}
/>

      <Route element={<ProtectedRoute />}>
        <Route path="/settings" element={<Settings />} />
        <Route path="/community/my" element={<MyCommunities />} />
      </Route>

      <Route element={<WriterRoute />}>
        <Route path="/writer/dashboard" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/writer/my-stories" element={<MyStories />} />
        <Route path="/drafts" element={<Drafts />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/create-story" element={<CreateStory />} />
        <Route path="/writer/story/:storyId/edit" element={<StoryEditor />} />
      </Route>

      <Route path="/community" element={<Community />} />

      <Route path="/trending" element={<Trending />} />

      <Route path="/privacy" element={<Privacy />} />

      <Route path="/terms" element={<Terms />} />

      <Route path="/profile" element={<Profile />} />
      
<Route
  path="/categories/:genre"
  element={<GenreStories />}
/>

<Route
  path="/trending/:trendType"
  element={<TrendingCategory />}
/>

<Route
  path="/community/:communityType"
  element={<CommunityCategory />}
/>

<Route
  path="/community/view/:communityId"
  element={<CommunityDetail />}
/>

<Route
  path="/create-community"
  element={<CreateCommunity />}
/>

<Route element={<ProtectedRoute />}>
  <Route
    path="/bookmarks"
    element={<Bookmarks />}
  />

  <Route
    path="/history"
    element={<History />}
  />

  <Route
    path="/notifications"
    element={<Notifications />}
  />
  
</Route>

    </Routes>
  );
}

export default App;
