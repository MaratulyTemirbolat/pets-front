export const fetcher = async (url, init = undefined) => {
    const res = await fetch(url, init);
    const isOk = res.ok;
    const response = await res.json();
    return new Promise(resolve => resolve({isOk, response}));
};