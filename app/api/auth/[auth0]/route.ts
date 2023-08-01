//https://github.com/auth0/nextjs-auth0/tree/beta#app-router
import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";

export const GET = handleAuth({
  signup: handleLogin({ authorizationParams: { screen_hint: "signup" } }),
  onError(req: Request, error: Error) {
    console.log(req);
    console.error(error);
  },
});
