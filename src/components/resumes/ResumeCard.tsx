import type { ResumeMeta } from "#/lib/resume-storage";
import { formatResumeTime } from "#/lib/resume-storage";
import { ResumeThumbnail } from "./ResumeThumbnail";

interface ResumeCardProps {
	resume: ResumeMeta;
	onOpen: (id: string) => void;
}

export function ResumeCard({ resume, onOpen }: ResumeCardProps) {
	return (
		<button
			type="button"
			onClick={() => onOpen(resume.id)}
			className="group flex w-full flex-col rounded-xl border border-transparent p-1 text-left transition hover:border-border hover:bg-[var(--card-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
		>
			<ResumeThumbnail />
			<div className="mt-3 space-y-1 px-1 pb-2">
				<p className="truncate text-sm font-medium text-fg">{resume.title}</p>
				<p className="text-xs text-fg-muted">
					Updated: {formatResumeTime(resume.updatedAt)}
				</p>
				<p className="text-xs text-fg-muted">
					Created: {formatResumeTime(resume.createdAt)}
				</p>
			</div>
		</button>
	);
}
