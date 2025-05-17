import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Tables() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8081/students")
      .then((response) => setStudents(response.data)) // Access data from response
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8081/students/${id}`)
      .then((response) => {
        console.log(response.data);
         window.location.reload(); // Reload the page to see the changes
      })
      .catch((error) => console.error("Error deleting student:", error));
  };

  return (
    <>
      <div className="overflow-x-auto m-5">
        <table className="table bg-base-100 ">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>CLass</th>
              <th>Subjects</th>
              <th>Month</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {/* row  */}
            {students.map((student, i) => (
                 <tr key = {i}className="hover:bg-base-300">
                 <th>{i + 1}</th>
                  <td>{student.name}</td>
                 <td>{student.class}</td>
                 <td>{student.subject}</td>
                 <td>{student.month}</td>
               
                 <td>
                  <button className="btn btn-error" onClick={() => handleDelete(student.id)}>Delete</button>
                 </td>
               </tr>
              ))}
           
           
          </tbody>
        </table>
        
      </div>
    </>
  );
}
