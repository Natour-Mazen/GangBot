const yaml = require('js-yaml');

// Controller for the flags validator
class FlagsValidatorController {

    static #parseFileContent(fileContent, fileType) {
        switch (fileType) {
            case 'json':
                return JSON.parse(fileContent);
            case 'yaml':
                return yaml.load(fileContent);
            default:
                throw new Error('Invalid file type');
        }
    }

    // Analyze the content of a flag
    static isValidFlagFile(fileContent, fileType) {
        let parsedContent;

        try {
            parsedContent = FlagsValidatorController.#parseFileContent(fileContent, fileType);
        } catch (error) {
            return { isFlagFile: false, flags: null };
        }

        const isFlagFile = Object.values(parsedContent).every(flag =>
            flag.hasOwnProperty('variations') && flag.hasOwnProperty('defaultRule') && flag.defaultRule.hasOwnProperty('variation')
        );

        if (!isFlagFile) {
            return { isFlagFile: false, flags: null };
        }

        const flags = Object.entries(parsedContent).map(([flagName, flagDetails]) => {
            const defaultVariation = flagDetails.defaultRule.variation;
            const flagValue = flagDetails.variations[defaultVariation];
            const variationType = (typeof flagValue === 'object' && flagValue !== null) || JSON.stringify(flagValue) === '{}' ? 'json' : typeof flagValue;
            return {
                name: flagName,
                variationType: variationType,
                value: flagValue,
                variationOptions: flagDetails.variations
            };
        });

        return { isFlagFile: true, flags };
    }

}

module.exports = FlagsValidatorController;