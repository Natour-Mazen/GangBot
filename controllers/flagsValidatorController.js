const yaml = require('js-yaml');
const toml = require('toml');

// Controller for the flags validator
class FlagsValidatorController {

    #parseFileContent(fileContent, fileType) {
        switch (fileType) {
            case 'json':
                return JSON.parse(fileContent);
            case 'yaml':
                return yaml.load(fileContent);
            case 'toml':
                return toml.parse(fileContent);
            default:
                throw new Error('Invalid file type');
        }
    }

    // Analyze the content of a flag
    static isValidateFlagFile(fileContent, fileType) {
        let parsedContent;

        try {
            parsedContent = FlagsValidatorController.#parseFileContent(fileContent, fileType);
        } catch (error) {
            throw new Error('Invalid file format or type');
        }

        const isFlagFile = Object.values(parsedContent).every(flag =>
            flag.hasOwnProperty('variations') && flag.hasOwnProperty('defaultRule') && flag.defaultRule.hasOwnProperty('variation')
        );

        if (!isFlagFile) {
            throw new Error('Not a valid flag file');
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