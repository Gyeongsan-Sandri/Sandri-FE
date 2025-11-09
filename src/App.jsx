import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

import MainLayout from "./layouts/MainLayout";
import RequireAuth from "./components/RequireAuth";
import LoadingPage from "./pages/others/loading/loading";

// Pages - Lazy Loading
const Home = lazy(() => import("./pages/main/home/home"));
const Magazine = lazy(() => import("./pages/main/magazine/magazine"));
const SpotSearch = lazy(() => import("./pages/main/spot_search/spot_search"));
const SpotCategory = lazy(() => import("./pages/main/spot_category/spot_category"));

const Collection = lazy(() => import("./pages/collection/collection_start"));

const TourSpotDetail = lazy(() => import("./pages/tourspots/tourspots/tourspots"));
const TourSpotsReview = lazy(() => import("./pages/tourspots/tourspots_review/tourspots_review"));

const MyRoute = lazy(() => import("./pages/route/myroute/myroute"));
const RouteCategory = lazy(() => import("./pages/route/route_category/route_category"));
const RouteSearch = lazy(() => import("./pages/route/route_search/route_search"));
const RouteModify = lazy(() => import("./pages/route/route_modify/route_modify"));

const MyPage = lazy(() => import("./pages/mypage/mypage/mypage"));
const MyPageModify = lazy(() => import("./pages/mypage/mypage_modify/mypage_modify"));
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
            <Route path="magazine" element={<Magazine />} />
            <Route path="api/search" element={<SpotSearch />} />
            <Route path="api/categories" element={<SpotCategory />} />

            {/* 관광지 */}
            <Route path="places/tourspots/:id" element={<TourSpotDetail />} />
            <Route path="places/:placeId/reviews" element={<TourSpotsReview />} />

            {/* 루트 */}
            <Route path="routes" element={<RouteCategory />} />
            <Route path="routes/search" element={<RouteSearch />} />

            {/* 로그인 필요한 페이지 */}
            {/* <Route element={<RequireAuth />}> */}
              <Route path="routes/:routeId" element={<MyRoute />} />
              <Route path="routes/:routeId/modify" element={<RouteModify />} />
              <Route path="mypage" element={<MyPage />} />
              <Route path="mypage/reviews" element={<MyPage />} />
              <Route path="mypage/travel-list" element={<MyPageTravelList />} />
              <Route path="collection" element={<Collection />} />
            {/* </Route> */}
          </Route>

          {/* 인증 페이지  */}
          <Route path="/users/login" element={<Login />} />
          <Route path="/users/register" element={<Signup />} />
          
          {/* 마이페이지 수정 */}
          <Route path="/mypage/modify" element={<MyPageModify />} />
          
          {/* 테스트 페이지 */}
          <Route path="/test" element={<Test />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
