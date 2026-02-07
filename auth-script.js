/* --- DATABASES (Students & Facilitators) --- */
const studentDB = [
    { regNo: "2024/CS/001", pin: "1111", name: "Adebayo Samuel", dept: "CS" },
    { regNo: "2024/CS/002", pin: "2222", name: "Chidi Okafor", dept: "CS" }
];

const facilitatorDB = [
    { id: "admin@gocbt.com", pin: "admin123", name: "Dr. Adeyemi" }
];

/* --- DYNAMIC UI SWITCHER --- */
function switchForm(role) {
    const formTitle = document.getElementById('formTitle');
    const idLabel = document.getElementById('idLabel');
    const userID = document.getElementById('userID');
    const passLabel = document.getElementById('passLabel');
    const authFooter = document.getElementById('authFooter');
    const submitBtn = document.getElementById('submitBtn');

    if (role === 'facilitator') {
        formTitle.innerText = "Facilitator Access";
        idLabel.innerText = "Official Email Address";
        userID.placeholder = "name@institution.com";
        passLabel.innerText = "Admin Password";
        submitBtn.innerText = "Secure Admin Login";
        authFooter.innerHTML = `<p>Interested in joining? <a href="#" class="link-btn">Apply as Facilitator</a></p>`;
    } else {
        formTitle.innerText = "Student Portal";
        idLabel.innerText = "Registration Number";
        userID.placeholder = "e.g., 2024/CS/001";
        passLabel.innerText = "Access PIN";
        submitBtn.innerText = "Sign In to Portal";
        authFooter.innerHTML = `<p>New student? <a href="#" class="link-btn">Join Students</a></p>`;
    }
}

/* --- LOGIN HANDLER --- */
function handleLogin() {
    const id = document.getElementById('userID').value.trim();
    const pin = document.getElementById('userPass').value.trim();
    const isStudent = document.getElementById('stuTab').checked;

    if (isStudent) {
        const user = studentDB.find(s => s.regNo === id && s.pin === pin);
        if (user) {
            localStorage.setItem('session', JSON.stringify({ ...user, role: 'student' }));
            window.location.href = "https://official-gocbt.github.io/Home/";
        } else {
            alert("❌ Invalid Student ID or PIN");
        }
    } else {
        const user = facilitatorDB.find(f => f.id === id && f.pin === pin);
        if (user) {
            localStorage.setItem('session', JSON.stringify({ ...user, role: 'facilitator' }));
            showDashboard();
        } else {
            alert("⚠️ Unauthorized Facilitator Access");
        }
    }
}

function showDashboard() {
    document.getElementById('authCard').classList.add('hidden');
    document.getElementById('adminView').classList.remove('hidden');
    // Code to populate the table goes here (same as previous script)
}

function logout() {
    localStorage.removeItem('session');
    location.reload();
}
