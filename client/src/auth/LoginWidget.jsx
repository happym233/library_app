import { Navigate, Redirect, useLocation, useNavigate } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import SpinnerLoading from '../errors/SpinnerLoading'
import OktaSignInWidget from './OktaSignInWidget';

const LoginWidget = ({ config }) => {
    const { oktaAuth, authState } = useOktaAuth();
    const onSuccess = (tokens) => {
        oktaAuth.handleLoginRedirect(tokens);
    };

    const onError = (err) => {
        console.log('Sign in error: ', err);
    }

    if (!authState) {
        return (
            <SpinnerLoading/>
        );
    }

    return authState.isAuthenticated ?
        <Navigate to={{ pathname: "/"} }/>
    :
        <OktaSignInWidget config={ config} onSuccess={onSuccess} onError={onError}/>;
};

export default LoginWidget;
