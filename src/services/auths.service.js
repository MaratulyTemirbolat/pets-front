import { HOST, userAccountURL, TOKEN_KEY_NAME, } from "./index";
import { fetcher } from "./helpers/fetcher";

export async function loginRegisterUser(url, data) {
  return fetcher(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(data),
  })
}

export async function registerUser(data) {
  const url = HOST + "/api/v1/auths/users/register_user";
  return loginRegisterUser(url, data);
};

export async function loginUser(data) {
  const url = HOST + "/api/v1/auths/users/login";
  return loginRegisterUser(url, data);
};

export async function fetchUserData(accessToken) {
  return fetcher(
    userAccountURL,
    {
      headers: {
        Authorization: `${TOKEN_KEY_NAME} ${accessToken}`,
      },
    }
  );
}
