const PROFILE_KEY = 'farmerProfile';

/**
 * Save farmer profile to localStorage.
 * @param {object} profile
 */
export const setFarmerProfile = (profile) => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

/**
 * Read farmer profile from localStorage.
 * @returns {object|null}
 */
export const getFarmerProfile = () => {
    try {
        const raw = localStorage.getItem(PROFILE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

/**
 * Get the selected language (defaults to 'en').
 * @returns {string}
 */
export const getLang = () => {
    const p = getFarmerProfile();
    return p?.language || 'en';
};

/**
 * Clear profile on logout.
 */
export const clearFarmerProfile = () => {
    localStorage.removeItem(PROFILE_KEY);
};
