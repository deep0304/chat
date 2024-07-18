const userId = "66950142eed9aed39b8529f3";
const url = `http://localhost:3001/api/conversations/${userId}`;
const run = async () => {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(res);
};
run();
