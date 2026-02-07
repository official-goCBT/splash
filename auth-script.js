// 1. DATABASE
const studentDB = [
    { regNo: "2024/CS/001", pin: "1111", name: "Adebayo Samuel", course: "Computer Science" },
    { regNo: "2024/CS/002", pin: "2222", name: "Chidi Okafor", course: "Cyber Security" },
    { regNo: "2024/ENG/003", pin: "3333", name: "Fatima Musa", course: "Civil Engineering" },
    { regNo: "2024/ENG/004", pin: "4444", name: "Blessing Idowu", course: "Mechanical Engineering" },
    { regNo: "2024/ART/005", pin: "5555", name: "Grace Effiong", course: "Fine Arts" },
    { regNo: "2024/SCI/006", pin: "6666", name: "David Olatunji", course: "Microbiology" },
    { regNo: "2024/SCI/007", pin: "7777", name: "Zainab Yusuf", course: "Biochemistry" },
    { regNo: "2024/SOC/008", pin: "8888", name: "Peter Obioma", course: "Economics" },
    { regNo: "2024/SOC/009", pin: "9999", name: "Sarah Williams", course: "Political Science" },
    { regNo: "2024/LAW/010", pin: "1010", name: "Ibrahim Bello", course: "Common Law" }
];
const FAC_ID = "FAC-ADMIN", FAC_PIN = "9999";

// 2. LOGIN LOGIC
function handleLogin() {
    const id = document.getElementById('userID').value.trim();
    const pin = document.getElementById('userPass').value.trim();
    const isStudent = document.getElementById('studentRole').checked;

    if (isStudent) {
        const student = studentDB.find(s => s.regNo === id && s.pin === pin);
        if (student) {
            saveSession(student, "student");
            window.location.href = "https://official-gocbt.github.io/Home/";
        } else {
            alert("Invalid Student Credentials");
        }
    } else {
        // Facilitator Login
        const fac = facilitatorDB.find(f => f.id === id && f.pin === pin);
        if (fac) {
            saveSession(fac, "facilitator");
            window.location.href = "facilitator-dashboard.html";
        } else {
            alert("Invalid Facilitator Credentials");
        }
    }
}

function saveSession(user, role) {
    const session = {
        ...user,
        role: role,
        loginTime: new Date().getTime(),
        lastSeen: new Date().toLocaleString()
    };
    localStorage.setItem('currentUser', JSON.stringify(session));
}
    
    // Check Lockout
    const lock = localStorage.getItem(`lock_${id}`);
    if (lock && new Date().getTime() < parseInt(lock) + 300000) {
        return alert("Account locked for 5 mins due to failed attempts.");
    }

    // Facilitator Check
    if (id === FAC_ID && pin === FAC_PIN) {
        showAdminPanel();
        return;
    }

    // Student Check
    const student = studentDB.find(s => s.regNo === id && s.pin === pin);
    if (student) {
        const now = new Date();
        // Save history
        let history = JSON.parse(localStorage.getItem(`history_${id}`)) || [];
        history.unshift({ date: now.toLocaleString(), device: navigator.platform });
        localStorage.setItem(`history_${id}`, JSON.stringify(history.slice(0, 5)));
        
        // Save Session
        localStorage.setItem('currentUser', JSON.stringify({...student, time: now.getTime()}));
        window.location.href = "https://official-gocbt.github.io/Home/";
    } else {
        trackFailure(id);
    }
}

function trackFailure(id) {
    let fails = (parseInt(localStorage.getItem(`fails_${id}`)) || 0) + 1;
    localStorage.setItem(`fails_${id}`, fails);
    if (fails >= 3) localStorage.setItem(`lock_${id}`, new Date().getTime());
    alert(`Invalid credentials. ${3 - fails} attempts left.`);
}

// 3. ADMIN PANEL LOGIC
function showAdminPanel() {
    document.getElementById('loginArea').style.display = 'none';
    document.getElementById('adminView').style.display = 'block';
    document.getElementById('viewTitle').innerText = "Facilitator Audit";
    document.getElementById('mainCard').style.maxWidth = "600px";

    const tbody = document.getElementById('adminData');
    tbody.innerHTML = "";
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('history_')) {
            const data = JSON.parse(localStorage.getItem(key));
            tbody.innerHTML += `<tr><td>${key.split('_')[1]}</td><td><span class="stat-badge">${data.length}</span></td><td>${data[0].date}</td></tr>`;
        }
    }
}

