import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FileUp, Save } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { NewResumeCard } from "#/components/resumes/NewResumeCard";
import { ResumeCard } from "#/components/resumes/ResumeCard";
import {
	createResume,
	exportAllResumes,
	importAllResumes,
	listResumes,
	type Resume,
	type ResumeMeta,
} from "#/lib/resume-storage";

export const Route = createFileRoute("/resumes")({
	component: ResumesPage,
});

function ResumesPage() {
	const navigate = useNavigate();
	const [resumes, setResumes] = useState<ResumeMeta[]>([]);

	const refresh = useCallback(() => {
		setResumes(listResumes());
	}, []);

	useEffect(() => {
		refresh();
	}, [refresh]);

	const handleCreate = () => {
		const resume = createResume();
		navigate({ to: "/editor/$id", params: { id: resume.id } });
	};

	const handleOpen = (id: string) => {
		navigate({ to: "/editor/$id", params: { id } });
	};

	const handleExport = () => {
		const data = exportAllResumes();
		const blob = new Blob([JSON.stringify(data, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `my-resume-backup-${Date.now()}.json`;
		a.click();
		URL.revokeObjectURL(url);
	};

	const handleImport = () => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = "application/json";
		input.onchange = () => {
			const file = input.files?.[0];
			if (!file) {
				return;
			}
			const reader = new FileReader();
			reader.onload = () => {
				try {
					const data = JSON.parse(String(reader.result)) as Resume[];
					importAllResumes(data);
					refresh();
				} catch {
					alert("导入失败：文件格式不正确");
				}
			};
			reader.readAsText(file);
		};
		input.click();
	};

	return (
		<main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
			<div className="mb-8 flex flex-wrap items-center justify-between gap-4">
				<h1 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
					My Resumes
				</h1>
				<div className="flex flex-wrap gap-2">
					<button
						type="button"
						onClick={handleExport}
						className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition hover:bg-accent-hover"
					>
						<Save size={16} strokeWidth={1.75} />
						Save as…
					</button>
					<button
						type="button"
						onClick={handleImport}
						className="inline-flex items-center gap-2 rounded-lg border border-border bg-elevated px-4 py-2 text-sm font-medium text-fg transition hover:bg-[var(--card-hover)]"
					>
						<FileUp size={16} strokeWidth={1.75} />
						Import from…
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				<NewResumeCard onClick={handleCreate} />
				{resumes.map((resume) => (
					<ResumeCard key={resume.id} resume={resume} onOpen={handleOpen} />
				))}
			</div>
		</main>
	);
}
