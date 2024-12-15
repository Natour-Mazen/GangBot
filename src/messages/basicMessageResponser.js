
class BasicMessageResponser {
    constructor(keywords) {
        if (new.target === BasicMessageResponser) {
            throw new Error("BasicCommand is an abstract class and cannot be instantiated directly.");
        }
        this.keywords = keywords;
    }

    async handleTheMessage(interaction) {
        throw new Error(`handleCommand method must be implemented in ${this.constructor.name}`);
    }

    getKeywords() {
        return this.keywords;
    }

}

export default BasicMessageResponser;
