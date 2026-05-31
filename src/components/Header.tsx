import { Link } from "@tanstack/react-router";
import { Github, LayoutGrid } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
	return (
		<header className="sticky top-0 z-50 border-b border-border bg-[var(--header-bg)] backdrop-blur-md">
			<nav className="mx-auto flex h-14 w-full max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6">
				<Link
					to="/"
					className="flex items-center gap-2.5 text-fg transition opacity-90 hover:opacity-100"
				>
					<span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-[10px] font-bold lowercase text-accent-fg">
						cv
					</span>
					<span className="text-sm font-semibold tracking-tight">
						My Resume
					</span>
				</Link>

				<div className="flex items-center gap-0.5 sm:gap-1">
					<Link
						to="/resumes"
						className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-fg-muted transition hover:bg-[var(--card-hover)] hover:text-fg [&.active]:text-fg"
						activeProps={{ className: "active" }}
					>
						<LayoutGrid size={16} strokeWidth={1.75} />
						<span className="hidden sm:inline">我的简历</span>
					</Link>
					<ThemeToggle />
					<a
						href="https://github.com"
						target="_blank"
						rel="noopener noreferrer"
						className="rounded-lg p-2 text-fg-muted transition hover:bg-[var(--card-hover)] hover:text-fg"
						aria-label="GitHub"
					>
						<Github size={18} strokeWidth={1.75} />
					</a>
				</div>
			</nav>
		</header>
	);
}
