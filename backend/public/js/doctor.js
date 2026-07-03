const token = localStorage.getItem('authToken');
if (!token || localStorage.getItem('userRole') !== 'doctor') {
    window.location.href = '/';
}

const mockAppointments = [
    {
        id: "65f1a2b3c4d5e6f7a8b9c999",
        patientName: "Jane Doe",
        date: "12-07-2026",
        timeSlot: "11:30 AM",
        symptoms: "Experiencing sudden acute respiratory distress accompanied by high fever.",
        aiSummary: {
            urgencyLevel: "High",
            chiefComplaint: "Acute respiratory distress with significant febrile presentation. Immediate objective lung auscultation advised. Rule out lower respiratory tract involvement."
        }
    },
    {
        id: "65f1a2b3c4d5e6f7a8b9c888",
        patientName: "John Smith",
        date: "12-07-2026",
        timeSlot: "02:30 PM",
        symptoms: "Chronic lower back pain radiating to left leg for the past 3 weeks.",
        aiSummary: {
            urgencyLevel: "Normal",
            chiefComplaint: "Suspected lumbar radiculopathy. Evaluate straight leg raise tracking parameter. Recommend initial non-weight bearing baseline tracking."
        }
    }
];

function loadDoctorAppointments() {
    const listContainer = document.getElementById('appointmentsList');
    if (!listContainer) return;

    listContainer.innerHTML = "";

    mockAppointments.forEach(app => {
        const row = document.createElement('tr');
        row.style.borderBottom = "1px solid #21262d";
        row.innerHTML = `
            <td style="padding: 10px; font-weight: bold; color: #c9d1d9;">${app.patientName}</td>
            <td style="padding: 10px; color: #8b949e;">${app.date}</td>
            <td style="padding: 10px; color: #58a6ff;">${app.timeSlot}</td>
            <td style="padding: 10px; color: #8b949e; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${app.symptoms}">${app.symptoms}</td>
            <td style="padding: 10px;">
                <button class="btn-secondary" style="padding: 4px 10px; font-size: 0.8rem; border-color: #8b5cf6; color: #a78bfa;" onclick="selectAppointment('${app.id}')">Open File</button>
            </td>
        `;
        listContainer.appendChild(row);
    });
}

function selectAppointment(id) {
    document.getElementById('appointmentId').value = id;
    
    const target = mockAppointments.find(app => app.id === id);
    if (!target) return;

    const aiBox = document.getElementById('aiSummaryBox');
    const aiUrgency = document.getElementById('aiUrgencyBadge');
    const aiGuidance = document.getElementById('aiGuidanceText');

    aiUrgency.innerText = target.aiSummary.urgencyLevel;
    aiUrgency.className = target.aiSummary.urgencyLevel === "High" ? "badge-high" : "badge-normal";
    aiGuidance.innerText = target.aiSummary.chiefComplaint;
    aiBox.style.display = "block";

    document.getElementById('doctorConsole').innerText = `Active Session Initialized\n---------------------------------\nPatient: ${target.patientName}\nDate: ${target.date}\nSlot: ${target.timeSlot}\nSymptoms: "${target.symptoms}"`;
}

document.getElementById('postVisitForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const payload = {
        appointmentId: document.getElementById('appointmentId').value,
        clinicalNotes: document.getElementById('clinicalNotes').value,
        prescriptions: document.getElementById('prescriptions').value
    };

    const outputContainer = document.getElementById('doctorConsole');
    outputContainer.innerText = "Processing automated clinical synthesis summary metrics...";

    try {
        const response = await fetch('/api/appointments/post-visit', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        outputContainer.innerText = `[System Status: Success]\n\nMongoDB Document Saved Successfully!\nAutomated patient summary emailed via NodeMailer to patient distribution loops.\nGoogle Calendar event state set to archived.`;
    } catch (err) {
        outputContainer.innerText = `Error: ${err.message}`;
    }
});

function logout() {
    localStorage.clear();
    window.location.href = '/';
}

window.onload = loadDoctorAppointments;