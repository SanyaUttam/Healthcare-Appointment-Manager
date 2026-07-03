const token = localStorage.getItem('authToken');
if (!token || localStorage.getItem('userRole') !== 'patient') {
    window.location.href = '/';
}

const specializations = [
    "General Physician",
    "Cardiologist",
    "Dermatologist",
    "Pediatrician",
    "Neurologist",
    "Orthopedic Surgeon",
    "Ophthalmologist",
    "Gastroenterologist",
    "Psychiatrist",
    "Endocrinologist"
];

const doctorsDatabase = [
    { id: "doc1", name: "Anjali Sharma", specialization: "General Physician" },
    { id: "doc2", name: "Amit Patel", specialization: "General Physician" },
    { id: "doc3", name: "Rahul Mehta", specialization: "Cardiologist" },
    { id: "doc4", name: "Vikram Malhotra", specialization: "Cardiologist" },
    { id: "doc5", name: "Priya Singh", specialization: "Dermatologist" },
    { id: "doc6", name: "Neha Kapoor", specialization: "Dermatologist" },
    { id: "doc7", name: "Siddharth Roy", specialization: "Pediatrician" },
    { id: "doc8", name: "Rohan Das", specialization: "Pediatrician" },
    { id: "doc9", name: "Kiran Verma", specialization: "Neurologist" },
    { id: "doc10", name: "Sanjay Dutt", specialization: "Neurologist" },
    { id: "doc11", name: "Arjun Khanna", specialization: "Orthopedic Surgeon" },
    { id: "doc12", name: "Rajesh Joshi", specialization: "Orthopedic Surgeon" },
    { id: "doc13", name: "Meera Nair", specialization: "Ophthalmologist" },
    { id: "doc14", name: "Aditi Rao", specialization: "Ophthalmologist" },
    { id: "doc15", name: "Gaurav Gupta", specialization: "Gastroenterologist" },
    { id: "doc16", name: "Kunwar Singh", specialization: "Gastroenterologist" },
    { id: "doc17", name: "Shalini Iyer", specialization: "Psychiatrist" },
    { id: "doc18", name: "Deepak Chopra", specialization: "Psychiatrist" },
    { id: "doc19", name: "Harish Kumar", specialization: "Endocrinologist" },
    { id: "doc20", name: "Sunita Reddy", specialization: "Endocrinologist" }
];

function initDashboard() {
    const specFilter = document.getElementById('specializationFilter');
    if (specFilter) {
        specFilter.innerHTML = '<option value="all">-- All Specializations --</option>';
        specializations.forEach(spec => {
            const opt = document.createElement('option');
            opt.value = spec;
            opt.innerText = spec;
            specFilter.appendChild(opt);
        });
    }
    renderDoctorDropdown('all');
    generateAvailableSlots();
}

function renderDoctorDropdown(filterSpec = 'all') {
    const docSelect = document.getElementById('doctorId');
    if (!docSelect) return;
    
    docSelect.innerHTML = '<option value="" disabled selected>-- Select a Doctor --</option>';
    
    doctorsDatabase.forEach(doc => {
        if (filterSpec === 'all' || doc.specialization === filterSpec) {
            const opt = document.createElement('option');
            opt.value = doc.id;
            opt.innerText = `Dr. ${doc.name} (${doc.specialization})`;
            docSelect.appendChild(opt);
        }
    });
}

document.getElementById('specializationFilter').addEventListener('change', (e) => {
    renderDoctorDropdown(e.target.value);
});

function generateAvailableSlots() {
    const slotSelect = document.getElementById('timeSlot');
    if (!slotSelect) return;

    slotSelect.innerHTML = '<option value="" disabled selected>-- Select a Slot --</option>';
    
    const slots = [
        "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
        "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
        "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
        "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
        "06:00 PM"
    ];

    slots.forEach(slot => {
        const opt = document.createElement('option');
        opt.value = slot;
        opt.innerText = slot;
        slotSelect.appendChild(opt);
    });
}

document.getElementById('bookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const docSelect = document.getElementById('doctorId');
    const doctorName = docSelect.options[docSelect.selectedIndex].text;
    
    const rawDate = document.getElementById('date').value; 
    let formattedDate = rawDate;
    if (rawDate) {
        const parts = rawDate.split('-');
        if (parts.length === 3) {
            formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
    }

    const payload = {
        doctorId: docSelect.value,
        date: formattedDate,
        timeSlot: document.getElementById('timeSlot').value,
        symptoms: document.getElementById('symptoms').value
    };

    const statusBox = document.getElementById('bookingStatusBox');
    const summaryCard = document.getElementById('summaryCard');
    
    statusBox.innerText = "Processing booking & analyzing symptoms...";
    statusBox.style.display = "block";
    summaryCard.style.display = "none";

    try {
        const response = await fetch('/api/appointments/book', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            statusBox.style.display = "none";
            summaryCard.style.display = "block";
            
            document.getElementById('resDoctor').innerText = doctorName;
            document.getElementById('resDate').innerText = payload.date;
            document.getElementById('resTime').innerText = payload.timeSlot;
            
            const triage = data.appointment?.aiPreVisitSummary || data.aiPreVisitSummary;
            const urgency = triage?.urgencyLevel || "Normal";
            const urgBadge = document.getElementById('resUrgency');
            urgBadge.innerText = urgency;
            urgBadge.className = urgency === 'High' ? 'badge-high' : 'badge-normal';
            
            document.getElementById('resGuidance').innerText = triage?.chiefComplaint || "Booking confirmed successfully.";
        } else {
            statusBox.innerText = `Error: ${data.message || "Booking failed"}`;
        }
    } catch (err) {
        statusBox.innerText = `Connection Error: ${err.message}`;
    }
});

function logout() {
    localStorage.clear();
    window.location.href = '/';
}
window.onload = initDashboard;