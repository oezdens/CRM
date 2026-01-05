import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmail, getCurrentSession } from "@/services/authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const session = await getCurrentSession();
      if (session) {
        navigate("/crm");
      }
    };
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { user, error: authError } = await signInWithEmail(email, password);
      
      if (authError) {
        setError(authError.message);
        return;
      }

      if (user) {
        navigate("/crm");
      }
    } catch (err) {
      setError("Ein unerwarteter Fehler ist aufgetreten.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-sans bg-gradient-to-br from-white via-purple-50 to-blue-50 dark:from-background dark:via-background dark:to-background min-h-screen flex items-center justify-center p-4">
      {/* Login Container */}
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-white"></div>
            </div>
            <span className="ml-3 text-2xl font-semibold text-foreground">
              CRM System
            </span>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="bg-white/60 dark:bg-card/60 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl relative">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-accent"></div>
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-gradient-to-bl from-primary/10 to-accent/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-gradient-to-tr from-blue-400/10 to-purple-400/10 rounded-full blur-xl"></div>

          <div className="p-8 relative z-10">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Willkommen zurück
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm">
                    {error}
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-muted-foreground mb-1"
                  >
                    E-Mail-Adresse
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-white/70 dark:bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground placeholder:text-muted-foreground"
                    placeholder="Gib deine E-Mail ein"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-muted-foreground"
                    >
                      Passwort
                    </label>
                    <a
                      href="#"
                      className="text-sm text-primary hover:text-accent transition-colors"
                    >
                      Passwort vergessen?
                    </a>
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-white/70 dark:bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground placeholder:text-muted-foreground"
                    placeholder="Gib dein Passwort ein"
                  />
                </div>

                {/* Remember Me */}
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-muted-foreground"
                  >
                    Angemeldet bleiben
                  </label>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-medium py-2.5 px-4 rounded-lg shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Anmelden...
                    </span>
                  ) : (
                    'Anmelden'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
