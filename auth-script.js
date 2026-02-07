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
    const id = document.getElementById('userID').value;
    const pin = document.getElementById('userPass').value;
    
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
