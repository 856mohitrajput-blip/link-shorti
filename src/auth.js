import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

/**
 * NextAuth Configuration
 * 
 * This handles authentication for:
 * 1. Email/Password (Credentials) - with email verification via OTP
 * 2. Google OAuth - automatic account creation/linking
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  // Trust host for production deployments
  trustHost: true,

  providers: [
    /**
     * Credentials Provider
     * Used for email/password authentication
     * The actual validation happens in /api/join-now route
     */
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // User validation is done in /api/join-now
        // This just passes through the validated user object
        const user = JSON.parse(credentials.user);
        return user;
      }
    }),

    /**
     * Google OAuth Provider
     * Handles Google sign-in with automatic account creation
     */
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],

  // Custom pages
  pages: {
    signIn: "/join-now",
    error: "/auth/error"
  },

  // Use JWT for session management
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Secret for JWT encryption
  secret: process.env.AUTH_SECRET,

  callbacks: {
    /**
     * Sign In Callback
     * Handles user creation/validation for OAuth providers
     */
    async signIn({ user, account }) {
      // For credentials provider, allow sign in (validation already done)
      if (account?.provider === "credentials") {
        return true;
      }

      // For Google OAuth, create/update user in database
      if (account?.provider === "google") {
        try {
          const response = await fetch(`${process.env.AUTH_URL}/api/auth/google-oauth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              image: user.image,
              googleId: user.id
            }),
          });

          const result = await response.json();
          
          if (result.success) {
            // Attach database user info to session
            user._id = result.user._id;
            user.fullName = result.user.fullName;
            user.isEmailVerified = result.user.isEmailVerified;
            return true;
          }

          // If user is blocked (403 status), deny access
          if (response.status === 403) {
            console.error('User account is blocked');
            return false; // This will trigger AccessDenied error
          }

          // Other errors
          console.error('Google OAuth sign in failed:', result.message);
          return false;
        } catch (error) {
          console.error('Google OAuth error:', error);
          return false;
        }
      }

      return true;
    },

    /**
     * JWT Callback
     * Add custom fields to JWT token
     * Fetches fresh user data on trigger
     * 
     * Note: Database access only happens in API routes, never in middleware
     */
    async jwt({ token, user, trigger, session }) {
      // On sign in, add user data to token
      if (user) {
        token._id = user._id;
        token.fullName = user.fullName || user.name;
        token.email = user.email;
        token.isEmailVerified = user.isEmailVerified;
        token.image = user.image;
        token.isAdmin = user.isAdmin || false;
        token.isBlocked = user.isBlocked || false;
      }
      
      // On update trigger, update token from session data
      // Database fetch is handled separately in API routes, not here
      // This prevents mongoose from being bundled in middleware
      if (trigger === "update" && session) {
        if (session.fullName) {
          token.fullName = session.fullName;
        }
        if (session.isEmailVerified !== undefined) {
          token.isEmailVerified = session.isEmailVerified;
        }
        if (session.image) {
          token.image = session.image;
        }
      }
      
      return token;
    },

    /**
     * Session Callback
     * Add custom fields to session object
     */
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.fullName = token.fullName;
        session.user.email = token.email;
        session.user.isEmailVerified = token.isEmailVerified;
        session.user.image = token.image;
        session.user.isAdmin = token.isAdmin || false;
        session.user.isBlocked = token.isBlocked || false;
      }
      return session;
    }
  }
})
