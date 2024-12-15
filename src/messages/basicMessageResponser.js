
class BasicMessageResponser {

    /**
     * Constructor
     * @param keywords {Array} - Keywords that will trigger the command
     */
    constructor(keywords) {
        if (new.target === BasicMessageResponser) {
            throw new Error("BasicCommand is an abstract class and cannot be instantiated directly.");
        }
        if(!Array.isArray(keywords)) {
            throw new Error("Keywords must be an array");
        }
        this.keywords = keywords;
        this.isRunning = false;
    }

    async handleTheMessage(interaction) {
        throw new Error(`handleCommand method must be implemented in ${this.constructor.name}`);
    }

    getKeywords() {
        return this.keywords;
    }

}

export default BasicMessageResponser;
