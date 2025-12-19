import { writable } from 'svelte/store';

const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

export const tasks = writable(storedTasks);

let taskInterval;

tasks.subscribe(value => {
    localStorage.setItem('tasks', JSON.stringify(value));
});

export function addTask(name) {
    tasks.update(currentTasks => {
        return [...currentTasks, {
            id: Date.now(),
            name,
            time: 0,
            isRunning: false
        }];
    });
}

export function deleteTask(id) {
    tasks.update(currentTasks => {
        return currentTasks.filter(task => task.id !== id);
    });
}

export function resetTask(id) {
    tasks.update(currentTasks => {
        return currentTasks.map(task => {
            if (task.id === id) {
                return { ...task, time: 0, isRunning: false };
            }
            return task;
        });
    });
}

export function startTimer(id) {
    tasks.update(currentTasks => {
        return currentTasks.map(task => {
            if (task.id === id) {
                return { ...task, isRunning: true };
            }
            return { ...task, isRunning: false };
        });
    });

    clearInterval(taskInterval);
    taskInterval = setInterval(() => {
        tasks.update(currentTasks => {
            return currentTasks.map(task => {
                if (task.isRunning) {
                    return { ...task, time: task.time + 1 };
                }
                return task;
            });
        });
    }, 1000);
}

export function stopTimer(id) {
    tasks.update(currentTasks => {
        return currentTasks.map(task => {
            if (task.id === id) {
                return { ...task, isRunning: false };
            }
            return task;
        });
    });
    clearInterval(taskInterval);
}