function clearSystemData() {
    if(confirm("Wipe all student records?")) { localStorage.clear(); location.reload(); }
}

// 4. SESSION TIMEOUT (30 Mins)
setInterval(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user && (new Date().getTime() - user.time > 1800000)) {
        localStorage.removeItem('currentUser');
        alert("Session Expired");
        location.reload();
    }
}, 10000);
// --- FACILITATOR CORE LOGIC ---

function renderAuditTable() {
    const tbody = document.getElementById('adminData');
    if (!tbody) return;
    tbody.innerHTML = "";
    
    let studentCount = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('history_')) {
            const regNo = key.replace('history_', '');
            const history = JSON.parse(localStorage.getItem(key));
            const lastEntry = history[0];
            
            tbody.innerHTML += `
                <tr style="border-bottom: 1px solid #333;">
                    <td style="padding: 10px;"><strong>${regNo}</strong></td>
                    <td style="padding: 10px;"><span class="stat-badge">${history.length}</span></td>
                    <td style="padding: 10px;">${lastEntry.date} <br><small style="color:#888">${lastEntry.device}</small></td>
                </tr>`;
            studentCount++;
        }
    }
    if(studentCount === 0) tbody.innerHTML = "<tr><td colspan='3' style='text-align:center; padding:20px;'>No active logs found.</td></tr>";
}

function filterStudents() {
    const filter = document.getElementById('studentSearch').value.toUpperCase();
    const rows = document.getElementById('adminData').getElementsByTagName('tr');
    for (let row of rows) {
        const text = row.getElementsByTagName('td')[0]?.textContent || "";
        row.style.display = text.toUpperCase().includes(filter) ? "" : "none";
    }
}

function updateAnalytics() {
    const stats = { CS: 0, ENG: 0, TOTAL: 0 };
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('history_')) {
            const count = JSON.parse(localStorage.getItem(key)).length;
            stats.TOTAL += count;
            if (key.includes('/CS/')) stats.CS += count;
            else if (key.includes('/ENG/')) stats.ENG += count;
        }
    }
    
    if (stats.TOTAL > 0) {
        const csPer = Math.round((stats.CS / stats.TOTAL) * 100);
        const engPer = Math.round((stats.ENG / stats.TOTAL) * 100);
        document.getElementById('barCS').style.width = csPer + "%";
        document.getElementById('valCS').innerText = csPer + "%";
        document.getElementById('barENG').style.width = engPer + "%";
        document.getElementById('valENG').innerText = engPer + "%";
    }
}

function exportToCSV() {
    let csv = "Reg Number,Login Count,Last Activity\n";
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('history_')) {
            const data = JSON.parse(localStorage.getItem(key));
            csv += `${key.replace('history_', '')},${data.length},${data[0].date.replace(',','')}\n`;
        }
    }
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "goCBT_Audit_Report.csv";
    a.click();
}

function clearSystemData() {
    if (confirm("CRITICAL: This will wipe all student logs and security locks. Proceed?")) {
        localStorage.clear();
        location.reload();
    }
}
const facilitatorDB = [
    { id: "admin@gocbt.com", pin: "admin123", name: "Dr. Adeyemi", role: "Chief Examiner" },
    { id: "exams@gocbt.com", pin: "exam456", name: "Mrs. Okon", role: "Exam Officer" },
    { id: "cs_dept@gocbt.com", pin: "cs789", name: "Prof. Ibrahim", role: "HOD Computer Science" },
    { id: "eng_dept@gocbt.com", pin: "eng101", name: "Engr. Bello", role: "HOD Engineering" },
    { id: "law_dept@gocbt.com", pin: "law202", name: "Barr. Chidi", role: "HOD Law" },
    { id: "staff01@gocbt.com", pin: "staff1", name: "Mr. Samuel", role: "Invigilator" },
    { id: "staff02@gocbt.com", pin: "staff2", name: "Miss Sarah", role: "Invigilator" },
    { id: "staff03@gocbt.com", pin: "staff3", name: "Mr. Victor", role: "Registrar" },
    { id: "staff04@gocbt.com", pin: "staff4", name: "Mrs. Grace", role: "Admin Secretary" },
    { id: "staff05@gocbt.com", pin: "staff5", name: "Dr. Yusuf", role: "Dean of Students" }
];
