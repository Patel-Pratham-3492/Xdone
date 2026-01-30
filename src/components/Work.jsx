import { useEffect, useState } from "react";
import DonutChart from "./DonutChart";
import API from "../services/api";
import "./work.css";

export default function Work() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [summary, setSummary] = useState(null);

  // Helper: get today's date normalized to local midnight
  const getTodayDate = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0); // local midnight
    return d;
  };

  const today = getTodayDate();

  useEffect(() => {
    fetchTasks();
    fetchSummary();
  }, []);

  // Fetch tasks for today
  const fetchTasks = async () => {
    try {
      const res = await API.get(`/tasks?date=${today.toISOString()}`);
      setTasks(res.data);
    } catch (err) {
      console.error("Fetch tasks error:", err);
    }
  };

  // Fetch daily summary for today
  const fetchSummary = async () => {
    try {
      const res = await API.get(`/summary/daily-summary?date=${today.toISOString()}`);
      setSummary(res.data);
    } catch (err) {
      console.error("Fetch summary error:", err);
    }
  };

  // Add a new task
  const addTask = async () => {
    if (!newTask.trim()) return;

    try {
      await API.post("/tasks", { title: newTask, date: today });
      setNewTask("");
      fetchTasks();
      fetchSummary();
    } catch (err) {
      console.error("Add task error:", err);
    }
  };

  // Mark a task as done
  const markDone = async (id) => {
    try {
      await API.patch(`/tasks/${id}/done`);
      fetchTasks();
      fetchSummary();
    } catch (err) {
      console.error("Mark done error:", err);
    }
  };

  const todoTasks = tasks.filter((t) => t.status === "todo");
  const doneTasks = tasks.filter((t) => t.status === "done");

  return (
    <section className="work-section">
      <div className="work-grid">

        {/* LEFT SIDE */}
        <div className="work-left">
          <div className="work-header">
            <h2>Today's Work</h2>
            <div className="add-task">
              <input
                type="text"
                placeholder="Add new task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
              <button className="xd-btn" onClick={addTask}>+</button>
            </div>
          </div>

          <div className="work-lists">
            <div className="task-box">
              <h3>To Do</h3>
              {todoTasks.map((task) => (
                <div className="task-item" key={task._id}>
                  <input type="checkbox" onChange={() => markDone(task._id)} />
                  <span>{task.title}</span>
                </div>
              ))}
            </div>

            <div className="task-box done">
              <h3>Done</h3>
              {doneTasks.map((task) => (
                <div className="task-item" key={task._id}>
                  ✅ <span>{task.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - DONUT */}
        <div className="work-right">
          <div className="donut-card">
            <DonutChart
              completed={summary?.completedTasks || 0}
              total={summary?.totalTasks || 0}
              size={220}
              color={
                summary?.completionColor === "green"
                  ? "#22c55e"
                  : summary?.completionColor === "lightGreen"
                  ? "#4ade80"
                  : summary?.completionColor === "orange"
                  ? "#fb923c"
                  : "#facc15"
              }
            />
            <div className="donut-label">Today's Progress</div>
          </div>
        </div>

      </div>
    </section>
  );
}
