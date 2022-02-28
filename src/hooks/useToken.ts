import jwt_decode from "jwt-decode";
interface MyToken {
  name: string;
  exp: number;
  data: { iss: string; usr: string; aut: string; rus: string };
  // whatever else is in the JWT.
}
export const useToken = () => {
  const cookies = document.cookie.split(";");
  const token = JSON.parse(decodeURIComponent(cookies[1]).split("=")[1]).data;
  const decoded = jwt_decode<MyToken>(token);
  return decoded.data;
};
