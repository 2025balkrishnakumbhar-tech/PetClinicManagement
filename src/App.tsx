/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Terminal,
  Database,
  Server,
  Activity,
  Search,
  Plus,
  Edit,
  Trash2,
  Copy,
  Check,
  Table,
  Filter,
  Clock,
  Code,
  Download,
  RefreshCw,
  Play,
  CheckCircle2,
  AlertCircle,
  Calendar,
  DollarSign,
  UserCheck,
  Stethoscope,
  HeartPulse,
  Eye,
  X,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Phone,
  Mail,
  MapPin,
  User,
  Hash,
  ArrowRight,
  ShieldAlert,
  FileCode
} from 'lucide-react';

// ==========================================
// Types & Schema Definitions
// ==========================================

export interface Owner {
  owner_id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  created_at: string;
}

export interface Pet {
  pet_id: number;
  name: string;
  species: 'Canine' | 'Feline' | 'Avian' | 'Exotic' | 'Reptile';
  breed: string;
  date_of_birth: string;
  owner_id: number;
  microchip_no: string;
  weight_kg: number;
  gender: 'Male' | 'Female';
  neutered: boolean;
  status: 'Healthy' | 'In Treatment' | 'Critical' | 'Post-Op';
}

export interface Veterinarian {
  vet_id: number;
  name: string;
  specialization: string;
  license_no: string;
  phone: string;
  shift: string;
  status: 'On Duty' | 'In Surgery' | 'Off Duty';
  room_no: string;
}

export interface Appointment {
  appointment_id: number;
  pet_id: number;
  vet_id: number;
  appointment_date: string;
  reason: string;
  priority: 'Routine' | 'Urgent' | 'Emergency';
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
}

export interface TreatmentRecord {
  treatment_id: number;
  appointment_id: number | null;
  pet_id: number;
  vet_id: number;
  treatment_date: string;
  diagnosis: string;
  procedure_notes: string;
  prescriptions: string;
  cost: number;
}

export interface SQLLogEntry {
  id: string;
  timestamp: string;
  query: string;
  latencyMs: number;
  affectedRows: number;
  tag: string;
  status: 'SUCCESS' | 'ERROR';
}

// Initial Seed Data (Indian Context)
const INITIAL_OWNERS: Owner[] = [
  { owner_id: 101, first_name: 'Rajesh', last_name: 'Sharma', phone: '+91 98201 44521', email: 'rajesh.sharma@gmail.com', address: 'Flat 402, Sea Breeze Apts, Bandra West', city: 'Mumbai, Maharashtra', created_at: '2026-01-14' },
  { owner_id: 102, first_name: 'Priya', last_name: 'Patel', phone: '+91 98450 12389', email: 'priya.patel@synthetix.in', address: 'Villa 12, Indiranagar 100ft Road', city: 'Bengaluru, Karnataka', created_at: '2026-01-22' },
  { owner_id: 103, first_name: 'Aarav', last_name: 'Deshmukh', phone: '+91 99234 88761', email: 'aarav.deshmukh@tcs.com', address: 'Plot 88, Lane 5, Koregaon Park North', city: 'Pune, Maharashtra', created_at: '2026-02-05' },
  { owner_id: 104, first_name: 'Ananya', last_name: 'Iyer', phone: '+91 97110 56742', email: 'ananya.iyer@titan-labs.in', address: 'B-304, Cyber Spire, Connaught Place', city: 'New Delhi', created_at: '2026-02-18' },
  { owner_id: 105, first_name: 'Vikram', last_name: 'Malhotra', phone: '+91 98840 99120', email: 'vikram.malhotra@quantumvec.in', address: 'Row House 7, Road No. 36, Jubilee Hills', city: 'Hyderabad, Telangana', created_at: '2026-03-01' }
];

const INITIAL_PETS: Pet[] = [
  { pet_id: 201, name: 'Sheru', species: 'Canine', breed: 'Desi Indie Hound (Cyber-Augmented)', date_of_birth: '2023-04-12', owner_id: 101, microchip_no: 'CHIP-IN-982-MH', weight_kg: 24.5, gender: 'Male', neutered: true, status: 'Healthy' },
  { pet_id: 202, name: 'Simba', species: 'Canine', breed: 'Golden Retriever (Nano-Cardio)', date_of_birth: '2022-08-15', owner_id: 102, microchip_no: 'CHIP-IN-412-KA', weight_kg: 31.8, gender: 'Male', neutered: true, status: 'In Treatment' },
  { pet_id: 203, name: 'Mithu', species: 'Avian', breed: 'Indian Ringneck (Holo-Feather)', date_of_birth: '2023-02-10', owner_id: 103, microchip_no: 'CHIP-IN-733-PN', weight_kg: 0.35, gender: 'Male', neutered: false, status: 'Healthy' },
  { pet_id: 204, name: 'Rani', species: 'Feline', breed: 'Indian Calico (Optical Sensor V2)', date_of_birth: '2024-01-19', owner_id: 104, microchip_no: 'CHIP-IN-219-DL', weight_kg: 4.2, gender: 'Female', neutered: true, status: 'Post-Op' },
  { pet_id: 205, name: 'Bruno', species: 'Canine', breed: 'Mudhol Hound (Bio-Sensor)', date_of_birth: '2021-06-15', owner_id: 105, microchip_no: 'CHIP-IN-664-HYD', weight_kg: 27.0, gender: 'Male', neutered: true, status: 'Critical' },
  { pet_id: 206, name: 'Bella', species: 'Feline', breed: 'Persian Longhair (Cyber-Implant)', date_of_birth: '2024-09-02', owner_id: 101, microchip_no: 'CHIP-IN-891-MH', weight_kg: 3.8, gender: 'Female', neutered: true, status: 'Healthy' }
];

const INITIAL_VETS: Veterinarian[] = [
  { vet_id: 301, name: 'Dr. Arvind Swaminathan, BVSc & AH, MVSc', specialization: 'Cyber-Surgical & Orthopedic Reconstruction', license_no: 'VCI-MH-2016-8421', phone: '+91 (022) 2640-0112', shift: 'Morning 08:30 - 16:30', status: 'On Duty', room_no: 'OT-Alpha 1 (Bandra)' },
  { vet_id: 302, name: 'Dr. Meera Nambiar, BVSc, PhD', specialization: 'Neural-Implants & Neuro-Diagnostics', license_no: 'VCI-KA-2018-9411', phone: '+91 (080) 4120-0115', shift: 'Afternoon 14:00 - 22:00', status: 'In Surgery', room_no: 'Neuro-Lab 2 (Indiranagar)' },
  { vet_id: 303, name: 'Dr. Rohan Joshi, MVSc', specialization: 'Avian & Exotic Nanobiotic Care', license_no: 'VCI-MH-2020-7320', phone: '+91 (020) 2560-0119', shift: 'Night Surveillance 22:00 - 06:00', status: 'On Duty', room_no: 'Exotic Pod 3 (Koregaon)' },
  { vet_id: 304, name: 'Dr. Kavita Reddy, BVSc & AH, MVSc', specialization: 'Critical Care & Bio-Cardiology', license_no: 'VCI-TS-2015-6504', phone: '+91 (040) 2350-0122', shift: 'Morning 08:30 - 16:30', status: 'Off Duty', room_no: 'ICU Bay 4 (Jubilee Hills)' }
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  { appointment_id: 401, pet_id: 201, vet_id: 301, appointment_date: '2026-10-27 10:30', reason: 'Annual titanium joint calibration & monsoon skin check', priority: 'Routine', status: 'Scheduled' },
  { appointment_id: 402, pet_id: 202, vet_id: 304, appointment_date: '2026-10-26 11:30', reason: 'Bio-cardio pump rhythm flutter & heat fatigue', priority: 'Urgent', status: 'In Progress' },
  { appointment_id: 403, pet_id: 203, vet_id: 303, appointment_date: '2026-10-25 16:00', reason: 'Beak alignment & wing nano-feather static check', priority: 'Routine', status: 'Completed' },
  { appointment_id: 404, pet_id: 205, vet_id: 301, appointment_date: '2026-10-26 14:45', reason: 'Emergency arterial stent pressure drop', priority: 'Emergency', status: 'Scheduled' }
];

const INITIAL_TREATMENTS: TreatmentRecord[] = [
  { treatment_id: 501, appointment_id: 403, pet_id: 203, vet_id: 303, treatment_date: '2026-10-25', diagnosis: 'Feather Fiber Static & Desiccation', procedure_notes: 'Applied cryogenic herbal-nanogel plumage moisturizer and grounding diode.', prescriptions: 'Himalaya Fur-Glow + NanoDerm Spray', cost: 1850.00 },
  { treatment_id: 502, appointment_id: null, pet_id: 201, vet_id: 301, treatment_date: '2026-09-18', diagnosis: 'Tendon Strain & Hydraulic Paw Wear', procedure_notes: 'Replaced micro-actuator spring and ultrasonic laser therapy.', prescriptions: 'Synoquin Joint Care + SynthLubricant-IN', cost: 5400.00 },
  { treatment_id: 503, appointment_id: null, pet_id: 204, vet_id: 302, treatment_date: '2026-08-10', diagnosis: 'Optical Sensor Dust Lag & Viral Rhinitis', procedure_notes: 'Flushed optical tear-duct sensor with sterile saline; ultrasonic nebulization.', prescriptions: 'Cifran Eye Drops + Enrofloxacin Syrup', cost: 3200.00 }
];

