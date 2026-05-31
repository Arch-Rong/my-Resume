import {
	DEFAULT_CSS,
	DEFAULT_MARKDOWN,
	DEFAULT_SETTINGS,
} from "#/lib/default-resume";

export type PaperSize = "a4" | "letter";

export interface ResumeSettings {
	paperSize: PaperSize;
	themeColor: string;
}

export interface Resume {
	id: string;
	title: string;
	markdown: string;
	css: string;
	settings: ResumeSettings;
	createdAt: number;
	updatedAt: number;
}

export type ResumeMeta = Pick<
	Resume,
	"id" | "title" | "createdAt" | "updatedAt"
>;

const STORE_KEY = "my-resume:store";
const LEGACY_LIST_KEY = "my-resume:list";

interface Store {
	version: 1;
	resumes: Record<string, Resume>;
}

function emptyStore(): Store {
	return { version: 1, resumes: {} };
}

function readStore(): Store {
	if (typeof window === "undefined") {
		return emptyStore();
	}
	try {
		const raw = localStorage.getItem(STORE_KEY);
		if (raw) {
			return JSON.parse(raw) as Store;
		}
		migrateLegacyList();
		const migrated = localStorage.getItem(STORE_KEY);
		return migrated ? (JSON.parse(migrated) as Store) : emptyStore();
	} catch {
		return emptyStore();
	}
}

function writeStore(store: Store) {
	localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

function migrateLegacyList() {
	try {
		const legacy = localStorage.getItem(LEGACY_LIST_KEY);
		if (!legacy) {
			return;
		}
		const list = JSON.parse(legacy) as ResumeMeta[];
		const store = emptyStore();
		for (const meta of list) {
			store.resumes[meta.id] = {
				...meta,
				markdown: DEFAULT_MARKDOWN,
				css: DEFAULT_CSS,
				settings: { ...DEFAULT_SETTINGS },
			};
		}
		writeStore(store);
		localStorage.removeItem(LEGACY_LIST_KEY);
	} catch {
		/* ignore */
	}
}

export function listResumes(): ResumeMeta[] {
	return Object.values(readStore().resumes).sort(
		(a, b) => b.updatedAt - a.updatedAt,
	);
}

export function getResume(id: string): Resume | null {
	return readStore().resumes[id] ?? null;
}

export function saveResume(resume: Resume): void {
	const store = readStore();
	store.resumes[resume.id] = { ...resume, updatedAt: Date.now() };
	writeStore(store);
}

export function createResume(title = "New Resume"): Resume {
	const now = Date.now();
	const resume: Resume = {
		id: crypto.randomUUID(),
		title,
		markdown: DEFAULT_MARKDOWN,
		css: DEFAULT_CSS,
		settings: { ...DEFAULT_SETTINGS },
		createdAt: now,
		updatedAt: now,
	};
	const store = readStore();
	store.resumes[resume.id] = resume;
	writeStore(store);
	return resume;
}

export function deleteResume(id: string): void {
	const store = readStore();
	delete store.resumes[id];
	writeStore(store);
}

export function formatResumeTime(ts: number): string {
	const d = new Date(ts);
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function exportAllResumes(): Resume[] {
	return Object.values(readStore().resumes);
}

export function importAllResumes(resumes: Resume[]): void {
	const store = emptyStore();
	for (const r of resumes) {
		store.resumes[r.id] = r;
	}
	writeStore(store);
}
