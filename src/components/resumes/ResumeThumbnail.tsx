export function ResumeThumbnail() {
	return (
		<div className="flex aspect-[1/1.35] w-full items-start justify-center overflow-hidden rounded-md border border-border bg-preview p-3 shadow-sm">
			<div className="w-full max-w-[88%] space-y-2 text-preview-fg">
				<div className="mx-auto h-2 w-3/5 rounded-sm bg-preview-fg/80" />
				<div className="mx-auto h-1 w-2/5 rounded-sm bg-preview-fg/40" />
				<div className="mt-3 space-y-1">
					<div className="h-1 w-full rounded-sm bg-preview-fg/25" />
					<div className="h-1 w-full rounded-sm bg-preview-fg/25" />
					<div className="h-1 w-4/5 rounded-sm bg-preview-fg/25" />
				</div>
				<div className="mt-2 space-y-1">
					<div className="h-1 w-full rounded-sm bg-preview-fg/20" />
					<div className="h-1 w-full rounded-sm bg-preview-fg/20" />
					<div className="h-1 w-full rounded-sm bg-preview-fg/20" />
					<div className="h-1 w-3/4 rounded-sm bg-preview-fg/20" />
				</div>
			</div>
		</div>
	);
}