export default function App() {
  // Navigation active tab: FR1 to FR7
  const [activeTab, setActiveTab] = useState<'FR1' | 'FR2' | 'FR3' | 'FR4' | 'FR5' | 'FR6' | 'FR7'>('FR1');

  // Relational In-Memory Database State
  const [owners, setOwners] = useState<Owner[]>(INITIAL_OWNERS);
  const [pets, setPets] = useState<Pet[]>(INITIAL_PETS);
  const [vets, setVets] = useState<Veterinarian[]>(INITIAL_VETS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [treatments, setTreatments] = useState<TreatmentRecord[]>(INITIAL_TREATMENTS);

  // SQL Terminal Logs State
  const [sqlLogs, setSqlLogs] = useState<SQLLogEntry[]>([]);
  const [terminalExpanded, setTerminalExpanded] = useState<boolean>(true);
  const [copiedQueryId, setCopiedQueryId] = useState<string | null>(null);
  const [adHocQuery, setAdHocQuery] = useState<string>('');
  const [adHocResult, setAdHocResult] = useState<{ columns: string[]; rows: any[]; query: string } | null>(null);

  // Search & Filtering States
  const [ownerSearch, setOwnerSearch] = useState<string>('');
  const [petSpeciesFilter, setPetSpeciesFilter] = useState<string>('ALL');
  const [petSearch, setPetSearch] = useState<string>('');
  const [apptStatusFilter, setApptStatusFilter] = useState<string>('ALL');

  // Modal / Drawer States
  const [editingOwner, setEditingOwner] = useState<Owner | null>(null);
  const [showAddOwnerModal, setShowAddOwnerModal] = useState<boolean>(false);
  const [showAddPetModal, setShowAddPetModal] = useState<boolean>(false);
  const [showAddApptModal, setShowAddApptModal] = useState<boolean>(false);
  const [showAddTreatmentModal, setShowAddTreatmentModal] = useState<boolean>(false);
  const [showAddVetModal, setShowAddVetModal] = useState<boolean>(false);
  const [showSingleFileExportModal, setShowSingleFileExportModal] = useState<boolean>(false);

  // FR6 Reports filter states
  const [reportOwnerQuery, setReportOwnerQuery] = useState<string>('');
  const [reportDateFrom, setReportDateFrom] = useState<string>('2026-10-01');
  const [reportDateTo, setReportDateTo] = useState<string>('2026-10-31');

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // ==========================================
  // Core Requirement: logSQL(queryString)
  // ==========================================
  const logSQL = (
    queryString: string,
    options?: { latencyMs?: number; affectedRows?: number; tag?: string; status?: 'SUCCESS' | 'ERROR' }
  ) => {
    const now = new Date();
    const timeStr = `${now.toTimeString().split(' ')[0]}.${String(now.getMilliseconds()).padStart(3, '0')}`;
    const entry: SQLLogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: timeStr,
      query: queryString.trim(),
      latencyMs: options?.latencyMs ?? Number((Math.random() * 2.2 + 0.4).toFixed(1)),
      affectedRows: options?.affectedRows ?? 1,
      tag: options?.tag || `[${activeTab}]`,
      status: options?.status || 'SUCCESS'
    };

    setSqlLogs(prev => [entry, ...prev.slice(0, 99)]);
  };

  // Log initial bootstrap query on mount
  useEffect(() => {
    logSQL(
      `-- SYSTEM BOOTSTRAP INITIALIZED\nSELECT * FROM Owner ORDER BY Owner_ID ASC;\nSELECT * FROM Pet JOIN Owner ON Pet.Owner_ID = Owner.Owner_ID;`,
      { latencyMs: 1.2, affectedRows: INITIAL_OWNERS.length + INITIAL_PETS.length, tag: '[BOOTSTRAP]' }
    );
  }, []);

  // Scroll to bottom of terminal if user prefers
  const scrollToLatest = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Tab switching with bound SQL queries
  const handleTabSwitch = (tab: 'FR1' | 'FR2' | 'FR3' | 'FR4' | 'FR5' | 'FR6' | 'FR7') => {
    setActiveTab(tab);
    switch (tab) {
      case 'FR1':
        logSQL(`SELECT Owner_ID, First_Name, Last_Name, Phone, Email, Address, City FROM Owner ORDER BY Owner_ID ASC;`, {
          affectedRows: owners.length,
          tag: '[FR1_NAV]'
        });
        break;
      case 'FR2':
        logSQL(
          `SELECT Pet.Pet_ID, Pet.Name, Pet.Species, Pet.Breed, Pet.Date_Of_Birth, Pet.Weight_KG, Pet.Status, Owner.First_Name || ' ' || Owner.Last_Name AS Owner_Name FROM Pet JOIN Owner ON Pet.Owner_ID = Owner.Owner_ID ORDER BY Pet.Pet_ID ASC;`,
          { affectedRows: pets.length, tag: '[FR2_NAV]' }
        );
        break;
      case 'FR3':
        logSQL(`SELECT Vet_ID, Name, Specialization, License_No, Shift, Status, Room_No FROM Veterinarian ORDER BY Vet_ID ASC;`, {
          affectedRows: vets.length,
          tag: '[FR3_NAV]'
        });
        break;
      case 'FR4':
        logSQL(
          `SELECT a.Appointment_ID, p.Name AS Pet_Name, o.Last_Name AS Owner_Last_Name, v.Name AS Vet_Name, a.Appointment_Date, a.Priority, a.Status FROM Appointment a JOIN Pet p ON a.Pet_ID = p.Pet_ID JOIN Owner o ON p.Owner_ID = o.Owner_ID JOIN Veterinarian v ON a.Vet_ID = v.Vet_ID ORDER BY a.Appointment_Date DESC;`,
          { affectedRows: appointments.length, tag: '[FR4_NAV]' }
        );
        break;
      case 'FR5':
        logSQL(
          `SELECT t.Treatment_ID, t.Treatment_Date, p.Name AS Patient, v.Name AS Attending_Vet, t.Diagnosis, t.Prescriptions, t.Cost FROM TreatmentRecord t JOIN Pet p ON t.Pet_ID = p.Pet_ID JOIN Veterinarian v ON t.Vet_ID = v.Vet_ID ORDER BY t.Treatment_Date DESC;`,
          { affectedRows: treatments.length, tag: '[FR5_NAV]' }
        );
        break;
      case 'FR6':
        logSQL(
          `-- AGGREGATE SUMMARY & REPORT QUERY\nSELECT p.Species, COUNT(p.Pet_ID) AS Total_Registered, COUNT(a.Appointment_ID) AS Appointments_Count, COALESCE(SUM(t.Cost), 0) AS Total_Revenue FROM Pet p LEFT JOIN Appointment a ON p.Pet_ID = a.Pet_ID LEFT JOIN TreatmentRecord t ON p.Pet_ID = t.Pet_ID GROUP BY p.Species;`,
          { affectedRows: 5, tag: '[FR6_NAV]' }
        );
        break;
      case 'FR7':
        logSQL(
          `SELECT table_name, column_name, data_type, is_nullable FROM information_schema.columns WHERE table_schema = 'public' ORDER BY table_name, ordinal_position;`,
          { affectedRows: 28, tag: '[FR7_SCHEMA]' }
        );
        break;
    }
  };

  // Copy query to clipboard
  const handleCopyQuery = (id: string, query: string) => {
    navigator.clipboard.writeText(query);
    setCopiedQueryId(id);
    setTimeout(() => setCopiedQueryId(null), 1800);
  };

  // Run Ad-Hoc SQL Query
  const executeAdHocSQL = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const queryTrimmed = adHocQuery.trim();
    if (!queryTrimmed) return;

    const upper = queryTrimmed.toUpperCase();
    let rows: any[] = [];
    let cols: string[] = [];

    // Simple robust mock parser for user interactive queries
    if (upper.includes('PET') && (upper.includes('JOIN') || upper.includes('OWNER'))) {
      cols = ['Pet_ID', 'Pet_Name', 'Species', 'Breed', 'Owner_Name', 'Status'];
      rows = pets.map(p => {
        const o = owners.find(x => x.owner_id === p.owner_id);
        return {
          Pet_ID: p.pet_id,
          Pet_Name: p.name,
          Species: p.species,
          Breed: p.breed,
          Owner_Name: o ? `${o.first_name} ${o.last_name}` : 'N/A',
          Status: p.status
        };
      });
    } else if (upper.includes('FROM PET')) {
      cols = ['Pet_ID', 'Name', 'Species', 'Breed', 'Owner_ID', 'Weight_KG', 'Status'];
      rows = pets.map(p => ({
        Pet_ID: p.pet_id,
        Name: p.name,
        Species: p.species,
        Breed: p.breed,
        Owner_ID: p.owner_id,
        Weight_KG: `${p.weight_kg} kg`,
        Status: p.status
      }));
    } else if (upper.includes('FROM OWNER')) {
      cols = ['Owner_ID', 'First_Name', 'Last_Name', 'Phone', 'Email', 'City'];
      rows = owners.map(o => ({
        Owner_ID: o.owner_id,
        First_Name: o.first_name,
        Last_Name: o.last_name,
        Phone: o.phone,
        Email: o.email,
        City: o.city
      }));
    } else if (upper.includes('FROM VET') || upper.includes('VETERINARIAN')) {
      cols = ['Vet_ID', 'Name', 'Specialization', 'License_No', 'Shift', 'Status'];
      rows = vets.map(v => ({
        Vet_ID: v.vet_id,
        Name: v.name,
        Specialization: v.specialization,
        License_No: v.license_no,
        Shift: v.shift,
        Status: v.status
      }));
    } else if (upper.includes('FROM APPOINTMENT')) {
      cols = ['Appointment_ID', 'Pet_ID', 'Vet_ID', 'Appointment_Date', 'Priority', 'Status'];
      rows = appointments.map(a => ({
        Appointment_ID: a.appointment_id,
        Pet_ID: a.pet_id,
        Vet_ID: a.vet_id,
        Appointment_Date: a.appointment_date,
        Priority: a.priority,
        Status: a.status
      }));
    } else if (upper.includes('FROM TREATMENT')) {
      cols = ['Treatment_ID', 'Pet_ID', 'Vet_ID', 'Diagnosis', 'Cost', 'Treatment_Date'];
      rows = treatments.map(t => ({
        Treatment_ID: t.treatment_id,
        Pet_ID: t.pet_id,
        Vet_ID: t.vet_id,
        Diagnosis: t.diagnosis,
        Cost: `₹${t.cost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
        Treatment_Date: t.treatment_date
      }));
    } else {
      // Fallback result
      cols = ['System_Status', 'In_Memory_Engine', 'Total_Records'];
      rows = [{
        System_Status: 'ONLINE / READ_WRITE',
        In_Memory_Engine: 'PostgreSQL Relational Dialect',
        Total_Records: owners.length + pets.length + vets.length + appointments.length + treatments.length
      }];
    }

    logSQL(queryTrimmed, {
      latencyMs: Number((Math.random() * 1.5 + 0.3).toFixed(1)),
      affectedRows: rows.length,
      tag: '[RAW_SQL_EXEC]'
    });

    setAdHocResult({ columns: cols, rows, query: queryTrimmed });
  };

  // Reset to default seeds
  const handleResetDatabase = () => {
    setOwners(INITIAL_OWNERS);
    setPets(INITIAL_PETS);
    setVets(INITIAL_VETS);
    setAppointments(INITIAL_APPOINTMENTS);
    setTreatments(INITIAL_TREATMENTS);

    logSQL(
      `-- DATABASE ROLLBACK TO SEED POINT\nTRUNCATE TreatmentRecord, Appointment, Pet, Veterinarian, Owner CASCADE;\n-- Reloading initial fixture records (5 Owners, 6 Pets, 4 Vets, 4 Appointments, 3 Treatments)...`,
      { latencyMs: 3.4, affectedRows: 22, tag: '[DB_RESTORE]' }
    );
  };

  // Export standalone single-file HTML
  const generateStandaloneHTML = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PetVet - Cyber Pet Clinic Database Management System</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { background-color: #040711; color: #e2e8f0; font-family: 'Plus Jakarta Sans', sans-serif; }
    .font-mono, code, pre { font-family: 'JetBrains Mono', monospace; }
    .cyber-grid {
      background-size: 32px 32px;
      background-image: linear-gradient(to right, rgba(0,240,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,240,255,0.04) 1px, transparent 1px);
    }
    .cyber-glass {
      background: rgba(8, 14, 29, 0.78);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(0, 240, 255, 0.18);
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.6), 0 0 15px -3px rgba(0, 240, 255, 0.05);
    }
    .cyber-input {
      background: rgba(5, 9, 20, 0.85);
      border: 1px solid rgba(56, 189, 248, 0.3);
      color: #f1f5f9;
      outline: none;
    }
    .cyber-input:focus {
      border-color: #00f0ff;
      box-shadow: 0 0 12px rgba(0, 240, 255, 0.25);
    }
  </style>
</head>
<body class="cyber-grid h-screen flex flex-col overflow-hidden text-slate-100">
  <div class="p-6">
    <h1 class="text-xl font-bold font-mono text-cyan-400">PETVET DBMS // INDIA REGION (IN-WEST)</h1>
    <p class="text-xs text-slate-400 font-mono mt-1">Currency: INR (₹) · Host: 127.0.0.1:5432 · DB: petvet_prod_in</p>
  </div>
</body>
</html>`;
  };

  const handleDownloadStandaloneHTML = () => {
    const html = generateStandaloneHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'petvet_single_file_dbms.html';
    a.click();
    URL.revokeObjectURL(url);
    logSQL('-- EXPORTED STANDALONE SINGLE-FILE HTML APPLICATION FOR PETVET', { tag: '[HTML_EXPORT]' });
  };

  // Export SQL dump
  const handleExportSQLDump = () => {
    const dump = `-- ========================================================
-- PETVET CYBER PET CLINIC DATABASE SYSTEM DUMP
-- Region: India (IN-WEST) / Currency: INR (₹)
-- Engine: PostgreSQL 16.4 / ISO SQL-92
-- Timestamp: ${new Date().toISOString()}
-- ========================================================

CREATE TABLE IF NOT EXISTS Owner (
    Owner_ID SERIAL PRIMARY KEY,
    First_Name VARCHAR(60) NOT NULL,
    Last_Name VARCHAR(60) NOT NULL,
    Phone VARCHAR(30) NOT NULL,
    Email VARCHAR(120) UNIQUE NOT NULL,
    Address TEXT,
    City VARCHAR(60),
    Created_At DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS Pet (
    Pet_ID SERIAL PRIMARY KEY,
    Name VARCHAR(60) NOT NULL,
    Species VARCHAR(40) NOT NULL,
    Breed VARCHAR(60),
    Date_Of_Birth DATE NOT NULL,
    Owner_ID INT NOT NULL REFERENCES Owner(Owner_ID) ON DELETE CASCADE,
    Microchip_No VARCHAR(50) UNIQUE,
    Weight_KG NUMERIC(5,2),
    Gender VARCHAR(10),
    Neutered BOOLEAN DEFAULT TRUE,
    Status VARCHAR(30) DEFAULT 'Healthy'
);

CREATE TABLE IF NOT EXISTS Veterinarian (
    Vet_ID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Specialization VARCHAR(100),
    License_No VARCHAR(50) UNIQUE NOT NULL,
    Phone VARCHAR(30),
    Shift VARCHAR(60),
    Status VARCHAR(30) DEFAULT 'On Duty',
    Room_No VARCHAR(30)
);

CREATE TABLE IF NOT EXISTS Appointment (
    Appointment_ID SERIAL PRIMARY KEY,
    Pet_ID INT NOT NULL REFERENCES Pet(Pet_ID) ON DELETE CASCADE,
    Vet_ID INT NOT NULL REFERENCES Veterinarian(Vet_ID),
    Appointment_Date TIMESTAMP NOT NULL,
    Reason TEXT NOT NULL,
    Priority VARCHAR(20) DEFAULT 'Routine',
    Status VARCHAR(30) DEFAULT 'Scheduled'
);

CREATE TABLE IF NOT EXISTS TreatmentRecord (
    Treatment_ID SERIAL PRIMARY KEY,
    Appointment_ID INT REFERENCES Appointment(Appointment_ID) ON DELETE SET NULL,
    Pet_ID INT NOT NULL REFERENCES Pet(Pet_ID) ON DELETE CASCADE,
    Vet_ID INT NOT NULL REFERENCES Veterinarian(Vet_ID),
    Treatment_Date DATE NOT NULL,
    Diagnosis TEXT NOT NULL,
    Procedure_Notes TEXT,
    Prescriptions TEXT,
    Cost NUMERIC(10,2) NOT NULL DEFAULT 0.00 -- Currency in INR (₹)
);

-- Seed Data Inserts (Indian Region Context)
${owners.map(o => `INSERT INTO Owner (Owner_ID, First_Name, Last_Name, Phone, Email, Address, City) VALUES (${o.owner_id}, '${o.first_name}', '${o.last_name}', '${o.phone}', '${o.email}', '${o.address}', '${o.city}');`).join('\n')}

${pets.map(p => `INSERT INTO Pet (Pet_ID, Name, Species, Breed, Date_Of_Birth, Owner_ID, Microchip_No, Weight_KG, Status) VALUES (${p.pet_id}, '${p.name}', '${p.species}', '${p.breed}', '${p.date_of_birth}', ${p.owner_id}, '${p.microchip_no}', ${p.weight_kg}, '${p.status}');`).join('\n')}

${vets.map(v => `INSERT INTO Veterinarian (Vet_ID, Name, Specialization, License_No, Shift, Status) VALUES (${v.vet_id}, '${v.name}', '${v.specialization}', '${v.license_no}', '${v.shift}', '${v.status}');`).join('\n')}

${appointments.map(a => `INSERT INTO Appointment (Appointment_ID, Pet_ID, Vet_ID, Appointment_Date, Reason, Priority, Status) VALUES (${a.appointment_id}, ${a.pet_id}, ${a.vet_id}, '${a.appointment_date}', '${a.reason}', '${a.priority}', '${a.status}');`).join('\n')}

${treatments.map(t => `INSERT INTO TreatmentRecord (Treatment_ID, Pet_ID, Vet_ID, Treatment_Date, Diagnosis, Prescriptions, Cost) VALUES (${t.treatment_id}, ${t.pet_id}, ${t.vet_id}, '${t.treatment_date}', '${t.diagnosis}', '${t.prescriptions}', ${t.cost});`).join('\n')}
`;

    const blob = new Blob([dump], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `petvet_schema_dump_${Date.now()}.sql`;
    a.click();
    URL.revokeObjectURL(url);

    logSQL(`-- GENERATED & EXPORTED FULL RELATIONAL DDL SCHEMA DUMP FOR PETVET (.SQL)\n-- Wrote 5 tables and ${owners.length + pets.length + vets.length + appointments.length + treatments.length} row records in INR (₹).`, {
      latencyMs: 4.8,
      affectedRows: owners.length + pets.length + vets.length + appointments.length + treatments.length,
      tag: '[SQL_DUMP]'
    });
  };

  // ==========================================
  // Form Submission Handlers
  // ==========================================

  // FR1: Add Owner
  const handleAddOwner = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newId = Math.max(...owners.map(o => o.owner_id), 100) + 1;
    const newOwner: Owner = {
      owner_id: newId,
      first_name: fd.get('first_name') as string,
      last_name: fd.get('last_name') as string,
      phone: fd.get('phone') as string,
      email: fd.get('email') as string,
      address: fd.get('address') as string,
      city: (fd.get('city') as string) || 'Neo-Veridia',
      created_at: new Date().toISOString().split('T')[0]
    };

    setOwners(prev => [...prev, newOwner]);
    setShowAddOwnerModal(false);

    logSQL(
      `INSERT INTO Owner (Owner_ID, First_Name, Last_Name, Phone, Email, Address, City, Created_At)\nVALUES (${newId}, '${newOwner.first_name}', '${newOwner.last_name}', '${newOwner.phone}', '${newOwner.email}', '${newOwner.address}', '${newOwner.city}', '${newOwner.created_at}')\nRETURNING *;`,
      { affectedRows: 1, tag: '[FR1_OWNER_INSERT]' }
    );
  };

  // FR1: Update Owner Contact Info
  const handleUpdateOwner = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingOwner) return;
    const fd = new FormData(e.currentTarget);
    const updated: Owner = {
      ...editingOwner,
      first_name: fd.get('first_name') as string,
      last_name: fd.get('last_name') as string,
      phone: fd.get('phone') as string,
      email: fd.get('email') as string,
      address: fd.get('address') as string,
      city: fd.get('city') as string
    };

    setOwners(prev => prev.map(o => (o.owner_id === updated.owner_id ? updated : o)));
    setEditingOwner(null);

    logSQL(
      `UPDATE Owner\nSET First_Name = '${updated.first_name}', Last_Name = '${updated.last_name}', Phone = '${updated.phone}', Email = '${updated.email}', Address = '${updated.address}', City = '${updated.city}'\nWHERE Owner_ID = ${updated.owner_id}\nRETURNING *;`,
      { affectedRows: 1, tag: '[FR1_OWNER_UPDATE]' }
    );
  };

  // FR1: Delete Owner
  const handleDeleteOwner = (id: number) => {
    const associatedPets = pets.filter(p => p.owner_id === id);
    if (associatedPets.length > 0) {
      const confirmCascade = confirm(`Foreign Key Constraint Alert: Owner #${id} has ${associatedPets.length} registered pet(s). Deleting will CASCADE DELETE their pets and records. Proceed?`);
      if (!confirmCascade) return;
      // Cascade delete
      setPets(prev => prev.filter(p => p.owner_id !== id));
    }

    setOwners(prev => prev.filter(o => o.owner_id !== id));
    logSQL(`DELETE FROM Owner WHERE Owner_ID = ${id} CASCADE;`, {
      affectedRows: 1 + associatedPets.length,
      tag: '[FR1_OWNER_DELETE]'
    });
  };

  // FR2: Add Pet
  const handleAddPet = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newId = Math.max(...pets.map(p => p.pet_id), 200) + 1;
    const newPet: Pet = {
      pet_id: newId,
      name: fd.get('name') as string,
      species: fd.get('species') as Pet['species'],
      breed: fd.get('breed') as string,
      date_of_birth: fd.get('date_of_birth') as string,
      owner_id: Number(fd.get('owner_id')),
      microchip_no: (fd.get('microchip_no') as string) || `CHIP-${Math.floor(Math.random() * 899 + 100)}-GEN`,
      weight_kg: Number(fd.get('weight_kg')) || 5.0,
      gender: (fd.get('gender') as 'Male' | 'Female') || 'Male',
      neutered: fd.get('neutered') === 'on',
      status: (fd.get('status') as Pet['status']) || 'Healthy'
    };

    setPets(prev => [...prev, newPet]);
    setShowAddPetModal(false);

    logSQL(
      `INSERT INTO Pet (Pet_ID, Name, Species, Breed, Date_Of_Birth, Owner_ID, Microchip_No, Weight_KG, Gender, Neutered, Status)\nVALUES (${newId}, '${newPet.name}', '${newPet.species}', '${newPet.breed}', '${newPet.date_of_birth}', ${newPet.owner_id}, '${newPet.microchip_no}', ${newPet.weight_kg}, '${newPet.gender}', ${newPet.neutered}, '${newPet.status}')\nRETURNING *;`,
      { affectedRows: 1, tag: '[FR2_PET_INSERT]' }
    );
  };

  // FR2: Delete Pet
  const handleDeletePet = (id: number) => {
    setPets(prev => prev.filter(p => p.pet_id !== id));
    setAppointments(prev => prev.filter(a => a.pet_id !== id));
    setTreatments(prev => prev.filter(t => t.pet_id !== id));

    logSQL(`DELETE FROM Pet WHERE Pet_ID = ${id} CASCADE;`, {
      affectedRows: 1,
      tag: '[FR2_PET_DELETE]'
    });
  };

  // FR3: Add Veterinarian
  const handleAddVet = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newId = Math.max(...vets.map(v => v.vet_id), 300) + 1;
    const newVet: Veterinarian = {
      vet_id: newId,
      name: fd.get('name') as string,
      specialization: fd.get('specialization') as string,
      license_no: fd.get('license_no') as string,
      phone: fd.get('phone') as string,
      shift: fd.get('shift') as string,
      status: (fd.get('status') as Veterinarian['status']) || 'On Duty',
      room_no: (fd.get('room_no') as string) || 'Clinical Suite 1'
    };

    setVets(prev => [...prev, newVet]);
    setShowAddVetModal(false);

    logSQL(
      `INSERT INTO Veterinarian (Vet_ID, Name, Specialization, License_No, Phone, Shift, Status, Room_No)\nVALUES (${newId}, '${newVet.name}', '${newVet.specialization}', '${newVet.license_no}', '${newVet.phone}', '${newVet.shift}', '${newVet.status}', '${newVet.room_no}')\nRETURNING *;`,
      { affectedRows: 1, tag: '[FR3_VET_INSERT]' }
    );
  };

  // FR3: Toggle Vet Status
  const handleToggleVetStatus = (vetId: number, currentStatus: Veterinarian['status']) => {
    const nextStatus: Veterinarian['status'] =
      currentStatus === 'On Duty' ? 'In Surgery' : currentStatus === 'In Surgery' ? 'Off Duty' : 'On Duty';

    setVets(prev => prev.map(v => (v.vet_id === vetId ? { ...v, status: nextStatus } : v)));

    logSQL(`UPDATE Veterinarian SET Status = '${nextStatus}' WHERE Vet_ID = ${vetId};`, {
      affectedRows: 1,
      tag: '[FR3_VET_STATUS]'
    });
  };

  // FR4: Add Appointment
  const handleAddAppointment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newId = Math.max(...appointments.map(a => a.appointment_id), 400) + 1;
    const newAppt: Appointment = {
      appointment_id: newId,
      pet_id: Number(fd.get('pet_id')),
      vet_id: Number(fd.get('vet_id')),
      appointment_date: `${fd.get('date')} ${fd.get('time')}`,
      reason: fd.get('reason') as string,
      priority: (fd.get('priority') as Appointment['priority']) || 'Routine',
      status: 'Scheduled'
    };

    setAppointments(prev => [...prev, newAppt]);
    setShowAddApptModal(false);

    logSQL(
      `INSERT INTO Appointment (Appointment_ID, Pet_ID, Vet_ID, Appointment_Date, Reason, Priority, Status)\nVALUES (${newId}, ${newAppt.pet_id}, ${newAppt.vet_id}, '${newAppt.appointment_date}', '${newAppt.reason}', '${newAppt.priority}', 'Scheduled')\nRETURNING *;`,
      { affectedRows: 1, tag: '[FR4_APPT_INSERT]' }
    );
  };

  // FR4: Update Appointment Status
  const handleUpdateApptStatus = (apptId: number, newStatus: Appointment['status']) => {
    setAppointments(prev => prev.map(a => (a.appointment_id === apptId ? { ...a, status: newStatus } : a)));

    logSQL(`UPDATE Appointment SET Status = '${newStatus}' WHERE Appointment_ID = ${apptId};`, {
      affectedRows: 1,
      tag: '[FR4_APPT_STATUS]'
    });
  };

  // FR5: Add Treatment
  const handleAddTreatment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newId = Math.max(...treatments.map(t => t.treatment_id), 500) + 1;
    const newTr: TreatmentRecord = {
      treatment_id: newId,
      appointment_id: fd.get('appointment_id') ? Number(fd.get('appointment_id')) : null,
      pet_id: Number(fd.get('pet_id')),
      vet_id: Number(fd.get('vet_id')),
      treatment_date: (fd.get('treatment_date') as string) || new Date().toISOString().split('T')[0],
      diagnosis: fd.get('diagnosis') as string,
      procedure_notes: fd.get('procedure_notes') as string,
      prescriptions: fd.get('prescriptions') as string,
      cost: parseFloat(fd.get('cost') as string) || 0
    };

    setTreatments(prev => [...prev, newTr]);
    setShowAddTreatmentModal(false);

    logSQL(
      `INSERT INTO TreatmentRecord (Treatment_ID, Appointment_ID, Pet_ID, Vet_ID, Treatment_Date, Diagnosis, Procedure_Notes, Prescriptions, Cost)\nVALUES (${newId}, ${newTr.appointment_id || 'NULL'}, ${newTr.pet_id}, ${newTr.vet_id}, '${newTr.treatment_date}', '${newTr.diagnosis}', '${newTr.procedure_notes}', '${newTr.prescriptions}', ${newTr.cost.toFixed(2)})\nRETURNING *;`,
      { affectedRows: 1, tag: '[FR5_TREATMENT_INSERT]' }
    );
  };

  // Filtered views
  const filteredOwners = useMemo(() => {
    if (!ownerSearch.trim()) return owners;
    const term = ownerSearch.toLowerCase();
    return owners.filter(
      o =>
        o.first_name.toLowerCase().includes(term) ||
        o.last_name.toLowerCase().includes(term) ||
        o.email.toLowerCase().includes(term) ||
        o.phone.includes(term) ||
        o.city.toLowerCase().includes(term)
    );
  }, [owners, ownerSearch]);

  const filteredPets = useMemo(() => {
    return pets.filter(p => {
      const matchSpecies = petSpeciesFilter === 'ALL' || p.species === petSpeciesFilter;
      const matchSearch =
        !petSearch.trim() ||
        p.name.toLowerCase().includes(petSearch.toLowerCase()) ||
        p.breed.toLowerCase().includes(petSearch.toLowerCase()) ||
        p.microchip_no.toLowerCase().includes(petSearch.toLowerCase());
      return matchSpecies && matchSearch;
    });
  }, [pets, petSpeciesFilter, petSearch]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(a => {
      return apptStatusFilter === 'ALL' || a.status === apptStatusFilter;
    });
  }, [appointments, apptStatusFilter]);

  // FR6 Reports Data Calculations
  const reportPetsByOwner = useMemo(() => {
    if (!reportOwnerQuery.trim()) return [];
    const term = reportOwnerQuery.toLowerCase();
    const matchedOwners = owners.filter(
      o => o.first_name.toLowerCase().includes(term) || o.last_name.toLowerCase().includes(term) || o.email.toLowerCase().includes(term)
    );
    const ownerIds = new Set(matchedOwners.map(o => o.owner_id));
    return pets
      .filter(p => ownerIds.has(p.owner_id))
      .map(p => {
        const owner = owners.find(o => o.owner_id === p.owner_id);
        return { pet: p, owner };
      });
  }, [owners, pets, reportOwnerQuery]);

  const reportAppointmentsByDate = useMemo(() => {
    return appointments.filter(a => {
      const dateOnly = a.appointment_date.split(' ')[0];
      return dateOnly >= reportDateFrom && dateOnly <= reportDateTo;
    });
  }, [appointments, reportDateFrom, reportDateTo]);

  // Aggregate statistics for cyber dashboard
  const totalRevenue = useMemo(() => {
    return treatments.reduce((sum, t) => sum + t.cost, 0);
  }, [treatments]);

  const activeSurgeryCount = useMemo(() => {
    return vets.filter(v => v.status === 'In Surgery').length;
  }, [vets]);

  // Helper function to colorize SQL query in the terminal
  const highlightSQL = (sqlText: string) => {
    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'ON', 'ORDER BY',
      'GROUP BY', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CASCADE', 'RETURNING',
      'LIMIT', 'ASC', 'DESC', 'COUNT', 'SUM', 'AVG', 'COALESCE', 'AS', 'AND', 'OR', 'LIKE', 'ILIKE',
      'BETWEEN', 'NULL', 'IS', 'TRUNCATE', 'TABLE', 'CREATE TABLE', 'REFERENCES'
    ];

    // Escape HTML then highlight
    const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi');
    return sqlText.replace(regex, '<span class="text-cyan-300 font-semibold">$1</span>');
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#040711] text-slate-100 font-sans select-none overflow-hidden cyber-grid">
      {/* Top Application Bar */}
      <header className="h-14 border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-md px-4 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.3)]">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white text-base">PET<span className="text-cyan-400">VET</span></span>
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">DBMS_PROD_IN</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono hidden md:block">RELATIONAL ENGINE · POSTGRESQL v16.4 · INDIA REGION (IN-WEST)</p>
          </div>
        </div>

        {/* Global Metrics Strip */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-slate-500">HOST:</span>
            <span className="text-cyan-300">127.0.0.1:5432</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-slate-500">DATABASE:</span>
            <span className="text-emerald-400 font-medium">petvet_prod_in</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-slate-500">CONN POOL:</span>
            <span className="text-cyan-400">8/20 ACTIVE</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-slate-500">TOTAL BILLED:</span>
            <span className="text-emerald-400 font-semibold">₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadStandaloneHTML}
            title="Download Standalone Single-File (HTML+CSS+JS in one file)"
            className="px-3 py-1.5 rounded text-xs font-mono bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 transition-colors flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(0,255,157,0.2)]"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Single-File HTML</span>
          </button>
          <button
            onClick={handleExportSQLDump}
            title="Export Schema & Seed Data as .SQL script"
            className="px-3 py-1.5 rounded text-xs font-mono bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/50 hover:border-cyan-400 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export SQL Dump</span>
          </button>
          <button
            onClick={handleResetDatabase}
            title="Rollback database state to seed fixtures"
            className="px-3 py-1.5 rounded text-xs font-mono bg-slate-900 border border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Fixtures</span>
          </button>
        </div>
      </header>

      {/* Main Layout Area: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Cyber Sidebar */}
        <aside className="w-64 border-r border-cyan-500/15 bg-[#060a16]/90 backdrop-blur-md flex flex-col shrink-0 z-20">
          <div className="p-3 border-b border-cyan-950/60">
            <div className="text-[10px] font-mono tracking-wider text-cyan-400/80 uppercase font-semibold">
              FUNCTIONAL REQUIREMENTS
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Select module to execute queries
            </div>
          </div>

          <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
            {/* FR1: Owner Management */}
            <button
              onClick={() => handleTabSwitch('FR1')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'FR1'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-cyan-400 font-bold">FR1</span>
                    <span className="font-semibold text-slate-200">Owner Management</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">Contacts & Registration</div>
                </div>
              </div>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-800">
                {owners.length}
              </span>
            </button>

            {/* FR2: Pet Registration */}
            <button
              onClick={() => handleTabSwitch('FR2')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'FR2'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <HeartPulse className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-cyan-400 font-bold">FR2</span>
                    <span className="font-semibold text-slate-200">Pet Registration</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">Patient Bios & Species</div>
                </div>
              </div>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-800">
                {pets.length}
              </span>
            </button>

            {/* FR3: Veterinarian Management */}
            <button
              onClick={() => handleTabSwitch('FR3')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'FR3'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Stethoscope className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-cyan-400 font-bold">FR3</span>
                    <span className="font-semibold text-slate-200">Veterinarians</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">Clinicians & Surgeons</div>
                </div>
              </div>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-800">
                {vets.length}
              </span>
            </button>

            {/* FR4: Appointment Management */}
            <button
              onClick={() => handleTabSwitch('FR4')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'FR4'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-cyan-400 font-bold">FR4</span>
                    <span className="font-semibold text-slate-200">Appointments</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">Scheduling & Bookings</div>
                </div>
              </div>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-800">
                {appointments.length}
              </span>
            </button>

            {/* FR5: Treatment Recording */}
            <button
              onClick={() => handleTabSwitch('FR5')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'FR5'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Activity className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-cyan-400 font-bold">FR5</span>
                    <span className="font-semibold text-slate-200">Treatment Records</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">EMR, Diagnoses & Costs</div>
                </div>
              </div>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-800">
                {treatments.length}
              </span>
            </button>

            {/* FR6: Reports & Search */}
            <button
              onClick={() => handleTabSwitch('FR6')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'FR6'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-cyan-400 font-bold">FR6</span>
                    <span className="font-semibold text-slate-200">Reports & Search</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">Relational Analytics</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-1 py-0.5 rounded border border-cyan-800/60">
                SQL JOIN
              </span>
            </button>

            {/* FR7: Schema Inspector & ERD */}
            <button
              onClick={() => handleTabSwitch('FR7')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'FR7'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Code className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-cyan-400 font-bold">FR7</span>
                    <span className="font-semibold text-slate-200">Schema & ERD</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">Data Architecture & Keys</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1 py-0.5 rounded border border-emerald-800/60">
                5 DDL
              </span>
            </button>
          </nav>

          {/* Quick Stats in Sidebar Footer */}
          <div className="p-3 border-t border-cyan-950/80 bg-slate-950/50 text-[11px] font-mono text-slate-400 space-y-1.5">
            <div className="flex justify-between items-center">
              <span>SQL Queries Executed:</span>
              <span className="text-cyan-400 font-bold">{sqlLogs.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Surgeries in Progress:</span>
              <span className="text-amber-400 font-bold">{activeSurgeryCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Active Terminal Mode:</span>
              <span className="text-emerald-400">SYNC_AUDIT</span>
            </div>
          </div>
        </aside>

        {/* Dynamic Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-64">
          {/* ========================================================= */}
          {/* FR1: Owner Management */}
          {/* ========================================================= */}
          {activeTab === 'FR1' && (
            <div className="space-y-5 max-w-7xl mx-auto">
              {/* Header Card */}
              <div className="cyber-glass rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold">
                    <span>FR1 // ENTITY: OWNER</span>
                    <span>·</span>
                    <span>PRIMARY KEY: Owner_ID</span>
                  </div>
                  <h1 className="text-xl font-bold text-white tracking-tight mt-0.5">
                    Owner Management & Contact Directory
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage client profiles, contact credentials, and residential sectors for patient billing and legal consent.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search owners (name, email, phone)..."
                      value={ownerSearch}
                      onChange={e => {
                        setOwnerSearch(e.target.value);
                        logSQL(`SELECT * FROM Owner WHERE First_Name ILIKE '%${e.target.value}%' OR Last_Name ILIKE '%${e.target.value}%' OR Email ILIKE '%${e.target.value}%';`, {
                          affectedRows: filteredOwners.length,
                          tag: '[FR1_FILTER]'
                        });
                      }}
                      className="cyber-input text-xs pl-8 pr-3 py-1.5 rounded-lg w-56 md:w-64 placeholder:text-slate-500"
                    />
                  </div>
                  <button
                    onClick={() => setShowAddOwnerModal(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.4)] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Owner</span>
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="cyber-glass rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-cyan-500/20 bg-slate-950/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Table className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono font-semibold text-slate-200">TABLE: public.Owner</span>
                    <span className="text-[11px] font-mono text-slate-500">({filteredOwners.length} tuples returned)</span>
                  </div>
                  <div className="text-[11px] font-mono text-cyan-400/80">
                    SQL QUERY: SELECT * FROM Owner ORDER BY Owner_ID ASC;
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-cyan-500/20 bg-slate-950/40 text-slate-400 font-mono text-[11px]">
                        <th className="py-2.5 px-4 font-semibold text-cyan-400">Owner_ID</th>
                        <th className="py-2.5 px-4 font-semibold">Full Name</th>
                        <th className="py-2.5 px-4 font-semibold">Contact Phone</th>
                        <th className="py-2.5 px-4 font-semibold">Email Address</th>
                        <th className="py-2.5 px-4 font-semibold">Residential Sector</th>
                        <th className="py-2.5 px-4 font-semibold">City</th>
                        <th className="py-2.5 px-4 font-semibold text-center">Pets Count</th>
                        <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cyan-500/10 font-mono">
                      {filteredOwners.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-slate-500 font-mono text-xs">
                            No owner records found matching query parameters.
                          </td>
                        </tr>
                      ) : (
                        filteredOwners.map(owner => {
                          const petCount = pets.filter(p => p.owner_id === owner.owner_id).length;
                          return (
                            <tr key={owner.owner_id} className="hover:bg-cyan-950/30 transition-colors">
                              <td className="py-2.5 px-4 text-cyan-300 font-bold">#{owner.owner_id}</td>
                              <td className="py-2.5 px-4 font-sans font-semibold text-slate-200">
                                {owner.first_name} {owner.last_name}
                              </td>
                              <td className="py-2.5 px-4 text-slate-300 flex items-center gap-1.5">
                                <Phone className="w-3 h-3 text-slate-500" />
                                <span>{owner.phone}</span>
                              </td>
                              <td className="py-2.5 px-4 text-slate-300">
                                <span className="text-cyan-300/90">{owner.email}</span>
                              </td>
                              <td className="py-2.5 px-4 text-slate-400 truncate max-w-xs">{owner.address}</td>
                              <td className="py-2.5 px-4 text-slate-300">{owner.city}</td>
                              <td className="py-2.5 px-4 text-center">
                                <span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">
                                  {petCount} {petCount === 1 ? 'Pet' : 'Pets'}
                                </span>
                              </td>
                              <td className="py-2.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setEditingOwner(owner)}
                                    title="Edit Owner Contact Info (Triggers SQL UPDATE)"
                                    className="p-1 rounded hover:bg-cyan-900/60 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteOwner(owner.owner_id)}
                                    title="Delete Owner (Triggers SQL DELETE CASCADE)"
                                    className="p-1 rounded hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* FR2: Pet Registration */}
          {/* ========================================================= */}
          {activeTab === 'FR2' && (
            <div className="space-y-5 max-w-7xl mx-auto">
              {/* Header Card */}
              <div className="cyber-glass rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold">
                    <span>FR2 // ENTITY: PET</span>
                    <span>·</span>
                    <span>FOREIGN KEY: Owner_ID → Owner</span>
                  </div>
                  <h1 className="text-xl font-bold text-white tracking-tight mt-0.5">
                    Pet Registration & Patient Roster
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Register cyber-enhanced and biological companion patients with RFID microchip identification and species classification.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Filter tabs */}
                  <div className="flex items-center gap-1 p-1 bg-slate-950/80 rounded-lg border border-cyan-500/20 text-xs font-mono">
                    {['ALL', 'Canine', 'Feline', 'Avian', 'Reptile', 'Exotic'].map(sp => (
                      <button
                        key={sp}
                        onClick={() => {
                          setPetSpeciesFilter(sp);
                          logSQL(
                            sp === 'ALL'
                              ? `SELECT * FROM Pet JOIN Owner ON Pet.Owner_ID = Owner.Owner_ID;`
                              : `SELECT * FROM Pet JOIN Owner ON Pet.Owner_ID = Owner.Owner_ID WHERE Pet.Species = '${sp}';`,
                            { tag: '[FR2_FILTER]' }
                          );
                        }}
                        className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                          petSpeciesFilter === sp
                            ? 'bg-cyan-500 text-slate-950 font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {sp}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search pet / chip..."
                      value={petSearch}
                      onChange={e => setPetSearch(e.target.value)}
                      className="cyber-input text-xs pl-8 pr-3 py-1.5 rounded-lg w-40 md:w-48 placeholder:text-slate-500"
                    />
                  </div>

                  <button
                    onClick={() => setShowAddPetModal(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.4)] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Register New Pet</span>
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="cyber-glass rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-cyan-500/20 bg-slate-950/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Table className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono font-semibold text-slate-200">
                      TABLE: public.Pet (Relational JOIN public.Owner)
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">({filteredPets.length} records)</span>
                  </div>
                  <div className="text-[11px] font-mono text-cyan-400/80 hidden md:block">
                    SELECT Pet.*, Owner.First_Name, Owner.Last_Name FROM Pet JOIN Owner ON Pet.Owner_ID = Owner.Owner_ID;
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-cyan-500/20 bg-slate-950/40 text-slate-400 font-mono text-[11px]">
                        <th className="py-2.5 px-4 font-semibold text-cyan-400">Pet_ID</th>
                        <th className="py-2.5 px-4 font-semibold">Patient Name</th>
                        <th className="py-2.5 px-4 font-semibold">Species</th>
                        <th className="py-2.5 px-4 font-semibold">Breed / Model</th>
                        <th className="py-2.5 px-4 font-semibold">Date of Birth</th>
                        <th className="py-2.5 px-4 font-semibold text-cyan-400">Owner (FK)</th>
                        <th className="py-2.5 px-4 font-semibold">Microchip ID</th>
                        <th className="py-2.5 px-4 font-semibold">Weight</th>
                        <th className="py-2.5 px-4 font-semibold">Clinical Status</th>
                        <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cyan-500/10 font-mono">
                      {filteredPets.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="py-8 text-center text-slate-500 font-mono text-xs">
                            No pet registrations found for this filter.
                          </td>
                        </tr>
                      ) : (
                        filteredPets.map(pet => {
                          const owner = owners.find(o => o.owner_id === pet.owner_id);
                          return (
                            <tr key={pet.pet_id} className="hover:bg-cyan-950/30 transition-colors">
                              <td className="py-2.5 px-4 text-cyan-300 font-bold">#{pet.pet_id}</td>
                              <td className="py-2.5 px-4 font-sans font-bold text-white flex items-center gap-2">
                                <span>{pet.name}</span>
                                {pet.neutered && (
                                  <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                                    NTR
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-4">
                                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                                  {pet.species}
                                </span>
                              </td>
                              <td className="py-2.5 px-4 text-slate-300">{pet.breed}</td>
                              <td className="py-2.5 px-4 text-slate-400">{pet.date_of_birth}</td>
                              <td className="py-2.5 px-4 font-sans text-cyan-300 font-medium">
                                {owner ? `${owner.first_name} ${owner.last_name}` : `[Owner #${pet.owner_id}]`}
                              </td>
                              <td className="py-2.5 px-4 text-slate-400 text-[11px]">{pet.microchip_no}</td>
                              <td className="py-2.5 px-4 text-slate-300">{pet.weight_kg.toFixed(1)} kg</td>
                              <td className="py-2.5 px-4">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                                    pet.status === 'Healthy'
                                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                                      : pet.status === 'In Treatment'
                                      ? 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
                                      : pet.status === 'Critical'
                                      ? 'bg-rose-950/80 text-rose-400 border border-rose-800/60 animate-pulse'
                                      : 'bg-indigo-950/80 text-indigo-400 border border-indigo-800/60'
                                  }`}
                                >
                                  {pet.status}
                                </span>
                              </td>
                              <td className="py-2.5 px-4 text-right">
                                <button
                                  onClick={() => handleDeletePet(pet.pet_id)}
                                  title="Delete Pet (Triggers SQL DELETE)"
                                  className="p-1 rounded hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* FR3: Veterinarian Management */}
          {/* ========================================================= */}
          {activeTab === 'FR3' && (
            <div className="space-y-5 max-w-7xl mx-auto">
              <div className="cyber-glass rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold">
                    <span>FR3 // ENTITY: VETERINARIAN</span>
                    <span>·</span>
                    <span>PRIMARY KEY: Vet_ID</span>
                  </div>
                  <h1 className="text-xl font-bold text-white tracking-tight mt-0.5">
                    Veterinary Staff & Clinician Roster
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage attending veterinary doctors, clinical certifications, operational operating rooms, and active shift rotations.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowAddVetModal(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.4)] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Register Veterinarian</span>
                  </button>
                </div>
              </div>

              {/* Grid of Vets with Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {vets.map(vet => (
                  <div
                    key={vet.vet_id}
                    className="cyber-glass rounded-xl p-4 border border-cyan-500/20 hover:border-cyan-400/50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-cyan-400 font-bold">VET #{vet.vet_id}</span>
                        <button
                          onClick={() => handleToggleVetStatus(vet.vet_id, vet.status)}
                          title="Click to cycle status: On Duty -> In Surgery -> Off Duty"
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold cursor-pointer transition-colors ${
                            vet.status === 'On Duty'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : vet.status === 'In Surgery'
                              ? 'bg-rose-950 text-rose-400 border border-rose-800'
                              : 'bg-slate-900 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {vet.status} ↻
                        </button>
                      </div>
                      <h3 className="font-bold text-white text-sm mt-2">{vet.name}</h3>
                      <p className="text-xs text-cyan-300/80 font-mono mt-0.5">{vet.specialization}</p>

                      <div className="mt-3 pt-3 border-t border-cyan-500/10 space-y-1.5 text-[11px] font-mono text-slate-300">
                        <div className="flex justify-between">
                          <span className="text-slate-500">License:</span>
                          <span className="text-slate-300">{vet.license_no}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Contact:</span>
                          <span>{vet.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Assigned Bay:</span>
                          <span className="text-cyan-400">{vet.room_no}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Shift:</span>
                          <span className="truncate max-w-[130px]">{vet.shift}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-cyan-500/10 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-500">Appointments:</span>
                      <span className="text-white font-bold">
                        {appointments.filter(a => a.vet_id === vet.vet_id).length} Active
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Data Table View */}
              <div className="cyber-glass rounded-xl overflow-hidden mt-6">
                <div className="px-4 py-3 border-b border-cyan-500/20 bg-slate-950/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Table className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono font-semibold text-slate-200">TABLE: public.Veterinarian</span>
                    <span className="text-[11px] font-mono text-slate-500">({vets.length} certified staff)</span>
                  </div>
                  <div className="text-[11px] font-mono text-cyan-400/80">
                    SELECT Vet_ID, Name, Specialization, License_No, Shift, Status FROM Veterinarian;
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-cyan-500/20 bg-slate-950/40 text-slate-400 font-mono text-[11px]">
                        <th className="py-2.5 px-4 font-semibold text-cyan-400">Vet_ID</th>
                        <th className="py-2.5 px-4 font-semibold">Clinician Name</th>
                        <th className="py-2.5 px-4 font-semibold">Primary Specialization</th>
                        <th className="py-2.5 px-4 font-semibold">License No</th>
                        <th className="py-2.5 px-4 font-semibold">Phone Extension</th>
                        <th className="py-2.5 px-4 font-semibold">Shift Schedule</th>
                        <th className="py-2.5 px-4 font-semibold">Clinical Bay</th>
                        <th className="py-2.5 px-4 font-semibold text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cyan-500/10 font-mono">
                      {vets.map(v => (
                        <tr key={v.vet_id} className="hover:bg-cyan-950/30 transition-colors">
                          <td className="py-2.5 px-4 text-cyan-300 font-bold">#{v.vet_id}</td>
                          <td className="py-2.5 px-4 font-sans font-semibold text-white">{v.name}</td>
                          <td className="py-2.5 px-4 text-cyan-300/90">{v.specialization}</td>
                          <td className="py-2.5 px-4 text-slate-400">{v.license_no}</td>
                          <td className="py-2.5 px-4 text-slate-300">{v.phone}</td>
                          <td className="py-2.5 px-4 text-slate-400">{v.shift}</td>
                          <td className="py-2.5 px-4 text-cyan-400">{v.room_no}</td>
                          <td className="py-2.5 px-4 text-right">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono ${
                                v.status === 'On Duty'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : v.status === 'In Surgery'
                                  ? 'bg-rose-950 text-rose-400 border border-rose-800'
                                  : 'bg-slate-900 text-slate-400 border border-slate-700'
                              }`}
                            >
                              {v.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* FR4: Appointment Management */}
          {/* ========================================================= */}
          {activeTab === 'FR4' && (
            <div className="space-y-5 max-w-7xl mx-auto">
              <div className="cyber-glass rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold">
                    <span>FR4 // ENTITY: APPOINTMENT</span>
                    <span>·</span>
                    <span>FOREIGN KEYS: Pet_ID, Vet_ID</span>
                  </div>
                  <h1 className="text-xl font-bold text-white tracking-tight mt-0.5">
                    Appointment Booking & Schedule Queue
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Schedule diagnostic procedures, routine wellness checkups, and emergency bio-stabilization sessions.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 p-1 bg-slate-950/80 rounded-lg border border-cyan-500/20 text-xs font-mono">
                    {['ALL', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'].map(st => (
                      <button
                        key={st}
                        onClick={() => {
                          setApptStatusFilter(st);
                          logSQL(
                            st === 'ALL'
                              ? `SELECT * FROM Appointment;`
                              : `SELECT * FROM Appointment WHERE Status = '${st}';`,
                            { tag: '[FR4_FILTER]' }
                          );
                        }}
                        className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                          apptStatusFilter === st
                            ? 'bg-cyan-500 text-slate-950 font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowAddApptModal(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.4)] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Book Appointment</span>
                  </button>
                </div>
              </div>

              {/* Appointment Table */}
              <div className="cyber-glass rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-cyan-500/20 bg-slate-950/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Table className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono font-semibold text-slate-200">
                      TABLE: public.Appointment (JOIN Pet, Owner, Veterinarian)
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      ({filteredAppointments.length} bookings)
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-cyan-400/80 hidden md:block">
                    SELECT a.*, p.Name, v.Name FROM Appointment a JOIN Pet p ON a.Pet_ID = p.Pet_ID;
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-cyan-500/20 bg-slate-950/40 text-slate-400 font-mono text-[11px]">
                        <th className="py-2.5 px-4 font-semibold text-cyan-400">Appt_ID</th>
                        <th className="py-2.5 px-4 font-semibold">Appointment Date & Time</th>
                        <th className="py-2.5 px-4 font-semibold text-cyan-400">Patient Pet</th>
                        <th className="py-2.5 px-4 font-semibold">Owner</th>
                        <th className="py-2.5 px-4 font-semibold">Attending Veterinarian</th>
                        <th className="py-2.5 px-4 font-semibold">Reason / Chief Complaint</th>
                        <th className="py-2.5 px-4 font-semibold">Priority</th>
                        <th className="py-2.5 px-4 font-semibold">Status</th>
                        <th className="py-2.5 px-4 font-semibold text-right">Update Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cyan-500/10 font-mono">
                      {filteredAppointments.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="py-8 text-center text-slate-500 font-mono text-xs">
                            No appointments found for current filter.
                          </td>
                        </tr>
                      ) : (
                        filteredAppointments.map(appt => {
                          const pet = pets.find(p => p.pet_id === appt.pet_id);
                          const owner = pet ? owners.find(o => o.owner_id === pet.owner_id) : null;
                          const vet = vets.find(v => v.vet_id === appt.vet_id);

                          return (
                            <tr key={appt.appointment_id} className="hover:bg-cyan-950/30 transition-colors">
                              <td className="py-2.5 px-4 text-cyan-300 font-bold">#{appt.appointment_id}</td>
                              <td className="py-2.5 px-4 font-mono text-white flex items-center gap-1.5">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span>{appt.appointment_date}</span>
                              </td>
                              <td className="py-2.5 px-4 font-sans font-bold text-cyan-300">
                                {pet ? pet.name : `Pet #${appt.pet_id}`}
                                {pet && <span className="text-[10px] text-slate-400 ml-1">({pet.species})</span>}
                              </td>
                              <td className="py-2.5 px-4 text-slate-300">
                                {owner ? `${owner.first_name} ${owner.last_name}` : 'N/A'}
                              </td>
                              <td className="py-2.5 px-4 text-slate-200">{vet ? vet.name : `Vet #${appt.vet_id}`}</td>
                              <td className="py-2.5 px-4 text-slate-300 max-w-xs truncate">{appt.reason}</td>
                              <td className="py-2.5 px-4">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                    appt.priority === 'Emergency'
                                      ? 'bg-rose-950 text-rose-400 border border-rose-800'
                                      : appt.priority === 'Urgent'
                                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                      : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                                  }`}
                                >
                                  {appt.priority}
                                </span>
                              </td>
                              <td className="py-2.5 px-4">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                                    appt.status === 'Completed'
                                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                      : appt.status === 'In Progress'
                                      ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                                      : appt.status === 'Cancelled'
                                      ? 'bg-slate-900 text-slate-400 border border-slate-700'
                                      : 'bg-indigo-950 text-indigo-400 border border-indigo-800'
                                  }`}
                                >
                                  {appt.status}
                                </span>
                              </td>
                              <td className="py-2.5 px-4 text-right">
                                <select
                                  value={appt.status}
                                  onChange={e => handleUpdateApptStatus(appt.appointment_id, e.target.value as any)}
                                  className="cyber-input text-[11px] font-mono px-2 py-1 rounded bg-slate-900 cursor-pointer"
                                >
                                  <option value="Scheduled">Scheduled</option>
                                  <option value="In Progress">In Progress</option>
                                  <option value="Completed">Completed</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* FR5: Treatment Recording */}
          {/* ========================================================= */}
          {activeTab === 'FR5' && (
            <div className="space-y-5 max-w-7xl mx-auto">
              <div className="cyber-glass rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold">
                    <span>FR5 // ENTITY: TREATMENTRECORD</span>
                    <span>·</span>
                    <span>FINANCIAL & EMR AUDIT</span>
                  </div>
                  <h1 className="text-xl font-bold text-white tracking-tight mt-0.5">
                    Treatment Recording, Diagnoses & Billing Ledger
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Record clinical diagnoses, prescription drugs, surgical procedures, and itemized billing totals.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right px-3 py-1.5 rounded-lg bg-slate-950 border border-emerald-500/30 text-xs font-mono">
                    <span className="text-slate-400 text-[10px] block">TOTAL BILLED (INR):</span>
                    <span className="text-emerald-400 font-bold text-sm">
                      ₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <button
                    onClick={() => setShowAddTreatmentModal(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.4)] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Record New Treatment</span>
                  </button>
                </div>
              </div>

              {/* Treatment Table */}
              <div className="cyber-glass rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-cyan-500/20 bg-slate-950/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Table className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono font-semibold text-slate-200">
                      TABLE: public.TreatmentRecord (Relational JOIN Pet, Veterinarian)
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">({treatments.length} records)</span>
                  </div>
                  <div className="text-[11px] font-mono text-cyan-400/80 hidden md:block">
                    SELECT t.*, p.Name, v.Name FROM TreatmentRecord t JOIN Pet p ON t.Pet_ID = p.Pet_ID;
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-cyan-500/20 bg-slate-950/40 text-slate-400 font-mono text-[11px]">
                        <th className="py-2.5 px-4 font-semibold text-cyan-400">Treatment_ID</th>
                        <th className="py-2.5 px-4 font-semibold">Date</th>
                        <th className="py-2.5 px-4 font-semibold text-cyan-400">Patient</th>
                        <th className="py-2.5 px-4 font-semibold">Attending Vet</th>
                        <th className="py-2.5 px-4 font-semibold">Diagnosis</th>
                        <th className="py-2.5 px-4 font-semibold">Procedure Notes</th>
                        <th className="py-2.5 px-4 font-semibold">Prescriptions</th>
                        <th className="py-2.5 px-4 font-semibold text-right text-emerald-400">Cost (INR - ₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cyan-500/10 font-mono">
                      {treatments.map(tr => {
                        const pet = pets.find(p => p.pet_id === tr.pet_id);
                        const vet = vets.find(v => v.vet_id === tr.vet_id);
                        return (
                          <tr key={tr.treatment_id} className="hover:bg-cyan-950/30 transition-colors">
                            <td className="py-2.5 px-4 text-cyan-300 font-bold">#{tr.treatment_id}</td>
                            <td className="py-2.5 px-4 text-slate-300">{tr.treatment_date}</td>
                            <td className="py-2.5 px-4 font-sans font-bold text-white">
                              {pet ? pet.name : `Pet #${tr.pet_id}`}
                            </td>
                            <td className="py-2.5 px-4 text-slate-200">{vet ? vet.name : `Vet #${tr.vet_id}`}</td>
                            <td className="py-2.5 px-4 text-amber-300/90 font-medium">{tr.diagnosis}</td>
                            <td className="py-2.5 px-4 text-slate-400 max-w-xs truncate">{tr.procedure_notes}</td>
                            <td className="py-2.5 px-4 text-cyan-300/80">{tr.prescriptions}</td>
                            <td className="py-2.5 px-4 text-right font-bold text-emerald-400">
                              ₹{tr.cost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* FR6: Reports & Relational Search */}
          {/* ========================================================= */}
          {activeTab === 'FR6' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="cyber-glass rounded-xl p-5">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold">
                  <span>FR6 // RELATIONAL REPORTS & ADVANCED SEARCH</span>
                  <span>·</span>
                  <span>CROSS-TABLE JOINS</span>
                </div>
                <h1 className="text-xl font-bold text-white tracking-tight mt-0.5">
                  Multi-Table Search & Clinical Analytics Engine
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Execute parameter-driven cross-table SQL joins to query patients by owner, audit appointment ranges, and compute aggregations.
                </p>
              </div>

              {/* Search Section 1: Find Pets by Owner */}
              <div className="cyber-glass rounded-xl p-5 border border-cyan-500/25">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cyan-500/15">
                  <div>
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <Search className="w-4 h-4 text-cyan-400" />
                      <span>Query 1: Find Pets by Owner (Relational JOIN)</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Executes: <code className="text-cyan-300 font-mono text-[11px]">SELECT Pet.* FROM Pet JOIN Owner ON Pet.Owner_ID = Owner.Owner_ID WHERE Owner.Name ILIKE '%query%'</code>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Type owner name (e.g. Sharma, Patel, Deshmukh)..."
                      value={reportOwnerQuery}
                      onChange={e => {
                        setReportOwnerQuery(e.target.value);
                        logSQL(
                          `SELECT p.Pet_ID, p.Name, p.Species, p.Breed, o.First_Name, o.Last_Name, o.Email\nFROM Pet p\nJOIN Owner o ON p.Owner_ID = o.Owner_ID\nWHERE o.First_Name ILIKE '%${e.target.value}%' OR o.Last_Name ILIKE '%${e.target.value}%';`,
                          { tag: '[FR6_OWNER_SEARCH]' }
                        );
                      }}
                      className="cyber-input text-xs px-3 py-1.5 rounded-lg w-64 placeholder:text-slate-500"
                    />
                    <button
                      onClick={() => setReportOwnerQuery('Sharma')}
                      className="px-2.5 py-1.5 rounded text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 cursor-pointer hover:bg-cyan-900"
                    >
                      Preset: Sharma
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  {reportOwnerQuery.trim() === '' ? (
                    <div className="p-6 text-center text-slate-500 text-xs font-mono bg-slate-950/40 rounded-lg border border-dashed border-cyan-500/20">
                      Enter an owner name above to execute the SQL JOIN query and view related pets.
                    </div>
                  ) : reportPetsByOwner.length === 0 ? (
                    <div className="p-4 text-center text-rose-400/80 text-xs font-mono bg-slate-950/40 rounded-lg">
                      No pets linked to owner matching query "{reportOwnerQuery}".
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-mono">
                        <thead>
                          <tr className="text-slate-400 border-b border-cyan-500/20 text-[11px]">
                            <th className="py-2 px-3 text-cyan-400">Pet_ID</th>
                            <th className="py-2 px-3">Pet Name</th>
                            <th className="py-2 px-3">Species</th>
                            <th className="py-2 px-3">Breed</th>
                            <th className="py-2 px-3">Owner Name</th>
                            <th className="py-2 px-3">Owner Contact</th>
                            <th className="py-2 px-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-cyan-500/10">
                          {reportPetsByOwner.map(({ pet, owner }) => (
                            <tr key={pet.pet_id} className="hover:bg-cyan-950/20">
                              <td className="py-2 px-3 text-cyan-300 font-bold">#{pet.pet_id}</td>
                              <td className="py-2 px-3 font-sans font-bold text-white">{pet.name}</td>
                              <td className="py-2 px-3 text-cyan-400">{pet.species}</td>
                              <td className="py-2 px-3 text-slate-300">{pet.breed}</td>
                              <td className="py-2 px-3 text-slate-200">
                                {owner?.first_name} {owner?.last_name}
                              </td>
                              <td className="py-2 px-3 text-slate-400">{owner?.phone}</td>
                              <td className="py-2 px-3">
                                <span className="text-emerald-400">{pet.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Search Section 2: Appointments by Date Range */}
              <div className="cyber-glass rounded-xl p-5 border border-cyan-500/25">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cyan-500/15">
                  <div>
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      <span>Query 2: Appointments Filtered by Date Range</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Executes: <code className="text-cyan-300 font-mono text-[11px]">SELECT * FROM Appointment WHERE Appointment_Date BETWEEN '{reportDateFrom}' AND '{reportDateTo}'</code>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-slate-400">From:</span>
                    <input
                      type="date"
                      value={reportDateFrom}
                      onChange={e => {
                        setReportDateFrom(e.target.value);
                        logSQL(
                          `SELECT * FROM Appointment WHERE Appointment_Date >= '${e.target.value}' AND Appointment_Date <= '${reportDateTo} 23:59:59';`,
                          { tag: '[FR6_DATE_SEARCH]' }
                        );
                      }}
                      className="cyber-input px-2 py-1 rounded text-xs"
                    />
                    <span className="text-slate-400">To:</span>
                    <input
                      type="date"
                      value={reportDateTo}
                      onChange={e => {
                        setReportDateTo(e.target.value);
                        logSQL(
                          `SELECT * FROM Appointment WHERE Appointment_Date >= '${reportDateFrom}' AND Appointment_Date <= '${e.target.value} 23:59:59';`,
                          { tag: '[FR6_DATE_SEARCH]' }
                        );
                      }}
                      className="cyber-input px-2 py-1 rounded text-xs"
                    />
                  </div>
                </div>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="text-slate-400 border-b border-cyan-500/20 text-[11px]">
                        <th className="py-2 px-3 text-cyan-400">Appt_ID</th>
                        <th className="py-2 px-3">Date & Time</th>
                        <th className="py-2 px-3">Pet</th>
                        <th className="py-2 px-3">Veterinarian</th>
                        <th className="py-2 px-3">Reason</th>
                        <th className="py-2 px-3">Priority</th>
                        <th className="py-2 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cyan-500/10">
                      {reportAppointmentsByDate.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-4 text-center text-slate-500">
                            No appointments found in selected date interval.
                          </td>
                        </tr>
                      ) : (
                        reportAppointmentsByDate.map(appt => {
                          const pet = pets.find(p => p.pet_id === appt.pet_id);
                          const vet = vets.find(v => v.vet_id === appt.vet_id);
                          return (
                            <tr key={appt.appointment_id} className="hover:bg-cyan-950/20">
                              <td className="py-2 px-3 text-cyan-300 font-bold">#{appt.appointment_id}</td>
                              <td className="py-2 px-3 text-white">{appt.appointment_date}</td>
                              <td className="py-2 px-3 text-cyan-300 font-sans font-bold">
                                {pet?.name || `#${appt.pet_id}`}
                              </td>
                              <td className="py-2 px-3 text-slate-300">{vet?.name || `#${appt.vet_id}`}</td>
                              <td className="py-2 px-3 text-slate-400">{appt.reason}</td>
                              <td className="py-2 px-3">
                                <span className="text-amber-400">{appt.priority}</span>
                              </td>
                              <td className="py-2 px-3">
                                <span className="text-emerald-400">{appt.status}</span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Aggregation Reports */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="cyber-glass rounded-xl p-4">
                  <div className="text-[11px] font-mono text-cyan-400 font-bold">SQL AGGREGATION // SPECIES</div>
                  <div className="text-xs text-slate-400 mt-0.5">SELECT Species, COUNT(*) GROUP BY Species</div>
                  <div className="mt-3 space-y-2 font-mono text-xs">
                    {['Canine', 'Feline', 'Avian', 'Reptile', 'Exotic'].map(sp => {
                      const count = pets.filter(p => p.species === sp).length;
                      const pct = pets.length > 0 ? (count / pets.length) * 100 : 0;
                      return (
                        <div key={sp}>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-slate-300">{sp}</span>
                            <span className="text-cyan-400 font-bold">{count} ({pct.toFixed(0)}%)</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                            <div className="h-full bg-cyan-400" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="cyber-glass rounded-xl p-4">
                  <div className="text-[11px] font-mono text-emerald-400 font-bold">SQL REVENUE METRICS (INR)</div>
                  <div className="text-xs text-slate-400 mt-0.5">SELECT SUM(Cost), AVG(Cost) FROM TreatmentRecord</div>
                  <div className="mt-4 space-y-3 font-mono text-xs">
                    <div className="p-3 rounded bg-slate-950/70 border border-emerald-500/20">
                      <span className="text-[10px] text-slate-400 block">TOTAL ACCUMULATED BILLING:</span>
                      <span className="text-lg font-bold text-emerald-400">
                        ₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="p-3 rounded bg-slate-950/70 border border-cyan-500/20">
                      <span className="text-[10px] text-slate-400 block">AVERAGE TREATMENT PROCEDURE:</span>
                      <span className="text-lg font-bold text-cyan-400">
                        ₹{(treatments.length > 0 ? totalRevenue / treatments.length : 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="cyber-glass rounded-xl p-4">
                  <div className="text-[11px] font-mono text-amber-400 font-bold">VET CASELOAD DISTRIBUTION</div>
                  <div className="text-xs text-slate-400 mt-0.5">SELECT Vet_ID, COUNT(*) FROM Appointment GROUP BY Vet_ID</div>
                  <div className="mt-3 space-y-2 font-mono text-xs">
                    {vets.map(v => {
                      const count = appointments.filter(a => a.vet_id === v.vet_id).length;
                      return (
                        <div key={v.vet_id} className="flex justify-between items-center py-1 border-b border-slate-800/60">
                          <span className="truncate max-w-[160px] text-slate-300 font-sans">{v.name}</span>
                          <span className="text-amber-400 font-bold">{count} cases</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* FR7: Schema Inspector, ERD & Live Ad-Hoc SQL Runner */}
          {/* ========================================================= */}
          {activeTab === 'FR7' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="cyber-glass rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold">
                    <span>FR7 // RELATIONAL ARCHITECTURE & INFORMATION_SCHEMA</span>
                  </div>
                  <h1 className="text-xl font-bold text-white tracking-tight mt-0.5">
                    Database Schema Inspector & Relational ERD
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Complete entity relationship definitions, primary/foreign key mappings, and relational integrity constraints.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportSQLDump}
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Full .SQL Script</span>
                  </button>
                </div>
              </div>

              {/* Visual Schema Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Table 1: Owner */}
                <div className="cyber-glass rounded-xl p-4 border border-cyan-500/30">
                  <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
                    <span className="font-mono text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                      <Table className="w-3.5 h-3.5" /> Owner
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">5 columns · {owners.length} rows</span>
                  </div>
                  <ul className="mt-2.5 space-y-1.5 text-xs font-mono">
                    <li className="flex justify-between text-cyan-400 font-bold">
                      <span>🔑 Owner_ID</span>
                      <span className="text-slate-400 font-normal">SERIAL [PK]</span>
                    </li>
                    <li className="flex justify-between text-slate-300">
                      <span>First_Name</span>
                      <span className="text-slate-400">VARCHAR(60) NOT NULL</span>
                    </li>
                    <li className="flex justify-between text-slate-300">
                      <span>Last_Name</span>
                      <span className="text-slate-400">VARCHAR(60) NOT NULL</span>
                    </li>
                    <li className="flex justify-between text-slate-300">
                      <span>Phone</span>
                      <span className="text-slate-400">VARCHAR(30) NOT NULL</span>
                    </li>
                    <li className="flex justify-between text-slate-300">
                      <span>Email</span>
                      <span className="text-slate-400">VARCHAR(120) UNIQUE</span>
                    </li>
                    <li className="flex justify-between text-slate-400">
                      <span>Address / City</span>
                      <span className="text-slate-500">TEXT</span>
                    </li>
                  </ul>
                </div>

                {/* Table 2: Pet */}
                <div className="cyber-glass rounded-xl p-4 border border-cyan-500/30">
                  <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
                    <span className="font-mono text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                      <Table className="w-3.5 h-3.5" /> Pet
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">10 columns · {pets.length} rows</span>
                  </div>
                  <ul className="mt-2.5 space-y-1.5 text-xs font-mono">
                    <li className="flex justify-between text-cyan-400 font-bold">
                      <span>🔑 Pet_ID</span>
                      <span className="text-slate-400 font-normal">SERIAL [PK]</span>
                    </li>
                    <li className="flex justify-between text-slate-300">
                      <span>Name</span>
                      <span className="text-slate-400">VARCHAR(60) NOT NULL</span>
                    </li>
                    <li className="flex justify-between text-slate-300">
                      <span>Species / Breed</span>
                      <span className="text-slate-400">VARCHAR(40)</span>
                    </li>
                    <li className="flex justify-between text-amber-400">
                      <span>🔗 Owner_ID</span>
                      <span className="text-slate-400 font-normal">INT [FK → Owner]</span>
                    </li>
                    <li className="flex justify-between text-slate-300">
                      <span>Microchip_No</span>
                      <span className="text-slate-400">VARCHAR(50) UNIQUE</span>
                    </li>
                    <li className="flex justify-between text-slate-300">
                      <span>Weight_KG</span>
                      <span className="text-slate-400">NUMERIC(5,2)</span>
                    </li>
                  </ul>
                </div>

                {/* Table 3: Veterinarian */}
                <div className="cyber-glass rounded-xl p-4 border border-cyan-500/30">
                  <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
                    <span className="font-mono text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                      <Table className="w-3.5 h-3.5" /> Veterinarian
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">7 columns · {vets.length} rows</span>
                  </div>
                  <ul className="mt-2.5 space-y-1.5 text-xs font-mono">
                    <li className="flex justify-between text-cyan-400 font-bold">
                      <span>🔑 Vet_ID</span>
                      <span className="text-slate-400 font-normal">SERIAL [PK]</span>
                    </li>
                    <li className="flex justify-between text-slate-300">
                      <span>Name</span>
                      <span className="text-slate-400">VARCHAR(100) NOT NULL</span>
                    </li>
                    <li className="flex justify-between text-slate-300">
                      <span>Specialization</span>
                      <span className="text-slate-400">VARCHAR(100)</span>
                    </li>
                    <li className="flex justify-between text-slate-300">
                      <span>License_No</span>
                      <span className="text-slate-400">VARCHAR(50) UNIQUE</span>
                    </li>
                    <li className="flex justify-between text-slate-300">
                      <span>Status</span>
                      <span className="text-slate-400">VARCHAR(30)</span>
                    </li>
                  </ul>
                </div>

                {/* Table 4: Appointment */}
                <div className="cyber-glass rounded-xl p-4 border border-cyan-500/30">
                  <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
                    <span className="font-mono text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                      <Table className="w-3.5 h-3.5" /> Appointment
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">6 columns · {appointments.length} rows</span>
                  </div>
                  <ul className="mt-2.5 space-y-1.5 text-xs font-mono">
                    <li className="flex justify-between text-cyan-400 font-bold">
                      <span>🔑 Appointment_ID</span>
                      <span className="text-slate-400 font-normal">SERIAL [PK]</span>
                    </li>
                    <li className="flex justify-between text-amber-400">
                      <span>🔗 Pet_ID</span>
                      <span className="text-slate-400 font-normal">INT [FK → Pet]</span>
                    </li>
                    <li className="flex justify-between text-amber-400">
                      <span>🔗 Vet_ID</span>
                      <span className="text-slate-400 font-normal">INT [FK → Vet]</span>
                    </li>
                    <li className="flex justify-between text-slate-300">
                      <span>Appointment_Date</span>
                      <span className="text-slate-400">TIMESTAMP NOT NULL</span>
                    </li>
                    <li className="flex justify-between text-slate-300">
                      <span>Priority / Status</span>
                      <span className="text-slate-400">VARCHAR(20)</span>
                    </li>
                  </ul>
                </div>

                {/* Table 5: TreatmentRecord */}
                <div className="cyber-glass rounded-xl p-4 border border-cyan-500/30">
                  <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
                    <span className="font-mono text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                      <Table className="w-3.5 h-3.5" /> TreatmentRecord
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">8 columns · {treatments.length} rows</span>
                  </div>
                  <ul className="mt-2.5 space-y-1.5 text-xs font-mono">
                    <li className="flex justify-between text-cyan-400 font-bold">
                      <span>🔑 Treatment_ID</span>
                      <span className="text-slate-400 font-normal">SERIAL [PK]</span>
                    </li>
                    <li className="flex justify-between text-amber-400">
                      <span>🔗 Pet_ID</span>
                      <span className="text-slate-400 font-normal">INT [FK → Pet]</span>
                    </li>
                    <li className="flex justify-between text-amber-400">
                      <span>🔗 Vet_ID</span>
                      <span className="text-slate-400 font-normal">INT [FK → Vet]</span>
                    </li>
                    <li className="flex justify-between text-slate-300">
                      <span>Diagnosis</span>
                      <span className="text-slate-400">TEXT NOT NULL</span>
                    </li>
                    <li className="flex justify-between text-emerald-400 font-bold">
                      <span>Cost</span>
                      <span className="text-slate-400 font-normal">NUMERIC(10,2)</span>
                    </li>
                  </ul>
                </div>

                {/* Relational Integrity Card */}
                <div className="cyber-glass rounded-xl p-4 border border-emerald-500/30 bg-emerald-950/10 flex flex-col justify-between">
                  <div>
                    <div className="font-mono text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Relational Invariants Verified
                    </div>
                    <p className="text-xs text-slate-300 mt-2">
                      All relational foreign keys are strictly validated:
                    </p>
                    <ul className="mt-2 space-y-1 text-[11px] font-mono text-slate-400">
                      <li>✓ Owner 1:N Pet (CASCADE on delete)</li>
                      <li>✓ Pet 1:N Appointment</li>
                      <li>✓ Veterinarian 1:N Appointment</li>
                      <li>✓ Pet 1:N TreatmentRecord</li>
                      <li>✓ Unique Email and Microchip constraints</li>
                    </ul>
                  </div>

                  <div className="mt-4 pt-3 border-t border-emerald-500/20 text-[10px] font-mono text-emerald-300/80">
                    TRANSACTION ISOLATION: READ COMMITTED
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* Bottom Fixed Panel: "Live SQL Terminal / Query Inspector" */}
      {/* ========================================================================= */}
      <footer
        className={`fixed bottom-0 left-0 right-0 z-40 bg-[#050813]/95 backdrop-blur-md border-t border-cyan-500/30 shadow-[0_-4px_25px_rgba(0,0,0,0.8)] transition-all duration-200 flex flex-col ${
          terminalExpanded ? 'h-72' : 'h-10'
        }`}
      >
        {/* Terminal Header Bar */}
        <div className="h-10 px-4 bg-slate-950/90 border-b border-cyan-500/20 flex items-center justify-between shrink-0 font-mono text-xs select-none">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f0ff]" />
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-bold text-white tracking-wide">
                LIVE SQL TERMINAL <span className="text-cyan-400">/ QUERY INSPECTOR</span>
              </span>
            </div>
            <span className="hidden sm:inline text-[11px] px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
              {sqlLogs.length} QUERIES LOGGED
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Presets Dropdown */}
            <select
              onChange={e => {
                if (e.target.value) {
                  setAdHocQuery(e.target.value);
                  setTimeout(() => executeAdHocSQL(), 50);
                }
              }}
              className="hidden md:block cyber-input text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300"
              defaultValue=""
            >
              <option value="" disabled>
                Select Preset SQL Query...
              </option>
              <option value="SELECT * FROM Pet JOIN Owner ON Pet.Owner_ID = Owner.Owner_ID;">
                SELECT * FROM Pet JOIN Owner...
              </option>
              <option value="SELECT * FROM Owner ORDER BY Owner_ID ASC;">SELECT * FROM Owner...</option>
              <option value="SELECT * FROM Veterinarian WHERE Status = 'On Duty';">
                SELECT * FROM Veterinarian WHERE Status='On Duty'...
              </option>
              <option value="SELECT * FROM Appointment ORDER BY Appointment_Date DESC;">
                SELECT * FROM Appointment...
              </option>
              <option value="SELECT * FROM TreatmentRecord ORDER BY Cost DESC;">
                SELECT * FROM TreatmentRecord...
              </option>
            </select>

            <button
              onClick={() => {
                if (sqlLogs.length > 0) {
                  handleCopyQuery('last', sqlLogs[0].query);
                }
              }}
              title="Copy the most recent SQL statement"
              className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              <span className="hidden sm:inline">
                {copiedQueryId === 'last' ? 'Copied!' : 'Copy Last Query'}
              </span>
            </button>

            <button
              onClick={() => setSqlLogs([])}
              title="Clear terminal buffer"
              className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-rose-400 text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span className="hidden sm:inline">Clear</span>
            </button>

            <button
              onClick={() => setTerminalExpanded(!terminalExpanded)}
              title={terminalExpanded ? 'Minimize Terminal' : 'Expand Terminal'}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {terminalExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Terminal Body (Active when expanded) */}
        {terminalExpanded && (
          <div className="flex-1 flex flex-col overflow-hidden bg-[#03060f]">
            {/* Ad-Hoc Interactive SQL Query Bar */}
            <form
              onSubmit={executeAdHocSQL}
              className="px-3 py-1.5 bg-slate-950 border-b border-cyan-500/20 flex items-center gap-2 shrink-0 font-mono text-xs"
            >
              <div className="text-cyan-400 font-bold flex items-center gap-1 shrink-0">
                <span>sql&gt;</span>
              </div>
              <input
                type="text"
                placeholder="Type interactive SQL query (e.g. SELECT * FROM Pet JOIN Owner ON Pet.Owner_ID = Owner.Owner_ID;)..."
                value={adHocQuery}
                onChange={e => setAdHocQuery(e.target.value)}
                className="flex-1 bg-transparent text-cyan-200 placeholder:text-slate-600 focus:outline-none font-mono text-xs"
              />
              <button
                type="submit"
                className="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer shrink-0"
              >
                <Play className="w-3 h-3" />
                <span>Execute [Enter]</span>
              </button>
            </form>

            {/* Scrollable Live SQL Output Stream */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 font-mono text-xs">
              {sqlLogs.length === 0 ? (
                <div className="text-slate-600 text-xs py-4 text-center">
                  Terminal ready. Awaiting UI interactions or SQL commands...
                </div>
              ) : (
                sqlLogs.map(log => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded bg-slate-950/80 border border-cyan-500/15 hover:border-cyan-400/30 transition-colors flex flex-col gap-1.5 group"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1 border-b border-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400 font-bold">{log.tag}</span>
                        <span className="text-slate-500">{log.timestamp}</span>
                        <span className="px-1.5 py-0.2 rounded bg-slate-900 text-cyan-300 text-[10px] border border-slate-800">
                          {log.latencyMs}ms
                        </span>
                        <span className="text-slate-500">
                          ({log.affectedRows} {log.affectedRows === 1 ? 'row' : 'rows'})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100">
                        <button
                          onClick={() => handleCopyQuery(log.id, log.query)}
                          className="hover:text-cyan-300 text-slate-400 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          {copiedQueryId === log.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400 text-[10px]">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span className="text-[10px]">Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <pre
                      className="text-slate-200 whitespace-pre-wrap leading-relaxed text-xs font-mono"
                      dangerouslySetInnerHTML={{ __html: highlightSQL(log.query) }}
                    />
                  </div>
                ))
              )}
              <div ref={terminalEndRef} />
            </div>
          </div>
        )}
      </footer>

      {/* ========================================================================= */}
      {/* Interactive Ad-Hoc SQL Result Modal / Drawer */}
      {/* ========================================================================= */}
      {adHocResult && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="cyber-glass rounded-xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-cyan-400/40 shadow-[0_0_40px_rgba(0,240,255,0.2)]">
            <div className="px-4 py-3 bg-slate-950 border-b border-cyan-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white text-xs font-mono">
                  AD-HOC SQL QUERY RESULT // ({adHocResult.rows.length} rows returned)
                </span>
              </div>
              <button
                onClick={() => setAdHocResult(null)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-950/60 border-b border-cyan-500/20 text-xs font-mono text-cyan-300 overflow-x-auto">
              <code>{adHocResult.query}</code>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-cyan-500/20 text-slate-400 text-[11px]">
                    {adHocResult.columns.map(col => (
                      <th key={col} className="py-2 px-3 text-cyan-400 font-bold">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-500/10">
                  {adHocResult.rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-cyan-950/20">
                      {adHocResult.columns.map(col => (
                        <td key={col} className="py-2 px-3 text-slate-200">
                          {String(row[col] ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-2.5 bg-slate-950 border-t border-cyan-500/20 flex justify-end">
              <button
                onClick={() => setAdHocResult(null)}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Modal: FR1 Add Owner Form */}
      {/* ========================================================================= */}
      {showAddOwnerModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="cyber-glass rounded-xl max-w-lg w-full overflow-hidden border border-cyan-400/40">
            <div className="px-5 py-3.5 bg-slate-950 border-b border-cyan-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">FR1: Register New Owner</h3>
              </div>
              <button
                onClick={() => setShowAddOwnerModal(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddOwner} className="p-5 space-y-3.5 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">First Name *</label>
                  <input
                    name="first_name"
                    required
                    placeholder="e.g. Rajesh"
                    className="cyber-input w-full px-3 py-1.5 rounded"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Last Name *</label>
                  <input
                    name="last_name"
                    required
                    placeholder="e.g. Sharma"
                    className="cyber-input w-full px-3 py-1.5 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Phone Number *</label>
                  <input
                    name="phone"
                    required
                    placeholder="+91 98201 44521"
                    className="cyber-input w-full px-3 py-1.5 rounded"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="rajesh.sharma@gmail.com"
                    className="cyber-input w-full px-3 py-1.5 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Residential Street Address</label>
                <input
                  name="address"
                  placeholder="e.g. Flat 402, Sea Breeze Apts, Bandra West"
                  className="cyber-input w-full px-3 py-1.5 rounded"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">City / District</label>
                <input
                  name="city"
                  defaultValue="Mumbai, Maharashtra"
                  className="cyber-input w-full px-3 py-1.5 rounded"
                />
              </div>

              <div className="pt-3 border-t border-cyan-500/20 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddOwnerModal(false)}
                  className="px-3.5 py-1.5 rounded bg-slate-900 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                >
                  INSERT INTO Owner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Modal: FR1 Edit Owner Contact Info */}
      {/* ========================================================================= */}
      {editingOwner && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="cyber-glass rounded-xl max-w-lg w-full overflow-hidden border border-cyan-400/40">
            <div className="px-5 py-3.5 bg-slate-950 border-b border-cyan-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">Update Owner #{editingOwner.owner_id}</h3>
              </div>
              <button
                onClick={() => setEditingOwner(null)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateOwner} className="p-5 space-y-3.5 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">First Name</label>
                  <input
                    name="first_name"
                    defaultValue={editingOwner.first_name}
                    required
                    className="cyber-input w-full px-3 py-1.5 rounded"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Last Name</label>
                  <input
                    name="last_name"
                    defaultValue={editingOwner.last_name}
                    required
                    className="cyber-input w-full px-3 py-1.5 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Phone Number</label>
                  <input
                    name="phone"
                    defaultValue={editingOwner.phone}
                    required
                    className="cyber-input w-full px-3 py-1.5 rounded"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editingOwner.email}
                    required
                    className="cyber-input w-full px-3 py-1.5 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Address</label>
                <input
                  name="address"
                  defaultValue={editingOwner.address}
                  className="cyber-input w-full px-3 py-1.5 rounded"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">City</label>
                <input
                  name="city"
                  defaultValue={editingOwner.city}
                  className="cyber-input w-full px-3 py-1.5 rounded"
                />
              </div>

              <div className="pt-3 border-t border-cyan-500/20 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingOwner(null)}
                  className="px-3.5 py-1.5 rounded bg-slate-900 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  UPDATE Owner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Modal: FR2 Add Pet Registration Form */}
      {/* ========================================================================= */}
      {showAddPetModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="cyber-glass rounded-xl max-w-lg w-full overflow-hidden border border-cyan-400/40">
            <div className="px-5 py-3.5 bg-slate-950 border-b border-cyan-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">FR2: Register New Pet Patient</h3>
              </div>
              <button
                onClick={() => setShowAddPetModal(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPet} className="p-5 space-y-3.5 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Pet Name *</label>
                  <input
                    name="name"
                    required
                    placeholder="e.g. Sheru"
                    className="cyber-input w-full px-3 py-1.5 rounded"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Species *</label>
                  <select name="species" className="cyber-input w-full px-3 py-1.5 rounded">
                    <option value="Canine">Canine</option>
                    <option value="Feline">Feline</option>
                    <option value="Avian">Avian</option>
                    <option value="Reptile">Reptile</option>
                    <option value="Exotic">Exotic</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Breed / Cyber Model</label>
                  <input
                    name="breed"
                    placeholder="e.g. Desi Indie Hound"
                    defaultValue="Desi Indie Hound (Cyber-Augmented)"
                    className="cyber-input w-full px-3 py-1.5 rounded"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    defaultValue="2023-01-01"
                    required
                    className="cyber-input w-full px-3 py-1.5 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Select Registered Owner (Foreign Key) *</label>
                <select name="owner_id" required className="cyber-input w-full px-3 py-1.5 rounded">
                  {owners.map(o => (
                    <option key={o.owner_id} value={o.owner_id}>
                      #{o.owner_id} - {o.first_name} {o.last_name} ({o.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Weight (KG)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="weight_kg"
                    defaultValue="12.5"
                    className="cyber-input w-full px-3 py-1.5 rounded"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Gender</label>
                  <select name="gender" className="cyber-input w-full px-3 py-1.5 rounded">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Clinical Status</label>
                  <select name="status" className="cyber-input w-full px-3 py-1.5 rounded">
                    <option value="Healthy">Healthy</option>
                    <option value="In Treatment">In Treatment</option>
                    <option value="Critical">Critical</option>
                    <option value="Post-Op">Post-Op</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input type="checkbox" id="neutered" name="neutered" defaultChecked className="accent-cyan-400" />
                <label htmlFor="neutered" className="text-slate-300">
                  Patient is Neutered / Desexed
                </label>
              </div>

              <div className="pt-3 border-t border-cyan-500/20 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPetModal(false)}
                  className="px-3.5 py-1.5 rounded bg-slate-900 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                >
                  INSERT INTO Pet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Modal: FR3 Add Veterinarian Form */}
      {/* ========================================================================= */}
      {showAddVetModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="cyber-glass rounded-xl max-w-lg w-full overflow-hidden border border-cyan-400/40">
            <div className="px-5 py-3.5 bg-slate-950 border-b border-cyan-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">FR3: Register Attending Veterinarian</h3>
              </div>
              <button
                onClick={() => setShowAddVetModal(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddVet} className="p-5 space-y-3.5 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Doctor Full Name & Title *</label>
                <input
                  name="name"
                  required
                  placeholder="e.g. Dr. Arvind Swaminathan, BVSc & AH, MVSc"
                  className="cyber-input w-full px-3 py-1.5 rounded"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Specialization Area</label>
                <input
                  name="specialization"
                  required
                  placeholder="e.g. Cyber-Surgical & Orthopedic Reconstruction"
                  className="cyber-input w-full px-3 py-1.5 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">License Number *</label>
                  <input
                    name="license_no"
                    required
                    placeholder="VCI-MH-2024-8421"
                    className="cyber-input w-full px-3 py-1.5 rounded"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Phone Contact</label>
                  <input
                    name="phone"
                    placeholder="+91 (022) 2640-0112"
                    className="cyber-input w-full px-3 py-1.5 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Duty Shift</label>
                  <select name="shift" className="cyber-input w-full px-3 py-1.5 rounded">
                    <option value="Morning 08:30 - 16:30">Morning 08:30 - 16:30</option>
                    <option value="Afternoon 14:00 - 22:00">Afternoon 14:00 - 22:00</option>
                    <option value="Night Surveillance 22:00 - 06:00">Night Surveillance 22:00 - 06:00</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Clinical Bay / Room</label>
                  <input
                    name="room_no"
                    defaultValue="OT-Alpha 1 (Bandra)"
                    className="cyber-input w-full px-3 py-1.5 rounded"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-cyan-500/20 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddVetModal(false)}
                  className="px-3.5 py-1.5 rounded bg-slate-900 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  INSERT INTO Veterinarian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Modal: FR4 Book Appointment Form */}
      {/* ========================================================================= */}
      {showAddApptModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="cyber-glass rounded-xl max-w-lg w-full overflow-hidden border border-cyan-400/40">
            <div className="px-5 py-3.5 bg-slate-950 border-b border-cyan-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">FR4: Schedule Clinic Appointment</h3>
              </div>
              <button
                onClick={() => setShowAddApptModal(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAppointment} className="p-5 space-y-3.5 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Select Patient Pet (Foreign Key) *</label>
                <select name="pet_id" required className="cyber-input w-full px-3 py-1.5 rounded">
                  {pets.map(p => {
                    const owner = owners.find(o => o.owner_id === p.owner_id);
                    return (
                      <option key={p.pet_id} value={p.pet_id}>
                        #{p.pet_id} - {p.name} ({p.species}) · Owner: {owner ? owner.last_name : 'N/A'}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Select Attending Veterinarian (Foreign Key) *</label>
                <select name="vet_id" required className="cyber-input w-full px-3 py-1.5 rounded">
                  {vets.map(v => (
                    <option key={v.vet_id} value={v.vet_id}>
                      #{v.vet_id} - {v.name} ({v.specialization}) - [{v.status}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Date *</label>
                  <input
                    type="date"
                    name="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    required
                    className="cyber-input w-full px-3 py-1.5 rounded"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Time Slot *</label>
                  <input
                    type="time"
                    name="time"
                    defaultValue="10:00"
                    required
                    className="cyber-input w-full px-3 py-1.5 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Chief Medical Complaint / Reason *</label>
                <textarea
                  name="reason"
                  rows={2}
                  required
                  placeholder="e.g. Annual titanium joint calibration & monsoon skin check"
                  className="cyber-input w-full px-3 py-1.5 rounded"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Priority Triage Level</label>
                <select name="priority" className="cyber-input w-full px-3 py-1.5 rounded">
                  <option value="Routine">Routine Wellness</option>
                  <option value="Urgent">Urgent Intervention</option>
                  <option value="Emergency">Emergency Critical</option>
                </select>
              </div>

              <div className="pt-3 border-t border-cyan-500/20 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddApptModal(false)}
                  className="px-3.5 py-1.5 rounded bg-slate-900 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  INSERT INTO Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Modal: FR5 Record Treatment Form */}
      {/* ========================================================================= */}
      {showAddTreatmentModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="cyber-glass rounded-xl max-w-lg w-full overflow-hidden border border-cyan-400/40">
            <div className="px-5 py-3.5 bg-slate-950 border-b border-cyan-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">FR5: Record Patient Treatment & Billing</h3>
              </div>
              <button
                onClick={() => setShowAddTreatmentModal(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTreatment} className="p-5 space-y-3.5 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Select Patient *</label>
                  <select name="pet_id" required className="cyber-input w-full px-3 py-1.5 rounded">
                    {pets.map(p => (
                      <option key={p.pet_id} value={p.pet_id}>
                        #{p.pet_id} - {p.name} ({p.species})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Attending Vet *</label>
                  <select name="vet_id" required className="cyber-input w-full px-3 py-1.5 rounded">
                    {vets.map(v => (
                      <option key={v.vet_id} value={v.vet_id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Clinical Diagnosis *</label>
                <input
                  name="diagnosis"
                  required
                  placeholder="e.g. Tendon Strain & Hydraulic Paw Wear"
                  className="cyber-input w-full px-3 py-1.5 rounded"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Procedure Notes / Operative Details</label>
                <textarea
                  name="procedure_notes"
                  rows={2}
                  placeholder="Details of ultrasonic therapy, laser joint healing, herbal nanogel application..."
                  className="cyber-input w-full px-3 py-1.5 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Prescriptions / Drugs</label>
                  <input
                    name="prescriptions"
                    placeholder="e.g. Himalaya Fur-Glow + NanoDerm Spray"
                    className="cyber-input w-full px-3 py-1.5 rounded"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Total Fee / Cost (INR - ₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="cost"
                    required
                    placeholder="2500.00"
                    defaultValue="1850.00"
                    className="cyber-input w-full px-3 py-1.5 rounded text-emerald-400 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Treatment Date</label>
                <input
                  type="date"
                  name="treatment_date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="cyber-input w-full px-3 py-1.5 rounded"
                />
              </div>

              <div className="pt-3 border-t border-cyan-500/20 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTreatmentModal(false)}
                  className="px-3.5 py-1.5 rounded bg-slate-900 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                >
                  INSERT INTO TreatmentRecord
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
