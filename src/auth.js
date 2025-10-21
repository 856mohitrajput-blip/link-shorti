import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
        name: "credentials",
        credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
          let user = JSON.parse(credentials.user);
          // Everything is handled in the api/sigin post request, not here, because an error is caused due to Mongoose not being usable in the Edge runtime environment in Next.js.
          return user
        }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  pages: {
    signIn: "/join-now",
    signOut: "/"
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        // Handle Google OAuth user creation/login via API route
        try {
          const response = await fetch(`${process.env.AUTH_URL}/api/auth/google-oauth`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              image: user.image,
              googleId: user.id
            }),
          });
          
          const result = await response.json();
          if (result.success) {
            // Update user object with database info
            user._id = result.user._id;
            user.fullName = result.user.fullName;
            user.isEmailVerified = result.user.isEmailVerified;
            return true;
          }
          return false;
        } catch (error) {
          console.error('Google OAuth error:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token._id = user._id; 
        token.fullName = user.fullName || user.name;
        token.email = user.email;
        token.isEmailVerified = user.isEmailVerified;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.fullName = token.fullName;
        session.user.email = token.email;
        session.user.isEmailVerified = token.isEmailVerified;
        session.user.image = token.image;
      }
      return session;
    }
  }
})