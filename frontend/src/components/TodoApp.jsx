import { useState, useEffect } from "react";

const API_BASE = "http://localhost:5001";

export default function TodoApp({ user, token, onLogout }) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);
  const [newTodo, setNewTodo] = useState({
    title: "",
    content: "",
  });
  const [editingTodo, setEditingTodo] = useState(null);

  // Fetch todos from backend
  const fetchTodos = async () => {
    try {
      const response = await fetch(`${API_BASE}/todo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      } else if (response.status === 401) {
        onLogout();
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add new todo
  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.title.trim()) return;

    try {
      const response = await fetch(`${API_BASE}/todo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: "Personal",
          title: newTodo.title,
          content: newTodo.content || "No description",
        }),
      });

      if (response.ok) {
        setNewTodo({ title: "", content: "" });
        setShowAddDialog(false);
        fetchTodos();
      } else if (response.status === 401) {
        onLogout();
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // Confirm delete
  const confirmDelete = (todo) => {
    setTodoToDelete(todo);
    setShowDeleteDialog(true);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!todoToDelete) return;

    try {
      const response = await fetch(`${API_BASE}/todo/${todoToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchTodos();
        setShowDeleteDialog(false);
        setTodoToDelete(null);
      } else if (response.status === 401) {
        onLogout();
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Update todo
  const updateTodo = async (id, updates) => {
    try {
      const response = await fetch(`${API_BASE}/todo/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        fetchTodos();
        setEditingTodo(null);
        setShowEditDialog(false);
      } else if (response.status === 401) {
        onLogout();
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // Start editing
  const startEdit = (todo) => {
    setEditingTodo(todo);
    setShowEditDialog(true);
  };

  // Toggle completion status
  const toggleComplete = async (todo) => {
    await updateTodo(todo.id, { isCompleted: !todo.isCompleted });
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  const completedCount = todos.filter((todo) => todo.isCompleted).length;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">My Tasks</h1>
              <p className="text-gray-400">Welcome back, {user.username}</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowAddDialog(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
              >
                + Add Task
              </button>
              <button
                onClick={onLogout}
                className="text-gray-400 hover:text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-2xl font-bold text-white">{todos.length}</div>
            <div className="text-sm text-gray-400">Total Tasks</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-2xl font-bold text-blue-400">
              {todos.length - completedCount}
            </div>
            <div className="text-sm text-gray-400">Active</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-2xl font-bold text-green-400">
              {completedCount}
            </div>
            <div className="text-sm text-gray-400">Completed</div>
          </div>
        </div>

        {/* Todos Grid */}
        {todos.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
            <div className="text-4xl mb-4">📝</div>
            <div className="text-gray-400">
              No tasks yet. Click "Add Task" to create your first one!
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className={`bg-gray-800 rounded-lg border border-gray-700 p-4 transition-all hover:border-gray-600 aspect-square flex flex-col ${
                  todo.isCompleted ? "opacity-75" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3
                    className={`font-medium text-white mb-2 flex-1 truncate pr-2 ${
                      todo.isCompleted ? "line-through text-gray-500" : ""
                    }`}
                    title={todo.title}
                  >
                    {todo.title}
                  </h3>
                  <div
                    className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${
                      todo.isCompleted
                        ? "bg-green-600 text-white"
                        : "bg-yellow-600 text-white"
                    }`}
                  >
                    {todo.isCompleted ? "Done" : "Active"}
                  </div>
                </div>

                {todo.content && todo.content !== "No description" && (
                  <div className="flex-1 mb-4">
                    <p
                      className={`text-gray-400 text-sm overflow-hidden text-ellipsis ${
                        todo.isCompleted ? "line-through text-gray-500" : ""
                      }`}
                      title={todo.content}
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {todo.content}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => toggleComplete(todo)}
                    className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                      todo.isCompleted
                        ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {todo.isCompleted ? "Undo" : "Complete"}
                  </button>
                  <button
                    onClick={() => startEdit(todo)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition-colors"
                    title="Edit"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => confirmDelete(todo)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors"
                    title="Delete"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Task Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Add New Task</h2>
            <form onSubmit={addTodo} className="space-y-4">
              <input
                type="text"
                placeholder="Task title"
                value={newTodo.title}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, title: e.target.value })
                }
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
                autoFocus
              />
              <textarea
                placeholder="Description (optional)"
                value={newTodo.content}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, content: e.target.value })
                }
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none h-20 resize-none"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors font-medium"
                >
                  Add Task
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddDialog(false);
                    setNewTodo({ title: "", content: "" });
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Dialog */}
      {showEditDialog && editingTodo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Edit Task</h2>
            <EditForm
              todo={editingTodo}
              onSave={(updates) => updateTodo(editingTodo.id, updates)}
              onCancel={() => {
                setShowEditDialog(false);
                setEditingTodo(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && todoToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Delete Task</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete "{todoToDelete.title}"? This
              action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors font-medium"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setShowDeleteDialog(false);
                  setTodoToDelete(null);
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EditForm({ todo, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: todo.title,
    content: todo.content === "No description" ? "" : todo.content,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title: formData.title,
      content: formData.content || "No description",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        required
        autoFocus
      />
      <textarea
        value={formData.content}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none h-20 resize-none"
        placeholder="Description (optional)"
      />
      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors font-medium"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
