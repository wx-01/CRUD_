import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Tables() {
  const [students, setStudents] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    axios
      .get("http://localhost:8081/students")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error(err));
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8081/students/${id}`)
      .then(() => fetchStudents())
      .catch((err) => console.error(err));
  };

  const startEdit = (student) => {
    setEditId(student.id);
    setEditData({
      name: student.name,
      class: student.class,
      subject_count: student.subject_count,
    });
  };

  const saveEdit = (id) => {
    axios
      .put(`http://localhost:8081/students/${id}`, {
        name: editData.name,
        class: editData.class,
        subjects: editData.subject_count,
      })
      .then(() => {
        setEditId(null);
        fetchStudents();
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="overflow-x-auto m-2">
      <table className="table bg-base-100">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Class</th>
            <th>Subjects</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((stu, i) => (
            <tr key={stu.id} className="hover:bg-base-300">
              <th>{i + 1}</th>

              <td>
                {editId === stu.id ? (
                  <input
                    className="input input-sm"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                  />
                ) : (
                  stu.name
                )}
              </td>

              <td>
                {editId === stu.id ? (
                  <input
                    type="number"
                    className="input input-sm"
                    value={editData.class}
                    onChange={(e) =>
                      setEditData({ ...editData, class: e.target.value })
                    }
                  />
                ) : (
                  stu.grade
                )}
              </td>

              <td>
                {editId === stu.id ? (
                  <input
                    type="number"
                    min="1"
                    max="5"
                    className="input input-sm"
                    value={editData.subject_count}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        subject_count: e.target.value,
                      })
                    }
                  />
                ) : (
                  stu.subject_count
                )}
              </td>

              <td className="flex gap-2">
                {editId === stu.id ? (
                  <>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => saveEdit(stu.id)}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setEditId(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => startEdit(stu)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => handleDelete(stu.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
