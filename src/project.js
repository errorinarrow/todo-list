class Project {
    constructor(name) {
        this.name = name;
        this.tack = [];
    }

    addTask(task) {
        this.tasks.push(task);
    }

    removeTask(taskIndex) {
        this.tasks.splice(taskIndex, 1);
    }
}

export default Project;
