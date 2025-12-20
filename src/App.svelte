<script>
  import { tasks, addTask } from "./store/tasks.js";
  import { formatTime } from "./utils/time.js";
  import TaskList from "./components/TaskList.svelte";
  import { onMount } from "svelte";
  import { authWithSuperQi } from "./services/api.js";

  function getAuthCode() {
    if (typeof my !== "undefined") {
      my.getAuthCode({
        scopes: ["auth_base", "USER_ID"],
        success: async (res) => {
          try {
            const data = await authWithSuperQi(res.authCode);
            my.alert({
              content: "Auth Success: " + JSON.stringify(data),
            });
          } catch (error) {
            my.alert({
              content: "Auth Failed: " + error.message,
            });
          }
        },
        fail: (res) => {
          console.log(res.authErrorScopes);
          my.alert({
            content: "Auth Code Failed: " + JSON.stringify(res),
          });
        },
      });
    } else {
      console.warn("Global 'my' object not found. Auth code logic skipped.");
      alert("Auth code logic skipped: 'my' object is undefined.");
    }
  }

  onMount(() => {
    if (typeof my !== "undefined") {
      getAuthCode();
    }
  });

  let newTaskName = "";

  $: totalTime = $tasks.reduce((acc, task) => acc + task.time, 0);

  function handleAddTask() {
    if (newTaskName.trim()) {
      addTask(newTaskName.trim());
      newTaskName = "";
    }
  }

  function handleKeydown(e) {
    if (e.key === "Enter") {
      handleAddTask();
    }
  }
</script>

<main class="container">
  <header class="header">
    <h1>Task Time Tracker</h1>
    <div class="total-time">
      <span>Total Time:</span>
      <span class="time-display">{formatTime(totalTime)}</span>
    </div>
    <button class="auth-btn" on:click={getAuthCode}>Get Auth Code</button>
  </header>

  <div class="add-task-section">
    <input
      type="text"
      placeholder="Enter new task name..."
      bind:value={newTaskName}
      on:keydown={handleKeydown}
      class="task-input"
    />
    <button
      on:click={handleAddTask}
      class="add-btn"
      disabled={!newTaskName.trim()}
    >
      Add Task
    </button>
  </div>

  <TaskList />
</main>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family:
      "Inter",
      system-ui,
      -apple-system,
      sans-serif;
  }

  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 40px;
    gap: 10px;
    text-align: center;
  }

  h1 {
    color: #2c3e50;
    margin: 0;
    font-weight: 800;
    font-size: 2.5rem;
  }

  .total-time {
    display: flex;
    gap: 10px;
    align-items: center;
    font-size: 1.2rem;
    color: #546e7a;
  }

  .time-display {
    font-weight: 700;
    color: #2c3e50;
  }

  .add-task-section {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .task-input {
    flex: 1;
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s;
  }

  .task-input:focus {
    outline: none;
    border-color: #90caf9;
  }

  .add-btn {
    padding: 12px 24px;
    background-color: #2196f3;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s;
  }

  .auth-btn {
    padding: 8px 16px;
    background-color: #673ab7;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    margin-top: 10px;
  }

  .auth-btn:hover {
    background-color: #5e35b1;
  }

  .add-btn:hover:not(:disabled) {
    background-color: #1976d2;
  }

  .add-btn:disabled {
    background-color: #b0bec5;
    cursor: not-allowed;
  }

  @media (max-width: 600px) {
    .add-task-section {
      flex-direction: column;
    }

    .add-btn {
      width: 100%;
    }
  }
</style>
