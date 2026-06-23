import { useState } from 'react';
import { Flex, Image, Text, Button } from '@chakra-ui/react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';

/**
 * Client-side "Sign in with Google" for the Vite SPA.
 * Renders Google's official button; on success it decodes the ID token (JWT)
 * to read the user's profile. No backend required.
 *
 * Requires VITE_GOOGLE_CLIENT_ID in the environment (see .env.local.example).
 */
function decodeJwt(token) {
  const payload = token.split('.')[1];
  const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
  return JSON.parse(decodeURIComponent(escape(json)));
}

const hasClientId = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

export function GoogleSignIn({ onSignIn }) {
  const [user, setUser] = useState(null);

  if (!hasClientId) {
    return (
      <Text color="fg.muted" fontSize="sm">
        Set VITE_GOOGLE_CLIENT_ID to enable Google sign-in.
      </Text>
    );
  }

  const handleSuccess = (credentialResponse) => {
    const profile = decodeJwt(credentialResponse.credential);
    setUser(profile);
    onSignIn?.(profile, credentialResponse.credential);
  };

  const handleSignOut = () => {
    googleLogout();
    setUser(null);
  };

  if (user) {
    return (
      <Flex align="center" gap={3}>
        {user.picture && <Image src={user.picture} alt="" boxSize="28px" borderRadius="full" />}
        <Text>{user.name}</Text>
        <Button size="sm" variant="outline" onClick={handleSignOut}>
          Sign out
        </Button>
      </Flex>
    );
  }

  return <GoogleLogin onSuccess={handleSuccess} onError={() => console.error('Google sign-in failed')} />;
}
