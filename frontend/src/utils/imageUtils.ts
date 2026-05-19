const IMAGE_DOMAINS = ['public.blob.vercel-storage.com'];

export function getOptimizedImageUrl(url: string, width?: number): string {
  if (!url) return url;
  
  const isVercelBlob = IMAGE_DOMAINS.some(domain => url.includes(domain));
  
  if (!isVercelBlob) return url;
  
  const separator = url.includes('?') ? '&' : '?';
  let optimizedUrl = url;
  
  if (width) {
    optimizedUrl += `${separator}width=${width}`;
  }
  
  optimizedUrl += `${separator}format=auto&quality=75`;
  
  return optimizedUrl;
}

export function getThumbnailUrl(url: string): string {
  return getOptimizedImageUrl(url, 320);
}

export function getMediumUrl(url: string): string {
  return getOptimizedImageUrl(url, 640);
}

export function getLargeUrl(url: string): string {
  return getOptimizedImageUrl(url, 1280);
}