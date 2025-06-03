const form = document.getElementById("student-form");
const studentList = document.getElementById("student-list");
let isEditing = false;
let editingRoll = "";

const API = "http://localhost:5000/students";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const student = {
    name: document.getElementById("name").value,
    roll: document.getElementById("roll").value,
    gender: document.querySelector("input[name='gender']:checked").value,
    mobile: document.getElementById("mobile").value,
    stream: document.getElementById("stream").value,
    dob: document.getElementById("dob").value,
    avgMarks: document.getElementById("avgMarks").value
  };

  try {
    if (isEditing) {
      await fetch(`${API}/${editingRoll}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student)
      });
      isEditing = false;
      editingRoll = "";
    } else {
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student)
      });
    }
    form.reset();
    fetchStudents();
  } catch (error) {
    console.error("Error:", error);
  }
});

async function fetchStudents() {
  const res = await fetch(API);
  const students = await res.json();
  studentList.innerHTML = "";

  students.forEach((s) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span><strong>${s.name}</strong> | Roll: ${s.roll} | ${s.gender} | 📞 ${s.mobile} | ${s.stream} | DOB: ${s.dob} | Marks: ${s.avgMarks}</span>
      <div>
        <button class="green-btn" onclick="editStudent('${s.roll}')">Edit</button>
        <button class="red-btn" onclick="deleteStudent('${s.roll}')">Delete</button>
      </div>
    `;
    studentList.appendChild(li);
  });
}

async function editStudent(roll) {
  const res = await fetch(`${API}`);
  const students = await res.json();
  const s = students.find(st => st.roll === roll);
  if (s) {
    document.getElementById("name").value = s.name;
    document.getElementById("roll").value = s.roll;
    document.querySelector(`input[name='gender'][value='${s.gender}']`).checked = true;
    document.getElementById("mobile").value = s.mobile;
    document.getElementById("stream").value = s.stream;
    document.getElementById("dob").value = s.dob;
    document.getElementById("avgMarks").value = s.avgMarks;
    isEditing = true;
    editingRoll = roll;
  }
}

async function deleteStudent(roll) {
  await fetch(`${API}/${roll}`, { method: "DELETE" });
  fetchStudents();
}

fetchStudents();
