export const isValidString = (str: string): boolean => {
    const cleanStr = str.trim();
    const regex = /^[\s\S]{1,1000}$/;
    return regex.test(cleanStr);
};
