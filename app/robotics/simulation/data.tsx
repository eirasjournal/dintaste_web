// ⚠️ FĂRĂ "use client"
// ⚠️ FĂRĂ import PalletizerSandbox

export const SIMULATIONS = [
  {
    id: 'palletizer-v1',
    slug: 'palletizer', // ⚠️ Acest slug va fi folosit în URL
    title: "Palletizing Logic Sandbox",
    version: "v2.4.0 (Stable)",
    preview: "A programmable environment for testing industrial stacking algorithms. Input your variables, defining grid logic...",
    // component: <PalletizerSandbox />  <-- STERGE ASTA
  },

  {
    id: 'directkinematics-v1',
    slug: 'directkinematics', // ⚠️ Acest slug va fi folosit în URL
    title: "Direct Kinematics",
    version: "v1.0.0 (Beta)",
    preview: "Simulation for visualizing direct kinematics of robotic arms. Input joint angles and observe end-effector position in 3D space.",
  }
];