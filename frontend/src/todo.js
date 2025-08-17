import { useEffect, useState } from "react";

export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(null);

  const apiUrl = "http://localhost:5000";

  const handleSubmit = () => {
    if (!title.trim() || !description.trim() || !dueDate) {
      setError("Please fill in all fields");
      setMessage("");
      return;
    }

    const payload = { title, description, dueDate };

    const method = editId ? "PUT" : "POST";
    const url = editId ? `${apiUrl}/todos/${editId}` : `${apiUrl}/todos`;

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(() => {
        setMessage(editId ? "Item updated successfully!" : "Item added successfully!");
        setTitle("");
        setDescription("");
        setDueDate("");
        setEditId(null);
        getItems();
        setTimeout(() => setMessage(""), 3000);
      })
      .catch(() => setError(editId ? "Unable to update Todo Item" : "Unable to create Todo Item"));
  };

  const getItems = () => {
    fetch(apiUrl + "/todos")
      .then((res) => res.json())
      .then((res) => setTodos(res))
      .catch(() => setError("Unable to fetch Todo Items"));
  };

  const handleDelete = (id) => {
    fetch(`${apiUrl}/todos/${id}`, { method: "DELETE" })
      .then(() => {
        setMessage("Item deleted successfully!");
        getItems();
        setTimeout(() => setMessage(""), 3000);
      })
      .catch(() => setError("Unable to delete Todo Item"));
  };

  const handleEdit = (todo) => {
    setTitle(todo.title);
    setDescription(todo.description);
    setDueDate(todo.dueDate ? todo.dueDate.slice(0, 10) : "");
    setEditId(todo._id);
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <>
      <div
        className="row text-light d-flex justify-content-center align-items-center"
        style={{ backgroundColor: "darkblue", height: "50px" }}
      >
        <h1 style={{ margin: 0, fontSize: "2rem" }}>ToDo Project with MERN Stack</h1>
      </div>

      <div className="row mt-3">
        <h3>{editId ? "Edit Item" : "Add Item"}</h3>
        {message && <p className="text-success">{message}</p>}
        {error && <p className="text-danger">{error}</p>}

        <div className="form-group d-flex gap-2 mb-3">
          <input
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className="form-control"
            type="text"
            style={{ width: "250px" }}
          />
          <input
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="form-control"
            type="text"
            style={{ width: "300px" }}
          />
          <input
            type="date"
            className="form-control"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{ width: "180px" }}
          />
          <button className="btn btn-dark" onClick={handleSubmit}>
            {editId ? "Update" : "Submit"}
          </button>
        </div>

        <div className="row mt-3">
          <h3>Tasks</h3>
          <div className="d-flex flex-column gap-3">
            {todos.map((todo) => (
              <div
                key={todo._id}
                className="p-3"
                style={{
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #dee2e6",
                  borderRadius: "8px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div className="d-flex gap-2">
                  <input type="text" value={todo.title} readOnly className="form-control" style={{ width: "150px" }} />
                  <input type="text" value={todo.description} readOnly className="form-control" style={{ width: "200px" }} />
                  <input type="date" value={todo.dueDate ? todo.dueDate.slice(0, 10) : ""} readOnly className="form-control" style={{ width: "150px" }} />
                </div>

                <div className="d-flex gap-2">
                  <button
                    className="btn"
                    style={{ backgroundColor: "darkblue", color: "white", border: "none" }}
                    onClick={() => handleEdit(todo)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn"
                    style={{ backgroundColor: "red", color: "white", border: "none" }}
                    onClick={() => handleDelete(todo._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
