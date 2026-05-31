import { Plus } from "lucide-react";

interface NewResumeCardProps {
	onClick: () => void;
}

export function NewResumeCard({ onClick }: NewResumeCardProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="group flex w-full flex-col items-center justify-center rounded-xl border border-border bg-elevated p-4 transition hover:bg-[var(--card-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
		>
			<div className="flex aspect-[1/1.35] w-full items-center justify-center rounded-md border border-dashed border-border bg-muted/50 transition group-hover:border-accent/40">
				<Plus
					className="h-10 w-10 text-accent transition group-hover:scale-105"
					strokeWidth={1.5}
					aria-hidden
				/>
			</div>
			<span className="sr-only">新建简历</span>
		</button>
	);
}
