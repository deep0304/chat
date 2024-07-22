"use client";
import Image from "next/image";
import Avatar from "../../assets/1195976.jpg";
import RecievedMessage from "@/components/RecievedMessage";
import SentMessage from "@/components/SentMessage";
import Input from "../../components/input";
import { useEffect, useState } from "react";
const page = () => {
  const [user, setUser] = useState(null || "");
  const [recieverUserData, setRecieverUserData] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const username = user.username;
  const userEmail = user.email;
  const userId = user.id;
  const [conversations, setConversations] = useState([]);
  const [suggestedUser, setSuggestedUser] = useState({});
  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("user:details"));
    setUser(userDetails);
  }, []);

  useEffect(() => {
    const loggedUserDetails = localStorage.getItem("user:details");
    if (!loggedUserDetails) {
      console.error("No user data in local storage");
      return;
    }
    const loggedUser = JSON.parse(loggedUserDetails);
    const loggedUserId = loggedUser.id;
    console.log("Logged user Id:", loggedUserId);

    const fetchMyApi = async () => {
      try {
        const response = await fetch(
          `http://mychatbackend.iomghost.publicvm.com:3001/api/get/conversations/${loggedUserId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const resdata = await response.json();
        console.log("Response data:", resdata);
        // Set state or do something with resdata
        setConversations(resdata);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchMyApi();
  }, [userId]); // Include loggedUserId in the dependency array
  const [chats, setChats] = useState({});
  const loadChat = async (conversationId) => {
    const sender = localStorage.getItem("user:details");
    if (!sender) {
      return;
    }
    const senderData = JSON.parse(sender);
    const senderId = senderData.id;

    const fetchChats = async () => {
      try {
        console.log(
          "conversationId and sednerr: ",
          conversationId + " " + senderId
        );
        const requiredChats = await fetch(
          "http://mychatbackend.iomghost.publicvm.com:3001/api/messages",
          {
            method: "POST",
            body: JSON.stringify({ ConversationId: conversationId, senderId }),
            headers: { "Content-Type": "application/json" },
          }
        );

        /**
         *here taking the data in form of messages and the reciever user
         * requiredChats : {allMessage,recieveruser}
         */
        const responsedData = await requiredChats.json();
        setChats(responsedData.allMessages);
        console.log(responsedData.allMessages);
        setType("reciever");
        setRecieverUserData(responsedData.recieverUserForFrontend);
      } catch (error) {
        console.log("error of the loadchat function: ", error);
      }
    };
    fetchChats();
  };
  const handleMessage = async () => {
    try {
      console.log(user.id);
      // console.log(recieverUserData.id);
      console.log(message);
      const response = await fetch(
        "http://mychatbackend.iomghost.publicvm.com:3001/api/sendMessage",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            senderId: user.id,
            recieverId: recieverUserData.id,
            message: message,
          }),
        }
      );
      console.log();
      console.log(response);
      const responseData = await response.json();
      console.log(responseData.message);
      const messageResponse = responseData.message;
      setChats((prevChats) => [
        ...prevChats,
        {
          idType: "sender",
          senderId: user.id,
          username: user.username,
          message: messageResponse.message,
        },
      ]);

      // const responseData = await response.json();
      // console.log(responseData);
    } catch (error) {
      console.log("Error while sending the chat", error);
    }
  };

  const [suggestions, setSuggestions] = useState([]);
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await fetch(
          "http://mychatbackend.iomghost.publicvm.com:3001/api/suggestions",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log(response);
        const responseData = await response.json();
        console.log(responseData);
        setSuggestions(responseData);
      } catch (error) {
        console.log("error   while fetching the suggestions  ", error);
      }
    };
    fetchSuggestions();
  }, []);
  //---------------------------------------------------------------------------------------------------------------------------------------------
  //create handle Suggestion here
  //-------------------------------------------------------------------------------------------------------------
  const handleSuggestion = (suggestion) => {
    setSuggestedUser(suggestion);
    console.log("suggestion is : ", suggestion);
    setType("suggestedUser");
    setChats({});
  };

  return (
    <>
      <div className="w-screen flex overflow-hidden  ">
        <div className="w-[40%]  h-screen bg-[#eef7f2]  justify-center items-center border-r shadow border-r-grey-900 md:w-[25%]">
          <div className="h-[20%]">
            <div className="flex justify-items-start pb-2 ml-3 mt-3">
              <Image
                alt="avatarImage"
                src={Avatar}
                width={75}
                height={75}
                className="rounded-full"
              />
              <div className="flex flex-col ml-4">
                <div className="text-lg">{username}</div>
                <div className="text-sm">{userEmail}</div>
                <div className="text-sm text-grey">My Account</div>
              </div>
            </div>
            <hr />
            <div className="z-40">
              <div className="px-8 bg-slate-200 z-30 py-2 h-1/2 border border-b-grey shadow  text-blue-500 font-medium text-lg">
                Messages
              </div>
            </div>
          </div>
          <div className="justify-items-center z-20 h-[80%] overflow-y-auto">
            {conversations.length > 0 ? (
              conversations.map(({ conversationId, email, username }) => {
                return (
                  <>
                    <div
                      className=" w-4/5 flex my-2 mx-2 pl-7 items-center cursor-pointer"
                      key={conversationId}
                    >
                      <Image
                        alt="conatctImage"
                        src={Avatar}
                        height={50}
                        width={50}
                        className="rounded-full mr-2"
                      />
                      <div
                        className="flex px-1 flex-col"
                        onClick={() => {
                          loadChat(conversationId);
                        }}
                      >
                        <div className="text-lg">{username}</div>
                        <div className="text-sm indent-2 text-grey/30 ">
                          {email}
                        </div>
                      </div>
                    </div>
                    <hr />
                  </>
                );
              })
            ) : (
              <div> No conversations yet</div>
            )}
          </div>
        </div>
        <div className="w-[60%] h-screen border bg-[#f8f6f6] lg:w-[50%] ">
          <div className="h-[20%] flex items-center justify-between border-b border-grey-300 shadow w-full">
            <div className="justify-self-end">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-chevron-left"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                strokeWidth="1.2"
                stroke="grey"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M15 6l-6 6l6 6" />
              </svg>
            </div>
            <div className="h-[55px] flex items-center rounded-full pr-3 border border-black w-4/5">
              <div className=" flex flex-row items-center ">
                <div className="flex items-center">
                  <Image
                    alt="profilePic"
                    src={Avatar}
                    height={50}
                    width={50}
                    className="rounded-full  ml-2 cursor-pointer"
                  />
                  <div className="flex items-center mr-auto ">
                    <div className="ml-4 text-semibold">
                      {type === "reciever"
                        ? recieverUserData
                          ? recieverUserData.username
                          : "Chat With Friends"
                        : type === "suggestedUser"
                        ? suggestedUser.username
                        : "Chat with Friends"}
                    </div>
                    <div className="text-xs indent-3 text-sky-700 mr-auto">
                      Online
                    </div>
                  </div>
                </div>
                <div className="flex justify-self-end ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-phone"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="#2c3e50"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-dots-vertical"
                width="25"
                height="25"
                viewBox="0 0 24 24"
                strokeWidth="1"
                stroke="#00abfb"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                <path d="M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                <path d="M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
              </svg>
            </div>
          </div>
          <div className="bg-yellow-200 h-[70%]  overflow-y-auto">
            {recieverUserData ? (
              chats.length > 0 ? (
                chats.map((chat, index) => (
                  <div key={index}>
                    {chat.idType === "sender" ? (
                      <div>
                        {/* <div>{chat.username}</div> */}
                        <SentMessage
                          message={chat.message}
                          className={"text-cyan-200"}
                        />
                      </div>
                    ) : chat.idType === "reciever" ? (
                      <div>
                        {/* <div>{chat.username}</div> */}
                        <RecievedMessage
                          message={chat.message}
                          className={"text-red-200"}
                        />
                      </div>
                    ) : null}
                  </div>
                ))
              ) : (
                <div>Chat not started yet , start chatting </div>
              )
            ) : (
              "Start Chat"
            )}
          </div>
          {recieverUserData ? (
            <div className="h-[10%] flex justify-center items-center bg-orange-200 ">
              <div className="flex  ml-6 justify-start items-center h-[100%] w-full mt-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className=" cursor-pointer mr-3 icon icon-tabler icon-tabler-photo-plus"
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#9e9e9e"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M15 8h.01" />
                  <path d="M12.5 21h-6.5a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v6.5" />
                  <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l4 4" />
                  <path d="M14 14l1 -1c.67 -.644 1.45 -.824 2.182 -.54" />
                  <path d="M16 19h6" />
                  <path d="M19 16v6" />
                </svg>
                <input
                  placeholder="Type message"
                  className=" outline-none focus:ring-0 focus:border-0 h-[80%] w-[70%]  text-md border rounded-full text-center border-[#535a5355]"
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                />
                <div className=" ml-4 flex justify-around">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="cursor-pointer ml-3 mr-5 icon icon-tabler icon-tabler-mood-wink-2"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="#9e9e9e"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 21a9 9 0 1 1 0 -18a9 9 0 0 1 0 18z" />
                    <path d="M9 10h-.01" />
                    <path d="M14.5 15a3.5 3.5 0 0 1 -5 0" />
                    <path d="M15.5 8.5l-1.5 1.5l1.5 1.5" />
                  </svg>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className=" cursor-pointer ml-3 icon icon-tabler icon-tabler-send-2"
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="#9e9e9e"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    onClick={handleMessage}
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M4.698 4.034l16.302 7.966l-16.302 7.966a.503 .503 0 0 1 -.546 -.124a.555 .555 0 0 1 -.12 -.568l2.468 -7.274l-2.468 -7.274a.555 .555 0 0 1 .12 -.568a.503 .503 0 0 1 .546 -.124z" />
                    <path d="M6.5 12h14.5" />
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex text-center text-lg  justify-content align-center">
              {" "}
              Start new Conversations with friends in Suggestions{" "}
            </div>
          )}
        </div>
        <div className="w-[0%] h-screen bg-[#FAEDC7] lg:w-[25%] ">
          <div className="text-sm h-[10%]">Suggestions</div>
          <div className="h-[90%] overflow-y-auto z-20">
            {suggestions.map((suggestion, index) => (
              <div
                className="flex justify-items-start pb-2 ml-3 mt-3"
                key={index}
                onClick={() => {
                  handleSuggestion(suggestion);
                }}
              >
                <Image
                  alt="avatarImage"
                  src={Avatar}
                  width={75}
                  height={75}
                  className="rounded-full"
                />
                <div className="flex flex-col ml-4">
                  <div className="text-lg">{suggestion.username}</div>
                  {/* <div className="text-sm">{userEmail}</div> */}
                  {/* <div className="text-sm text-grey">My Account</div> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default page;

//create handle Suggestion function
