import { createFileRoute, Link } from "@tanstack/react-router";
import { Rocket, Shield } from "lucide-react";

export const Route = createFileRoute("/")({ component: HomePage });

const POWERFUL = [
	"管理多份简历",
	"实时预览",
	"导出 PDF",
	"完全可定制",
	"选择字体与图标",
	"更多功能持续完善",
];

const PRIVACY = [
	"开源且免费",
	"所有数据保存在本地",
	"无需登录或注册",
	"无用户追踪",
	"无广告",
];

function HomePage() {
	return (
		<main className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-3xl flex-col px-4 pb-16 pt-16 sm:pt-20">
			<section className="flex flex-1 flex-col items-center text-center">
				<h1 className="font-serif text-4xl leading-tight tracking-tight text-fg sm:text-5xl">
					Write your <span className="text-accent italic">resumes</span>
					<br />
					in Markdown!
				</h1>
				<p className="mt-5 max-w-md text-sm leading-relaxed text-fg-muted sm:text-base">
					My Resume
					是一款免费、开源的简历工具，帮你轻松创建与管理简历，数据始终留在你的设备上。
				</p>
				<Link
					to="/resumes"
					className="mt-8 inline-flex items-center justify-center rounded-full bg-accent px-8 py-3 text-sm font-semibold text-accent-fg shadow-[0_4px_20px_rgba(232,129,26,0.35)] transition hover:bg-accent-hover"
				>
					Create My Resume
				</Link>
			</section>

			<section className="mt-16 grid gap-8 sm:grid-cols-2 sm:gap-12">
				<div>
					<div className="mb-4 flex items-center gap-2">
						<Rocket className="h-4 w-4 text-accent" strokeWidth={1.75} />
						<h2 className="text-sm font-semibold text-fg">
							Simple and Powerful
						</h2>
					</div>
					<ul className="space-y-2 text-sm text-fg-muted">
						{POWERFUL.map((item) => (
							<li key={item} className="flex gap-2">
								<span className="text-accent">·</span>
								{item}
							</li>
						))}
					</ul>
				</div>
				<div>
					<div className="mb-4 flex items-center gap-2">
						<Shield className="h-4 w-4 text-info" strokeWidth={1.75} />
						<h2 className="text-sm font-semibold text-fg">Privacy First</h2>
					</div>
					<ul className="space-y-2 text-sm text-fg-muted">
						{PRIVACY.map((item) => (
							<li key={item} className="flex gap-2">
								<span className="text-info">·</span>
								{item}
							</li>
						))}
					</ul>
				</div>
			</section>
		</main>
	);
}
