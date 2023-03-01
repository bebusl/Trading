import { commonFetch } from "./fetchClient";

export const loginRequest = (data) => {
  return commonFetch.post("/v1/user/login", {
    username: data.id,
    password: data.password,
  });
};
// }; => API endpoint가 아직 수정안됐음. API고쳐지고 나면 이걸로 바꿀 것.
