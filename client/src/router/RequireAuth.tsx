import React, { useEffect } from "react";
import { useOktaAuth } from "@okta/okta-react";
import { toRelativeUrl } from "@okta/okta-auth-js";
import { Outlet, useNavigate } from "react-router-dom";
import SpinnerLoading from "../errors/SpinnerLoading";

interface Props {
  admin?: boolean;
}

export default function RequiredAuth({ admin }: Props) {
  const { oktaAuth, authState } = useOktaAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authState) {
      return;
    }

    if (!authState?.isAuthenticated) {
      const originalUri = toRelativeUrl(
        window.location.href,
        window.location.origin
      );
      oktaAuth.setOriginalUri(originalUri);
      navigate("/login");
    }

    if (admin && authState.accessToken?.claims.userType === undefined) {
      navigate("/home");
    }
  }, [oktaAuth, !!authState, authState?.isAuthenticated]);

  if (!authState || !authState?.isAuthenticated) {
    return <SpinnerLoading />;
  }

  return <Outlet />;
}
