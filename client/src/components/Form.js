"use client";
import Input from "@/components/input";
import Link from "next/link";
import { useState } from "react";
const Form = ({ signUp = true }) => {
  const [data, setData] = useState({
    ...(!signUp && { email: "" }),
    username: "",
    password: "",
  });
  console.log(data);

  return (
    <div className="justify-center  items-center flex h-screen">
      <div className="flex justify-center flex-col w-[350px] h-[500px] border rounded-sm shadow-lg">
        <form
          onSubmit={() => {
            console.log("Submitted");
          }}
        >
          <div className="flex-col  text-center">
            <div>Dashboard for {signUp ? "SignUP" : "Login"}</div>
            <div className="flex  align-center  flex-col pt-2 ">
              <Input
                placeholder="enter your username"
                label="Username"
                type="text"
                className="w-full"
                value={data.username}
                onChange={(e) => setData({ ...data, username: e.target.value })}
              />

              {signUp ? (
                <Input
                  placeholder="email"
                  label="Email"
                  type="email"
                  className="w-full"
                  value={data.email}
                  onChange={(e) => {
                    setData({ ...data, email: e.target.value });
                  }}
                />
              ) : (
                <div></div>
              )}
              <Input
                placeholder="Password"
                label="Password"
                type="password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
              />
            </div>
          </div>
          <div className=" pl-12 flex py-1 flex-row ">
            {!signUp ? (
              <div className="flex flex-col">
                <button
                  className=" py-1 bg-blue-500    text-white rounded-lg w-full border border-black "
                  type="submit"
                >
                  Login
                </button>
                <div>
                  Dont have an acoount{" "}
                  <span className="underline">
                    <Link href="/user/signup">SignUp </Link>
                  </span>
                </div>
              </div>
            ) : (
              <></>
            )}
            {signUp ? (
              <div>
                <button
                  type="submit"
                  className=" py-1 rounded-lg border underline w-full  border-black hover:bg-sky-600 hover:text-white"
                >
                  SignUp
                </button>
                <div>
                  Already have an acoount{" "}
                  <span className="underline">
                    <Link href="/user/signin">Login </Link>
                  </span>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
