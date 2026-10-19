"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/tasks")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        return response.json();
      })
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Could not load tasks");
        setLoading(false);
      });
  }, []);

  return (
    <main>
      <h1>My Tasks</h1>

      {loading && <p>Loading tasks...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <div>
          {tasks.map((task) => (
            <div key={task.id}>
              <h2>{task.title}</h2>
              <p>{task.description}</p>
              <p>
                Status: {task.completed ? "Completed" : "Incomplete"}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}