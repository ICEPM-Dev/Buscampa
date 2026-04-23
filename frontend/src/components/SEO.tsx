import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  noindex?: boolean;
}

const DEFAULT_TITLE = "Buscampa - Campamentos Cristianos en Argentina";
const DEFAULT_DESCRIPTION = "Encuentra y participa en campamentos cristianos en Argentina. Conecta con iglesias, inscríbete fácilmente y vive experiencias de fe y comunidad.";
const DEFAULT_IMAGE = "https://buscampa.com.ar/og-image.png";
const BASE_URL = "https://buscampa.com.ar";

export default function SEO({ 
  title, 
  description, 
  image, 
  url, 
  noindex = false 
}: SEOProps) {
  const fullTitle = title ? `${title} | Buscampa` : DEFAULT_TITLE;
  const fullDescription = description || DEFAULT_DESCRIPTION;
  const fullImage = image || DEFAULT_IMAGE;
  const fullUrl = url ? `${BASE_URL}${url}` : BASE_URL;

  useEffect(() => {
    document.title = fullTitle;
    
    // Meta tags
    updateMeta("title", fullTitle);
    updateMeta("description", fullDescription);
    updateMeta("robots", noindex ? "noindex, follow" : "index, follow");
    
    // Open Graph
    updateMeta("og:title", fullTitle);
    updateMeta("og:description", fullDescription);
    updateMeta("og:image", fullImage);
    updateMeta("og:url", fullUrl);
    updateMeta("og:type", "website");
    
    // Twitter
    updateMeta("twitter:title", fullTitle);
    updateMeta("twitter:description", fullDescription);
    updateMeta("twitter:image", fullImage);
    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:url", fullUrl);
    
    // Canonical
    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", fullUrl);
  }, [fullTitle, fullDescription, fullImage, fullUrl, noindex]);

  return null;
}

function updateMeta(name: string, content: string) {
  let element = document.querySelector(`meta[name="${name}"`) || 
                document.querySelector(`meta[property="${name}"]`);
  
  if (!element) {
    element = document.createElement("meta");
    if (name.startsWith("og:") || name.startsWith("twitter:")) {
      element.setAttribute("property", name);
    } else {
      element.setAttribute("name", name);
    }
    document.head.appendChild(element);
  }
  
  element.setAttribute("content", content);
}