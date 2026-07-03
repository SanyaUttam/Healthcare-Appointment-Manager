const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

let patientToken;

beforeAll(async () => {
  await User.deleteMany({});
  await Appointment.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('🏥 End-to-End Core System Flow Tests', () => {
  
  it('1. Satisfies RBAC: Provisions a Patient Profile successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Patient',
        email: 'tester@example.com',
        password: 'password123',
        role: 'patient'
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    patientToken = res.body.token;
  });

  it('2. Satisfies LLM & Atomic Rules: Books slot and handles AI Triage without breaking on fallback errors', async () => {
    const res = await request(app)
      .post('/api/appointments/book')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        doctorId: new mongoose.Types.ObjectId().toString(),
        date: '2026-08-20',
        timeSlot: '11:00',
        symptoms: 'Experiencing sudden acute respiratory distress accompanied by high fever.'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('aiPreVisitSummary');
  });

  it('3. Satisfies Double-Booking Prevention: Rejects matching duplicate slot requests instantly', async () => {
    const res = await request(app)
      .post('/api/appointments/book')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        doctorId: new mongoose.Types.ObjectId().toString(),
        date: '2026-08-20',
        timeSlot: '11:00',
        symptoms: 'Duplicate ticket run'
      });

    expect(res.statusCode).toBe(400);
  });
});