const nextConfig = {
  async redirects() {
    return [
      // auth ke common guesses
      { source: "/signup", destination: "/login", permanent: false },
      { source: "/sign-up", destination: "/login", permanent: false },
      { source: "/register", destination: "/login", permanent: false },
      { source: "/signin", destination: "/login", permanent: false },
      { source: "/sign-in", destination: "/login", permanent: false },
      { source: "/log-in", destination: "/login", permanent: false },
      { source: "/logout", destination: "/login", permanent: false },

      // app ke common guesses
      { source: "/home", destination: "/dashboard", permanent: false },
      { source: "/onboarding", destination: "/dashboard", permanent: false },
      { source: "/settings", destination: "/profile", permanent: false },
      { source: "/account", destination: "/profile", permanent: false },
      { source: "/team", destination: "/profile", permanent: false },

      // feature ke guesses
      { source: "/agent-builder", destination: "/agents", permanent: false },
      { source: "/agent", destination: "/agents", permanent: false },
      { source: "/blueprints", destination: "/dashboard", permanent: false },
      { source: "/opportunities", destination: "/dashboard", permanent: false },
      { source: "/reports", destination: "/dashboard", permanent: false },
      { source: "/orders", destination: "/inquiries", permanent: false },
      { source: "/leads", destination: "/inquiries", permanent: false },
      { source: "/embed", destination: "/docs", permanent: false },
      { source: "/api-docs", destination: "/docs", permanent: false },
      { source: "/documentation", destination: "/docs", permanent: false },
      { source: "/plans", destination: "/pricing", permanent: false },
      { source: "/billing", destination: "/pricing", permanent: false },
    ];
  },
};

export default nextConfig;
