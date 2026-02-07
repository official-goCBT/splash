/* --- DATABASES --- */
const studentDB = [
    { regNo: "2024/CS/001", pin: "1111", name: "Adebayo Samuel", dept: "CS" },
    { regNo: "2024/CS/002", pin: "2222", name: "Chidi Okafor", dept: "CS" },
    { regNo: "2024/ENG/003", pin: "3333", name: "Fatima Musa", dept: "ENG" },
    { regNo: "2024/ENG/004", pin: "4444", name: "Blessing Idowu", dept: "ENG" },
    { regNo: "2024/ART/005", pin: "5555", name: "Grace Effiong", dept: "ART" },
    { regNo: "2024/SCI/006", pin: "6666", name: "David Olatunji", dept: "SCI" },
    { regNo: "2024/SCI/007", pin: "7777", name: "Zainab Yusuf", dept: "SCI" },
    { regNo: "2024/SOC/008", pin: "8888", name: "Peter Obioma", dept: "SOC" },
    { regNo: "2024/SOC/009", pin: "9999", name: "Sarah Williams", dept: "SOC" },
    { regNo: "2024/LAW/010", pin: "1010", name: "Ibrahim Bello", dept: "LAW" }
];

const facilitatorDB = [
    { id: "admin@gocbt.com", pin: "admin123", name: "Dr. Adeyemi" },
    { id: "staff01@gocbt.com", pin: "staff1", name: "Mr. Samuel" },
    { id: "cs_dept@gocbt.com", pin: "cs789", name: "Prof. Ibrahim" }
];

/* --- FUNCTIONS --- */

function updateUI(role) {
    const label = document.getElementById('userLabel');
    if(role === 'facilitator') {
        label.innerText = "Facilitator Email / ID";
    } else {
        label.innerText = "Registration Number";
    }
}

function handleLogin() {
    const id = document.getElementById('userID').value.trim();
    const pin = document.getElementById('userPass').value.trim();
    const isStudent = document.getElementById('stuRole').checked;

    if(isStudent) {
        const user = studentDB.find(s => s.regNo === id && s.pin === pin);
        if(user) {
            logActivity(user.regNo);
            localStorage.setItem('session', JSON.stringify({ ...user, role: 'student' }));
            window.location.href = "https://official-gocbt.github.io/Home/";
        } else { alert("Invalid Student Credentials"); }
    } else {
        const user = facilitatorDB.find(f => f.id === id && f.pin === pin);
        if(user) {
            localStorage.setItem('session', JSON.stringify({ ...user, role: 'facilitator' }));
            loadDashboard();
        } else { alert("Invalid Facilitator Credentials"); }
    }
}

function logActivity(regNo) {
    let history = JSON.parse(localStorage.getItem(`history_${regNo}`)) || [];
    history.unshift({ date: new Date().toLocaleString(), device: navigator.platform });
    localStorage.setItem(`history_${regNo}`, JSON.stringify(history.slice(0, 10)));
}

function loadDashboard() {
    document.getElementById('loginView').classList.add('hidden');
    document.getElementById('adminView').classList.remove('hidden');
    
    const session = JSON.parse(localStorage.getItem('session'));
    document.getElementById('adminWelcome').innerText = `Welcome, ${session.name}`;

    const tbody = document.getElementById('auditBody');
    tbody.innerHTML = "";
    let totalLogs = 0;
    let activeToday = 0;

    studentDB.forEach(student => {
        const history = JSON.parse(localStorage.getItem(`history_${student.regNo}`)) || [];
        totalLogs += history.length;
        if(history.length > 0) activeToday++;

        tbody.innerHTML += `
            <tr>
                <td><strong>${student.name}</strong><br><small>${student.dept} Dept</small></td>
                <td>${student.regNo}</td>
                <td><span class="badge">${history.length}</span></td>
                <td>${history[0] ? history[0].date : '<span style="color:#555">None</span>'}</td>
            </tr>
        `;
    });

    document.getElementById('totalLogs').innerText = totalLogs;
    document.getElementById('activeUsers').innerText = activeToday;
}

function searchTable() {
    const filter = document.getElementById('searchBar').value.toUpperCase();
    const rows = document.getElementById('auditBody').getElementsByTagName('tr');
    for (let row of rows) {
        row.style.display = row.innerText.toUpperCase().includes(filter) ? "" : "none";
    }
}

function exportCSV() {
    let csv = "Student Name,Reg No,Login Count,Last Login\n";
    studentDB.forEach(s => {
        const h = JSON.parse(localStorage.getItem(`history_${s.regNo}`)) || [];
        csv += `${s.name},${s.regNo},${h.length},${h[0] ? h[0].date.replace(',','') : 'Never'}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'Student_Audit_Report.csv';
    a.click();
}

function resetSystem() {
    if(confirm("Wipe all activity logs?")) {
        studentDB.forEach(s => localStorage.removeItem(`history_${s.regNo}`));
        loadDashboard();
    }
}

function logout() {
    localStorage.removeItem('session');
    location.reload();
}

// Session Persistence on page reload
window.onload = () => {
    const session = JSON.parse(localStorage.getItem('session'));
    if(session && session.role === 'facilitator') loadDashboard();
};
