import "./notfound.css";
import NotFound from "../../../assets/not_found.png";

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <h1>404 Not Found</h1>
      <img src={NotFound} alt="404 Not Found" />
      <h2>페이지를 찾을 수 없습니다.</h2>
      <p>요청하신 페이지가 존재하지 않거나 이동된 페이지입니다.</p>
    </div>
  );
}