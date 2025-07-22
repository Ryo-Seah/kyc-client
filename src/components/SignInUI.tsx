import { useState, useEffect } from 'react';
import { 
    GoogleAuthProvider, 
    signInWithPopup, 
    signInWithEmailAndPassword, 
    // createUserWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut } from 'firebase/auth';
import { auth } from '../firebase';
import type { User } from 'firebase/auth';
import { Box, Button, TextField, Typography, Paper, CircularProgress, Alert, } from '@mui/material'; // add tabs and tab when needed

interface SignInUIProps {
  onSignIn: (user: User) => void;
}

export const SignInUI: React.FC<SignInUIProps> = ({ onSignIn }) => {
//   const [tab, setTab] = useState(0); // 0: Login, 1: Sign Up
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      if (firebaseUser) {
        onSignIn(firebaseUser);
      }
    });
    return () => unsubscribe();
  }, [onSignIn]);

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      setError(null);
      onSignIn(result.user);
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes('popup-closed-by-user')) {
          setError('Sign-in popup was closed before completing authentication.');
        } else {
          setError(err.message);
        }
      } else {
        setError('An unknown error occurred: ' + err);
      }
    }
    setSigningIn(false);
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSigningIn(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      setError(null);
      onSignIn(result.user);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred: ' + err);
      }
    }
    setSigningIn(false);
  };

//   const handleEmailSignUp = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSigningIn(true);
//     try {
//       const result = await createUserWithEmailAndPassword(auth, email, password);
//       setUser(result.user);
//       setError(null);
//       onSignIn(result.user);
//     } catch (err: unknown) {
//       if (err instanceof Error) {
//         setError(err.message);
//       } else {
//         setError('An unknown error occurred: ' + err);
//       }
//     }
//     setSigningIn(false);
//   };

  const handleSignOutClick = async () => {
    await signOut(auth);
    setUser(null);
    setError(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Paper elevation={3} sx={{ p: 4, width: 350 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Welcome
          </Typography>
          {/* <Tabs value={tab} onChange={(_, v) => setTab(v)} centered sx={{ mb: 2 }}>
            <Tab label="Login" />
            <Tab label="Sign Up" />
          </Tabs> */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleGoogleSignIn}
            disabled={signingIn}
            sx={{ mb: 2 }}
          >
            Sign in with Google
          </Button>
          <Typography variant="body2" align="center" sx={{ mb: 2 }}>
            or
          </Typography>
          {/* {tab === 0 ? ( */}
            <form onSubmit={handleEmailSignIn}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                fullWidth
                margin="normal"
                disabled={signingIn}
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                fullWidth
                margin="normal"
                disabled={signingIn}
              />
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth
                disabled={signingIn}
                sx={{ mt: 2 }}
              >
                Login
              </Button>
            </form>
           {/* ) : (
            <form onSubmit={handleEmailSignUp}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                fullWidth
                margin="normal"
                disabled={signingIn}
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                fullWidth
                margin="normal"
                disabled={signingIn}
              />
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth
                disabled={signingIn}
                sx={{ mt: 2 }}
              >
                Sign Up
              </Button>
            </form>
          )}  */}
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </Paper>
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
      <Paper elevation={3} sx={{ p: 4, width: 350 }}>
        <Typography variant="h6" align="center" gutterBottom>
          Signed in as: {user.email}
        </Typography>
        <Button variant="outlined" color="error" fullWidth onClick={handleSignOutClick}>
          Sign Out
        </Button>
      </Paper>
    </Box>
  );
}