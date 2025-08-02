import { signInWithGitHub, signOut } from "@/actions/auth/actions";
import ArcadeButton from "../ui/arcade-button";
import { getUser } from "@/actions/auth/user-info";

export default async function Header() {
  const user = await getUser();

  return (
    <div
      className="w-full relative overflow-hidden
        bg-gradient-to-r from-[var(--primary-dark)] via-[var(--primary)] to-[var(--secondary-dark)]"
    >
      {/* BG LIGHTS */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute top-0 left-0 w-1/2 h-full"
          style={{
            background:
              "radial-gradient(circle at 20% 30%, var(--primary-light), transparent)",
            filter: "blur(60px)",
            opacity: 0.6,
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-1/2 h-full"
          style={{
            background:
              "radial-gradient(circle at 80% 70%, var(--secondary-light), transparent)",
            filter: "blur(80px)",
            opacity: 0.6,
          }}
        />
      </div>

      <div className="relative z-10 py-6 md:py-8 px-6 flex items-center justify-between">
        <div className="w-1/3" />

        <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold pixel-font drop-shadow-[0_0_10px_rgba(0,255,100,0.7)]">
            <span className="text-[var(--primary-light)]">Respawn</span>
            <span className="glitch" data-text="Notes">
              Notes
            </span>
            <span className="text-[var(--primary-lighter)] animate-pulse">
              👾
            </span>
            <span className="text-[var(--secondary-lighter)]">.com</span>
          </h1>
        </div>

        {/* Sign In/Out Button */}
        <div className="w-1/3 flex justify-end">
          {user ? (
            <form action={signOut}>
              <ArcadeButton variant="log" type="submit">
                Sign Out
              </ArcadeButton>
            </form>
          ) : (
            <form action={signInWithGitHub}>
              <ArcadeButton variant="log" type="submit">
                Sign In with GitHub
              </ArcadeButton>
            </form>
          )}
        </div>
      </div>

      {/* Neon Line */}
      <div className="h-1 w-full relative overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-r
            from-[var(--secondary)] via-[var(--primary-lighter)] to-[var(--secondary-light)]
            animate-gradient-x"
        />
      </div>
    </div>
  );
}
