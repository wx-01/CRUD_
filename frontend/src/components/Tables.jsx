import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Tables() {
  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState({});
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(
        "https://dbms-proj-hghl.onrender.com/students"
      );
      setStudents(res.data);

      // Fetch fees for each student
      const feeData = {};
      for (let stu of res.data) {
        const feeRes = await axios.get(
          `https://dbms-proj-hghl.onrender.com/fees/${stu.id}`
        );
        feeData[stu.id] = feeRes.data;
      }
      setFees(feeData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = (id) => {
    axios
      .delete(`https://dbms-proj-hghl.onrender.com/students/${id}`)
      .then(() => fetchStudents())
      .catch((err) => console.error(err));
  };

  const startEdit = (student) => {
    setEditId(student.id);
    setEditData({
      name: student.name,
      class: student.grade,
      subject_count: student.subject_count,
    });
  };

  const saveEdit = (id) => {
    axios
      .put(`https://dbms-proj-hghl.onrender.com/students/${id}`, {
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
  const toggleFee = async (fee) => {
    try {
      const newStatus = fee.status === "PAID" ? "UNPAID" : "PAID";

      await axios.put(`https://dbms-proj-hghl.onrender.com/fees/${fee.id}`, {
        status: newStatus,
      });

      fetchStudents(); // reload fresh data
    } catch (err) {
      console.error(err);
    }
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
            <th>Total Fee</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((stu, i) => {
            const studentFees = fees[stu.id] || [];
            const currentFee = studentFees[0]; // one row per student

            return (
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

                <td>{currentFee?.total_amount || 0}</td>

                <td>
                  <button
                    className={
                      currentFee?.status === "PAID"
                        ? "btn btn-success btn-xs"
                        : "btn btn-error btn-xs"
                    }
                    onClick={() => toggleFee(currentFee)}
                  >
                    {currentFee?.status}
                  </button>
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
