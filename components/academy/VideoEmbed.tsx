// Plays a module video from a share link. Known hosts are turned into their embed URL;
// anything else is shown as a plain link rather than framed blindly.

function embedUrl(link: string): { kind: 'iframe' | 'video'; src: string } | null {
  let url: URL;
  try {
    url = new URL(link);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, '');
  const path = url.pathname.split('/').filter(Boolean);

  if (/\.(mp4|webm)$/i.test(url.pathname)) return { kind: 'video', src: link };
  if (host === 'youtu.be' && path[0]) return { kind: 'iframe', src: `https://www.youtube-nocookie.com/embed/${path[0]}?rel=0` };
  if (host.endsWith('youtube.com')) {
    const id = url.searchParams.get('v') ?? (['shorts', 'embed', 'live'].includes(path[0]) ? path[1] : null);
    if (id) return { kind: 'iframe', src: `https://www.youtube-nocookie.com/embed/${id}?rel=0` };
  }
  if (host === 'vimeo.com' && /^\d+$/.test(path[0] ?? '')) {
    const hash = path[1] ? `?h=${path[1]}` : '';
    return { kind: 'iframe', src: `https://player.vimeo.com/video/${path[0]}${hash}` };
  }
  if (host === 'player.vimeo.com') return { kind: 'iframe', src: link };
  if (host.endsWith('loom.com') && ['share', 'embed'].includes(path[0]) && path[1]) {
    return { kind: 'iframe', src: `https://www.loom.com/embed/${path[1]}` };
  }
  if (host.endsWith('heygen.com') && ['share', 'embeds', 'embed'].includes(path[0]) && path[1]) {
    return { kind: 'iframe', src: `https://app.heygen.com/embeds/${path[1]}` };
  }
  return null;
}

export default function VideoEmbed({ link, title }: { link: string; title: string }) {
  const embed = embedUrl(link);
  if (!embed) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className="text-brand-light2 underline">
        {title}
      </a>
    );
  }
  return (
    <div className="relative w-full aspect-video bg-brand-black border border-brand-dark2">
      {embed.kind === 'video' ? (
        <video src={embed.src} controls preload="metadata" className="absolute inset-0 w-full h-full" title={title} />
      ) : (
        <iframe
          src={embed.src}
          title={title}
          loading="lazy"
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      )}
    </div>
  );
}
