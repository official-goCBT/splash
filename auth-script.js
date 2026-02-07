// Local "Database" of Students
const studentDB = [
    { regNo: "2024/CS/001", pin: "1234", name: "John Doe", course: "Computer Science" },
    { regNo: "2024/ENG/050", pin: "5678", name: "Jane Smith", course: "Engineering" }
];

// 1. Handle Role Switching (Visual only for this demo)
function switchRole(role) {
    const idLabel = document.getElementById('idLabel');
    const userIDInput = document.getElementById('userID');
    
    if (role === 'fac') {
        idLabel.innerText = "Facilitator ID";
        userIDInput.placeholder = "e.g. FAC-1002";
    } else {
        idLabel.innerText = "Registration Number";
        userIDInput.placeholder = "e.g. 2024/CS/001";
    }
}

// 2. Main Login Function
function handleLogin() {
    const regNo = document.getElementById('userID').value;
    const pin = document.getElementById('userPass').value;
    const isStudent = document.getElementById('studentRole').checked;

    if (isStudent) {
        // Search for student in our local DB
        const student = studentDB.find(s => s.regNo === regNo && s.pin === pin);

        if (student) {
            // Save student data to localStorage (This survives refreshes)
            localStorage.setItem('currentUser', JSON.stringify(student));
            localStorage.setItem('isLoggedIn', 'true');
            
            alert(`Welcome back, ${student.name}! Redirecting to dashboard...`);
            window.location.href = "dashboard.html"; // Redirect to your dashboard page
        } else {
            alert("Invalid Registration Number or PIN.");
        }
    } else {
        alert("Facilitator login not yet configured in local CMS.");
    }
}
// Add this to your GitHub Home page script
window.onload = function() {
    const data = localStorage.getItem('currentUser');
    if (data) {
        const user = JSON.parse(data);
        console.log(`User ${user.name} logged in at ${user.lastLogin}`);
        
        // Example: If you have an element with id "status-bar"
        // document.getElementById('status-bar').innerText = `Welcome, ${user.name}. Last login: ${user.lastLogin}`;
    }
};

// 3. Persistence Logic: Check if user is already logged in on page load
window.onload = function() {
    // Hide splash screen after 2 seconds
    setTimeout(() => {
        document.getElementById('splash-screen').style.display = 'none';
    }, 2000);

    const loggedIn = localStorage.getItem('isLoggedIn');
    if (loggedIn === 'true') {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        console.log("Session active for:", user.name);
        // Optional: Redirect them automatically if they are already logged in
        // window.location.href = "dashboard.html";
    }
};
