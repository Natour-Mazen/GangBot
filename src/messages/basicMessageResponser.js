
class BasicMessageResponser {

    /**
     * Constructor
     * @param keyword - The keyword that triggers the command
     */
    constructor(keyword) {
        if (new.target === BasicMessageResponser) {
            throw new Error("BasicCommand is an abstract class and cannot be instantiated directly.");
        }
        this.keyword = keyword;
    }

    async handleTheMessage(interaction) {
        throw new Error(`handleCommand method must be implemented in ${this.constructor.name}`);
    }

    getKeyword() {
        return this.keyword;
    }

}

export default BasicMessageResponser;
