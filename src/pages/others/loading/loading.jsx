import React from "react";
import "./loading.css";
import logoWhite from "../../../assets/logo_white.svg";

export default function LoadingPage() {
  return (
    <div className="loading-page">
      <div className="loading-logo">
        <img src={logoWhite} alt="로딩 중" className="logo-image" />
      </div>
    </div>
  );
}
