class Task {
    constructor(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.isCompleted = false;
    }

    toggleComplete() {
        this.isCompleted = !this.isCompleted;
    }
}

export default Task;
