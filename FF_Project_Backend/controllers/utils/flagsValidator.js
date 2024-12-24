const yaml = require('js-yaml');

// Controller for the flags validator
class FlagsValidator {

    static #parseFileContent(fileContent, fileType) {
        switch (fileType) {
            case 'json':
                return JSON.parse(fileContent);
            case 'yaml':
                return yaml.load(fileContent, 'utf8');
            default:
                throw new Error('Invalid file type');
        }
    }

    // Analyze the content of a flag
    static isValidFlagFile(fileContent, fileType) {
        let flags;

        try {
            flags = FlagsValidator.#parseFileContent(fileContent, fileType);
        } catch (error) {
            return { isFlagFile: false, flags: null };
        }

        const isFlagFile = Object.values(flags).every(flag =>
            flag.hasOwnProperty('variations') && flag.hasOwnProperty('defaultRule') && flag.defaultRule.hasOwnProperty('variation')
        );

        if (!isFlagFile) {
            return { isFlagFile: false, flags: null };
        }

        return { isFlagFile: true, flags: flags };
    }

}

module.exports = FlagsValidator;