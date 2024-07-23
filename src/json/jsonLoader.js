// jsonLoader.js

const getCacheBustedUrl = (url) => {
    // Append a cache-busting query parameter
    return `${url}?v=${new Date().getTime()}`;
};

const loadJson = async (path) => {
    const url = getCacheBustedUrl(new URL(path, import.meta.url).href);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    return response.json();
};

const loadAllJsons = async () => {
    const data = {};
    try {
        // List your JSON paths relative to the `src` folder
        const paths = [
            './nl/vaardigheden.json',
            './en/vaardigheden.json',
            './nl/spreuken.json',
            './en/spreuken.json',
            './nl/recepten.json',
            './en/recepten.json',
            './nl/presets.json',
            './en/presets.json',
            './nl/releasenotes.json',
            './en/releasenotes.json',
            './nl/faq.json',
            './en/faq.json'
        ];

        for (const path of paths) {
            const lang = path.split('/')[1];
            const fileName = path.split('/').pop().split('.')[0];
            data[`${fileName}_${lang}`] = await loadJson(path);
        }

        // console.log('JSON data loaded successfully');
    } catch (error) {
        console.error('Error loading JSON modules:', error);
    }
    return data;
};

export { loadAllJsons };
