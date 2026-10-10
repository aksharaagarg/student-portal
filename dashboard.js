const studentDetails = document.getElementById("studentDetails");
const tableHead = document.getElementById("marksTableHead");
const tableBody = document.getElementById("marksTableBody");
const dataMessage = document.getElementById("dataMessage");

async function loadStudents() {
  try {
    // 1. Fetch the XML file
    const response = await fetch("./students.xml");

    if (!response.ok) {
      throw new Error(
        "Could not load students.xml. Status: " + response.status,
      );
    }

    // 2. Convert the response into text
    const xmlText = await response.text();

    // 3. Parse XML text into a document
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");

    if (xmlDoc.querySelector("parsererror")) {
      throw new Error("Invalid XML format");
    }

    // 4. Get all student elements
    const students = xmlDoc.getElementsByTagName("student");
    const studentList = [];

    // Clear previous content
    studentDetails.innerHTML = "";
    tableHead.innerHTML = "";
    tableBody.innerHTML = "";

    // 5. Read each student's details and marks
    for (let i = 0; i < students.length; i++) {
      const student = students[i];

      const id = student.getElementsByTagName("id")[0].textContent.trim();

      const name = student.getElementsByTagName("name")[0].textContent.trim();

      const course = student
        .getElementsByTagName("course")[0]
        .textContent.trim();

      const semester = student
        .getElementsByTagName("semester")[0]
        .textContent.trim();

      const email = student.getElementsByTagName("email")[0].textContent.trim();

      const subjectElements = student.getElementsByTagName("subject");

      const marks = {};

      for (let j = 0; j < subjectElements.length; j++) {
        const subject = subjectElements[j];
        const subjectName = subject.getAttribute("name");

        marks[subjectName] = Number(subject.textContent.trim());
      }

      const subjectNames = Object.keys(marks);

      const totalMarks = Object.values(marks).reduce(
        (sum, mark) => sum + mark,
        0,
      );

      const average = subjectNames.length
        ? totalMarks / subjectNames.length
        : 0;

      studentList.push({
        id,
        name,
        course,
        semester,
        email,
        marks,
        average,
      });

      // 6. Create student detail card
      const card = document.createElement("div");
      card.className = "stat-card";

      const nameHeading = document.createElement("h3");
      nameHeading.textContent = name;

      const idText = document.createElement("p");
      idText.textContent = "ID: " + id;

      const courseText = document.createElement("p");
      courseText.textContent = "Course: " + course;

      const semesterText = document.createElement("p");
      semesterText.textContent = "Semester: " + semester;

      const emailText = document.createElement("p");
      emailText.textContent = "Email: " + email;

      card.appendChild(nameHeading);
      card.appendChild(idText);
      card.appendChild(courseText);
      card.appendChild(semesterText);
      card.appendChild(emailText);

      studentDetails.appendChild(card);
    }

    // 7. Handle an empty XML file
    if (studentList.length === 0) {
      document.getElementById("totalStudents").textContent = "0";
      document.getElementById("topStudentName").textContent =
        "No students found";

      dataMessage.textContent = "No student records in XML.";
      return;
    }

    // 8. Display total student count
    document.getElementById("totalStudents").textContent = studentList.length;

    // 9. Find the top student by average marks
    const topStudent = studentList.reduce(
      (best, current) => (current.average > best.average ? current : best),
      studentList[0],
    );

    document.getElementById("topStudentName").textContent = topStudent.name;

    // 10. Generate table headings from the XML
    const subjects = Object.keys(studentList[0].marks);
    const headerRow = document.createElement("tr");

    ["ID", "Name", ...subjects].forEach(function (heading) {
      const th = document.createElement("th");
      th.textContent = heading;
      headerRow.appendChild(th);
    });

    tableHead.appendChild(headerRow);

    // 11. Generate table rows dynamically
    studentList.forEach(function (student) {
      const row = document.createElement("tr");

      const values = [
        student.id,
        student.name,
        ...subjects.map((subject) => student.marks[subject] ?? "N/A"),
      ];

      values.forEach(function (value) {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      });

      tableBody.appendChild(row);
    });

    dataMessage.textContent = "Student data loaded successfully.";
  } catch (error) {
    console.error("Student loading error:", error);

    dataMessage.textContent = error.message;

    studentDetails.textContent = "Student details could not be loaded.";

    tableHead.innerHTML = "";
    tableBody.innerHTML = "";
  }
}

// 12. Hide or show only the marks table
const tableButton = document.getElementById("tableButton");
const tableContainer = document.getElementById("tableContainer");

tableButton.addEventListener("click", function () {
  if (tableContainer.style.display === "none") {
    tableContainer.style.display = "block";
    tableButton.textContent = "Hide Marks Table";
  } else {
    tableContainer.style.display = "none";
    tableButton.textContent = "Show Marks Table";
  }
});

// 13. Change the heading
document.getElementById("headingButton").addEventListener("click", function () {
  const heading = document.getElementById("welcomeHeading");

  if (heading.textContent === "Welcome to Student Portal!") {
    heading.textContent = "Keep working hard!";
  } else {
    heading.textContent = "Welcome to Student Portal!";
  }
});

// 14. Toggle dark mode
document.getElementById("themeButton").addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");

  const isDark = document.body.classList.contains("dark-mode");

  document.getElementById("themeButton").textContent = isDark
    ? "Light Mode"
    : "Dark Mode";
});

// 15. Load the student data
loadStudents();
