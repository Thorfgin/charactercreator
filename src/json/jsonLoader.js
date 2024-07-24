import packageInfo from '../../package.json';

// Function om dynamisch JSON files te importeren met de version als query parameter
async function loadJsonWithVersion(path) {
    const versionedPath = `${path}?v=${packageInfo.version}`;
    try {
        const data = await import( /* @vite-ignore */ versionedPath);
        return data.default;
    } catch (error) {
        console.error(`Failed to load ${versionedPath}`, error);
        return null;
    }
}

// Lijst met JSON file paths
const jsonFiles = [
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

// Function in alle JSON files met version in te laden
async function loadAllJsons() {
    const loadedJsons = {};

    await Promise.all(
        jsonFiles.map(async (file) => {
            const data = await loadJsonWithVersion(file);
            if (data) {
                const parts = file.split('/');
                const language = parts[1]; // 'nl' or 'en'
                const filename = parts[2].replace('.json', ''); // e.g., 'vaardigheden'

                // Maak de key in het format 'vaardigheden_nl'
                const key = `${filename}_${language}`;
                loadedJsons[key] = data;
            }
        })
    );
    return loadedJsons;
}

export default loadAllJsons;
