import axios from "axios";
import React, { useState } from "react";

const Dialog = () => {
  const [name, setName] = useState("");
  const [stuClass, setStuclass] = useState("");
  const [subjects, setSubjects] = useState("");
  const [month, setMonth] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
          e.preventDefault();
          axios
      .post("http://localhost:8081/students",{name, stuClass, subjects, month, password})
      .then(response =>{console.log(response.data);  window.location.reload();}) 
      .catch((error) => console.error("Error fetching data:", error));

  }


  return (
          
    <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box flex items-center justify-center bg-transparent">
        <form 
           onSubmit={handleSubmit}
          className="fieldset bg-secondary border-base-300 rounded-box w-xs border p-4"
        >
          
          <legend className="fieldset-legend">Add Student</legend>

          <label className="label">Name</label>
          <input
            type="input"
            className="input"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="label">Class</label>
          <input
            type="number"
            className="input"
            min="1"
            max="12"
            placeholder="e.g : 9"
            value={stuClass}
            onChange={(e) => setStuclass(e.target.value)}
          />

          <label className="label">Subjects</label>
          <input
            type="number"
            className="input"
            min="1"
            max="9"
            placeholder="e.g : 2"
            value={subjects}
            onChange={(e) => setSubjects(e.target.value)}
          />

          <label className="label">Month</label>
          <input
            type="input"
            className="input"
            placeholder="April"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />

          <label className="label">Password</label>
          <input
            type="password"
            className="input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

<div className="flex justify-around mt-4">
           <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
             Add
            </button>
           <button type="button" className="btn btn-primary"  onClick={() => document.getElementById("my_modal_5").close()}>
             Close
          </button>
         </div>
          
        </form>
      </div>
    </dialog>
  );
};

export default Dialog;
