<script>
    import { createEventDispatcher } from 'svelte';
    import { formatTime } from '../utils/time.js';

    export let task;

    const dispatch = createEventDispatcher();

    function handleStart() {
        dispatch('start', task.id);
    }

    function handleStop() {
        dispatch('stop', task.id);
    }

    function handleReset() {
        dispatch('reset', task.id);
    }

    function handleDelete() {
        dispatch('delete', task.id);
    }
</script>

<div class="task-card">
    <div class="task-header">
        <h3 class="task-name">{task.name}</h3>
        <span class="task-timer">{formatTime(task.time)}</span>
    </div>
    
    <div class="task-actions">
        {#if task.isRunning}
            <button class="btn stop" on:click={handleStop}>Stop</button>
        {:else}
            <button class="btn start" on:click={handleStart}>Start</button>
        {/if}
        <button class="btn reset" on:click={handleReset}>Reset</button>
        <button class="btn delete" on:click={handleDelete}>Delete</button>
    </div>
</div>

<style>
    .task-card {
        background-color: #ffffff;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        display: flex;
        flex-direction: column;
        gap: 16px;
        transition: transform 0.2s ease;
    }

    .task-card:hover {
        transform: translateY(-2px);
    }

    .task-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
    }

    .task-name {
        font-size: 1.25rem;
        font-weight: 600;
        color: #2c3e50;
        margin: 0;
        word-break: break-word;
        text-align: center;
    }

    .task-timer {
        font-size: 2rem;
        font-weight: 700;
        color: #34495e;
        font-variant-numeric: tabular-nums;
    }

    .task-actions {
        display: grid;
        gap: 10px;
        width: 100%;
    }

    .btn {
        border: none;
        border-radius: 8px;
        padding: 12px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s;
        width: 100%;
    }

    .start {
        background-color: #e8f5e9;
        color: #2e7d32;
    }

    .start:hover {
        background-color: #c8e6c9;
    }

    .stop {
        background-color: #ffebee;
        color: #c62828;
    }

    .stop:hover {
        background-color: #ffcdd2;
    }

    .reset {
        background-color: #f5f5f5;
        color: #616161;
    }

    .reset:hover {
        background-color: #eeeeee;
    }

    .delete {
        background-color: #fff3e0;
        color: #e65100;
    }

    .delete:hover {
        background-color: #ffe0b2;
    }
</style>
