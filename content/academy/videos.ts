// One overview video per module, shown at the top of the module's first lesson.
// Paste a share link per language (YouTube, Vimeo, Loom, HeyGen or a direct .mp4);
// a language without its own link falls back to English, and a module with no link
// shows no video. Scripts to record from: docs/academy-video-scripts.md.

type Locale = 'en' | 'es' | 'pt';

export const moduleVideos: Record<string, Partial<Record<Locale, string>>> = {
  // '01': { en: 'https://youtu.be/…', es: 'https://youtu.be/…' },
};

export function getModuleVideo(number: string, locale: string): string | undefined {
  const links = moduleVideos[number];
  return links?.[locale as Locale] ?? links?.en;
}
