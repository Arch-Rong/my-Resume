import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark" | "auto";

function getStoredMode(): ThemeMode {
	const stored = window.localStorage.getItem("theme");
	if (stored === "light" || stored === "dark" || stored === "auto") {
		return stored;
	}
	return "auto";
}

function applyThemeMode(mode: ThemeMode) {
	const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
	const resolved = mode === "auto" ? (prefersDark ? "dark" : "light") : mode;

	document.documentElement.classList.remove("light", "dark");
	document.documentElement.classList.add(resolved);

	if (mode === "auto") {
		document.documentElement.removeAttribute("data-theme");
	} else {
		document.documentElement.setAttribute("data-theme", mode);
	}
	document.documentElement.style.colorScheme = resolved;
	return resolved;
}

export default function ThemeToggle() {
	const [resolved, setResolved] = useState<"light" | "dark">("dark");

	useEffect(() => {
		setResolved(applyThemeMode(getStoredMode()));
	}, []);

	function toggle() {
		const next = resolved === "dark" ? "light" : "dark";
		applyThemeMode(next);
		localStorage.setItem("theme", next);
		setResolved(next);
	}

	return (
		<button
			type="button"
			onClick={toggle}
			className="rounded-lg p-2 text-fg-muted transition hover:bg-[var(--card-hover)] hover:text-fg"
			aria-label={resolved === "dark" ? "切换浅色模式" : "切换深色模式"}
		>
			{resolved === "dark" ? (
				<Moon size={18} strokeWidth={1.75} />
			) : (
				<Sun size={18} strokeWidth={1.75} />
			)}
		</button>
	);
}
