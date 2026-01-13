import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const TodoContainer = () => {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  // const [task, setTask] = useState('')
  // const [date, setDate] = useState('')

  useEffect(() => {
    const fetchtodos = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3001/todo/fetch", {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });

        setTodos(response.data.todos);
        setError(null);
      } catch (err) {
        setError("Failed to fetch todos");
      } finally {
        setLoading(false);
      }
    };
    fetchtodos();
  }, []);

  const todoCreate = async () => {
    if (!newTodo) return;
    try {
      const response = await axios.post(
        "http://localhost:3001/todo/create",
        {
          text: newTodo,
          completed: false,
        },
        {
          withCredentials: true,
        }
      );
      setTodos([...todos, response.data.newTodo]);
      setNewTodo("");
    } catch (err) {
      setError("Failed to Create todos");
    }
  };

  const todostatus = async (id) => {
    const todo = todos.find((t) => t._id === id);
    try {
      const response = await axios.put(
        `http://localhost:3001/todo/update/${id}`,
        {
          ...todo,
          completed: !todo.completed,
        },
        {
          withCredentials: true,
        }
      );
      setTodos(todos.map((t) => (t._id === id ? response.data.todo : t)));
    } catch (err) {
      setError("Failed to find todo status");
    }
  };

  const todoDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/todo/delete/${id}`, {
        withCredentials: true,
      });
      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) {
      setError("Failed to Delete Todo");
    }
  };

  const navigateTo = useNavigate();
  const logout = async () => {
    try {
      await axios.get("http://localhost:3001/user/logout", {
        withCredentials: true,
      });
      toast.success("User logged out successfully");

      navigateTo("/login");
      localStorage.removeItem("jwt");
    } catch (err) {
      toast.error("Error logging out");
    }
  };

  const remainingTodos = todos.filter((todo) => !todo.completed).length;

  return (
    <div className="flex justify-center items-center min-h-[90vh] bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 px-2 sm:px-4 py-8">
      <div className="bg-white shadow-xl rounded-3xl p-6 sm:p-10 w-full max-w-3xl min-h-[400px] flex flex-col">
        {/* Header */}
        <div className="mb-8 border-b border-slate-200 pb-6">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">My Tasks</h1>
          <p className="text-slate-500 text-sm">
            Stay organized and productive
          </p>
        </div>

        {/* Input Row */}
        <div className="flex flex-col sm:flex-row w-full gap-3 mb-8">
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTodo}
            onChange={(e) => {
              setNewTodo(e.target.value);
            }}
            onKeyPress={(e) => e.key === "Enter" && todoCreate()}
            className="flex-1 px-5 py-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
          />
          <button
            onClick={todoCreate}
            className="px-8 py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold shadow-md hover:shadow-lg transition duration-300"
          >
            Add Task
          </button>
        </div>

        {/* Todo List */}
        <div className="flex-1 overflow-y-auto mb-6">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mx-auto mb-3"></div>
                <span className="text-slate-500 text-sm">Loading tasks...</span>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-lg text-center font-medium">
              {error}
            </div>
          ) : todos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">✓</div>
              <p className="text-slate-500 font-medium">No tasks yet</p>
              <p className="text-slate-400 text-sm">Add one to get started!</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {todos.map((todo, index) => (
                <li
                  key={todo._id || index}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200 hover:border-indigo-300 hover:shadow-md transition duration-200 group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => {
                        todostatus(todo._id);
                      }}
                      className="w-5 h-5 rounded border-slate-300 text-indigo-500 focus:ring-indigo-500 cursor-pointer"
                    />
                    <span
                      className={`flex-1 transition ${
                        todo.completed
                          ? "line-through text-slate-400"
                          : "text-slate-700 font-medium"
                      }`}
                    >
                      {todo.text}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      todoDelete(todo._id);
                    }}
                    className="ml-2 px-4 py-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 font-medium text-sm transition duration-200 opacity-0 group-hover:opacity-100"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Stats and Logout */}
        <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-slate-600 font-medium">
              <span className="text-indigo-600 font-bold text-lg">
                {remainingTodos}
              </span>{" "}
              of{" "}
              <span className="text-indigo-600 font-bold text-lg">
                {todos.length}
              </span>{" "}
              remaining
            </p>
            <p className="text-slate-400 text-xs">Keep up the great work!</p>
          </div>
          <button
            onClick={() => {
              logout();
            }}
            className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoContainer;
