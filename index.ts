import axios from "axios";
import { app } from "./src/app.ts";

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// setTimeout(() => {
//   axios
//     .post("http://localhost:3333/shorten", {
//       url: "https://abcd.com",
//       shortId: "amazon",
//     })
//     .then((response) => {
//       console.log("Shortened URL:", response.data);
//     })
//     .catch((error) => {
//       console.error("Error shortening URL:", error);
//     });
// }, 1000);
