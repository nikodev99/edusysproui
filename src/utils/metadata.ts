interface Metadata {
    title: string;
    description: string;
}

export const metadata = (metadata: Metadata) => {
    document.title = metadata.title;
    const metaDescription: HTMLMetaElement | null = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', metadata.description);
    }else {
        const metaTag: HTMLMetaElement = document.createElement("meta");
        metaTag.setAttribute('name', 'description');
        metaTag.setAttribute('content', metadata.description);
        document.head.appendChild(metaTag);
    }
}