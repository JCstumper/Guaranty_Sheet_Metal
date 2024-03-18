import validator from 'validator';

const blacklistChars = "-\'\"\\\\/*+=<>~^&|`\\[\\],;.:"; 

const sanitize = (string) => {
    return validator.blacklist(string, blacklistChars);
}

export default sanitize;