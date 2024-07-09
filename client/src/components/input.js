const Input = ({ label, placeholder, type,onChange,value }) => {
  return (
    <div className=" pt-2 flex  flex-col items-start pb-3 pl-10">
      <label className="pl-2">{label}</label>
      <input
        placeholder={placeholder}
        type={type}
        className="border border-green  rounded-lg w-4/5 p-2"
        value= {value}
        onChange={onChange}
      ></input>
    </div>
  );
};

export default Input;
