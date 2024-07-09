const SentMessage = ({ message, className }) => {
  return (
    <div className="bg-slate-500 ml-auto mr-5 min-w-[30%] mt-3 max-w-[60%] justify-self-end rounded-tl-md rounded-tr-md rounded-br-md lg:max-w-[40%]">
      <div className="h-full py-3 ml-3 mr-3 text-sm text-white ">{message}</div>
    </div>
  );
};

export default SentMessage;
