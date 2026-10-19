"use client";

import { useEffect, useState } from "react";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  // Get tasks
  const loadTasks = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
     "http://localhost:8080/api/tasks",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

    if (!token) {
      setMessage("You are not logged in.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/tasks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Could not load tasks");
      }

      const data = await response.json();

      setTasks(data);
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage("Could not load tasks");
    }
  };

  // Load tasks when page opens
  useEffect(() => {
    loadTasks();
  }, []);

  // Create a new task
  const handleCreateTask = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("You are not logged in.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/tasks",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            title: title,
            description: description,
            completed: false,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Could not create task");
      }

      const newTask = await response.json();

      // Add the new task to the list
      setTasks((currentTasks) => [
        ...currentTasks,
        newTask,
      ]);

      // Clear the form
      setTitle("");
      setDescription("");

      setMessage("Task created successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Could not create task");
    }
  };

  return (
    <main>
      <h1>My Tasks</h1>

      {/* CREATE TASK FORM */}

      <h2>Create New Task</h2>

      <form onSubmit={handleCreateTask}>
        <div>
          <label>Title</label>
          <br />

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            required
          />
        </div>

        <br />

        <div>
          <label>Description</label>
          <br />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
            required
          />
        </div>

        <br />

        <button type="submit">
          Create Task
        </button>
      </form>

      <p>{message}</p>

      <hr />

      {/* TASK LIST */}

      <h2>Your Tasks</h2>

      {tasks.map((task) => (
        <div key={task.id}>
          <h3>{task.title}</h3>

          <p>{task.description}</p>

          <p>
            Status:{" "}
            {task.completed
              ? "Completed"
              : "Incomplete"}
          </p>

          <hr />
        </div>
      ))}
    </main>
  );
}