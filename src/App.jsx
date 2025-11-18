import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

import MainLayout from "./layouts/MainLayout";
import RequireAuth from "./components/RequireAuth";
import LoadingPage from "./pages/others/loading/loading";

const Home = lazy(() => import("./pages/main/home/home"));
const Magazine = lazy(() => import("./pages/main/magazine/magazine"));
const MagazineList = lazy(() => import("./pages/main/magazine_list/magazine_list"));
const SpotSearch = lazy(() => import("./pages/main/spot_search/spot_search"));
const SpotCategory = lazy(() => import("./pages/main/spot_category/spot_category"));

const Collection = lazy(() => import("./pages/collection/collection_start"));

const TourSpotDetail = lazy(() => import("./pages/tourspots/tourspots/tourspots"));
const TourSpotsReview = lazy(() => import("./pages/tourspots/tourspots_review/tourspots_review"));

const RouteList = lazy(() => import("./pages/route/route_list/route_list"))
const TravelRoute = lazy(() => import("./pages/route/route/route"));
const RouteCategory = lazy(() => import("./pages/route/route_category/route_category"));
const RouteSearch = lazy(() => import("./pages/route/route_search/route_search"));

const Likes = lazy(() => import("./pages/likes/likes"))

const MyPage = lazy(() => import("./pages/mypage/mypage/mypage"));
const MyPagePointShop = lazy(() => import("./pages/mypage/mypage_pointshop/mypage_pointshop"));
const MyPageModify = lazy(() => import("./pages/mypage/mypage_modify/mypage_modify"));
const MyPageReview = lazy(() => import("./pages/mypage/mypage_review/mypage_review"));
const MyPageTravelList = lazy(() => import("./pages/mypage/mypage_travel_list/mypage_travel_list"));
const Login = lazy(() => import("./pages/auth/login/login"));
const Signup = lazy(() => import("./pages/auth/signup/signup"));
const Test = lazy(() => import("./pages/mypage/test/test"));
const NotFound = lazy(() => import("./pages/others/notfound/notfound"));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          {/* 하단 네비게이션 포함 레이아웃 */}
          <Route element={<MainLayout />}>
            {/* 홈  */}
            <Route index element={<Home />} />
            <Route path="magazine" element={<MagazineList />} />
            <Route path="magazine/:magazineId" element={<Magazine />} />
            <Route path="spot/search" element={<SpotSearch />} />
            <Route path="spot/categories" element={<SpotCategory />} />

            {/* 관광지 */}
            <Route path="places/:placeId" element={<TourSpotDetail />} />
            <Route path="places/:placeId/reviews" element={<TourSpotsReview />} />

            {/* 루트 */}
            <Route path="routes" element={<RouteCategory />} />
            <Route path="routes/search" element={<RouteSearch />} />

            {/* 로그인 필요한 페이지 */}
            <Route element={<RequireAuth />}>
              <Route path="routes/list" element={<RouteList />} />
              <Route path="routes/:routeId" element={<TravelRoute />} />

              <Route path="mypage" element={<MyPage />} />
              <Route path="mypage/point-shop" element={<MyPagePointShop />} />
              <Route path="mypage/pointshop" element={<MyPagePointShop />} />
              <Route path="mypage/modify" element={<MyPageModify />} />
              <Route path="mypage/reviews" element={<MyPageReview />} />
              <Route path="mypage/travel-list" element={<MyPageTravelList />} />

              <Route path="collection" element={<Collection />} />

              <Route path="likes" element={<Likes />} />
            </Route>
          </Route>

          {/* 인증 페이지  */}
          <Route path="/users/login" element={<Login />} />
          <Route path="/users/register" element={<Signup />} />
          
          {/* 테스트 페이지 */}
          <Route path="/test" element={<Test />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
