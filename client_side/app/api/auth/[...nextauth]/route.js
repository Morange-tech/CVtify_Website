import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import LinkedInProvider from 'next-auth/providers/linkedin';


const authOptions = {
    debug: true, // Add this line
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        }),
        {
            id: 'linkedin',
            name: 'LinkedIn',
            type: 'oauth',
            clientId: process.env.LINKEDIN_CLIENT_ID ?? '',
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET ?? '',
            wellKnown: 'https://www.linkedin.com/oauth/.well-known/openid-configuration',
            authorization: {
                params: { scope: 'openid profile email' },
            },
            token: {
                url: 'https://www.linkedin.com/oauth/v2/accessToken',
            },
            client: {
                token_endpoint_auth_method: 'client_secret_post',
            },
            checks: ['state'],
            idToken: true,
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                };
            },
        },
    ],

    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === 'google' || account?.provider === 'linkedin') {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/social-login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        body: JSON.stringify({
                            provider: account.provider,
                            provider_id: account.providerAccountId,
                            name: user.name,
                            email: user.email,
                            avatar: user.image,
                        }),
                    });

                    const data = await res.json();

                    if (!res.ok) {
                        console.error('Social auth error:', data.message);
                        return false;
                    }

                    // Pass token and user to jwt callback
                    user.backendToken = data.token;
                    user.backendUser = data.user;

                    return true;
                } catch (error) {
                    console.error('Social auth error:', error);
                    return false;
                }
            }
            return true;
        },

        async jwt({ token, user }) {
            if (user?.backendToken) {
                token.backendToken = user.backendToken;
                token.backendUser = user.backendUser;
            }
            return token;
        },

        async session({ session, token }) {
            session.backendToken = token.backendToken;
            session.backendUser = token.backendUser;
            return session;
        },

        async redirect({ url, baseUrl }) {
            // Always redirect to callback page to save token
            return `${baseUrl}/auth/callback`;
        },
    },

    pages: {
        signIn: '/login',
        error: '/login',
    },

    session: {
        strategy: 'jwt',
    },

    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };