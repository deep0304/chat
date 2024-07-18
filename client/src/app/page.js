import Image from "next/image";
import page from "./dashboard/page";
import { Navigate } from "react-router-dom";
import Form from "@/components/Form";

export default function Home() {
  const isLoggedIn = localStorage.getitem("user:token") !== null || false;
  if (!isLoggedIn && auth) {
    return <Navigate to={"/users/signin"} />;
  } else if (
    isLoggedIn &&
    ["/users/signin", "/users/signup"].includes(window.location.pathname)
  ) {
    return <Navigate to={"/"} />;
  }
  return (
    <>
      <Form />
    </>
  );
}
