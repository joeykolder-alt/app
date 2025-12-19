<script>
    import {
        tasks,
        startTimer,
        stopTimer,
        resetTask,
        deleteTask,
    } from "../store/tasks.js";
    import TaskItem from "./TaskItem.svelte";

    function handleStart(event) {
        startTimer(event.detail);
    }

    function handleStop(event) {
        stopTimer(event.detail);
    }

    function handleReset(event) {
        resetTask(event.detail);
    }

    function handleDelete(event) {
        deleteTask(event.detail);
    }
</script>

<div class="task-grid">
    {#each $tasks as task (task.id)}
        <TaskItem
            {task}
            on:start={handleStart}
            on:stop={handleStop}
            on:reset={handleReset}
            on:delete={handleDelete}
        />
    {/each}
</div>

<style>
    .task-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 20px;
        width: 100%;
    }

    @media (min-width: 768px) {
        .task-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (min-width: 1024px) {
        .task-grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }
</style>
