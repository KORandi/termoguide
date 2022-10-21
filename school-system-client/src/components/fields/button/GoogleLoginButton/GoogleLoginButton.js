import { useCallback } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { loginGoogle } from "../../../../utils/api";

export const GoogleLoginButton = ({ onResponse, onClick, onFailure }) => {
  const responseGoogle = useCallback(
    async (payload) => {
      console.log(payload);
      const {
        tokenId,
        profileObj: { email },
      } = payload;
      try {
        onClick?.();
        const json = await loginGoogle(email, tokenId);
        onResponse(json);
      } catch (error) {
        onFailure(error);
      }
    },
    [onResponse, onClick, onFailure]
  );

  const failedGoogle = useCallback(
    (error) => {
      console.log(error);
      onFailure(error);
    },
    [onFailure]
  );

  return (
    <GoogleLogin
      buttonText="Sign in"
      onSuccess={responseGoogle}
      onError={failedGoogle}
      useOneTap
    />
  );
};
