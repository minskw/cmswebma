/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import MockDb from '../database/mockDb';

export interface CmsNotification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  unread: boolean;
  category: 'settings' | 'ppdb' | 'security' | 'database' | 'general';
}

// Dispatches an event that CmsAdmin.tsx can catch to update global notifications in real-time
export function triggerGlobalNotification(
  message: string, 
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
  category: 'settings' | 'ppdb' | 'security' | 'database' | 'general' = 'general'
) {
  const event = new CustomEvent('cms-global-notification', {
    detail: { message, type, category }
  });
  window.dispatchEvent(event);
}

// Simulated automated PPDB applicant generator
const studentNames = [
  "Rizky Aditya Pratama",
  "Naila Zahra Salsabila",
  "Muhammad Fauzan Kamil",
  "Aisya Putri Rahmadani",
  "Zidan Al-Farabi",
  "Syifa Nur Azizah",
  "Fadhil Ar-Rayyan",
  "Khaira Wilda Najla"
];

const parentNames = [
  "Bambang Setiawan",
  "Sri Wahyuni",
  "Hendrik Susanto",
  "Siti Aminah",
  "Ahmad Fauzi",
  "Rina Herawati",
  "Yusuf Bahtiar"
];

const pathsOfReg = ["Zonasi", "Afiliasi", "Prestasi Akademik", "Perpindahan Orang Tua"];

export function generateRandomMockPPDBApplicant() {
  const chosenStudent = studentNames[Math.floor(Math.random() * studentNames.length)];
  const chosenParent = parentNames[Math.floor(Math.random() * parentNames.length)];
  const chosenPath = pathsOfReg[Math.floor(Math.random() * pathsOfReg.length)];
  const randomNik = "6172" + Math.floor(100000000000 + Math.random() * 900000000000);
  const randomPonsel = "0812" + Math.floor(10000000 + Math.random() * 90000000);

  // Conform exactly to PPDBApplicant model
  const applicant = {
    id: "ppdb-" + Math.random().toString(36).substring(2, 9),
    student_name: chosenStudent,
    nik: randomNik,
    gender: (Math.random() > 0.5 ? "Laki-laki" : "Perempuan") as 'Laki-laki' | 'Perempuan',
    pob: "Singkawang",
    dob: "2019-05-14",
    father_name: chosenParent,
    phone_number: randomPonsel,
    address: "Jl. Ali Anyang No. 4, Singkawang Barat, Kota Singkawang",
    previous_school: "TK Fastabiqul Khairat Singkawang",
    status: 'submitted' as const,
    created_at: new Date().toISOString()
  };

  // Safe Insertion to DB to persist data
  MockDb.saveApplicant(applicant);
  
  // Dispatch beautiful notification alert
  triggerGlobalNotification(
    `📝 PPDB Baru Masuk: Pendaftaran ananda '${chosenStudent}' (${chosenPath}) berhasil diterima.`, 
    'info', 
    'ppdb'
  );

  return applicant;
}
