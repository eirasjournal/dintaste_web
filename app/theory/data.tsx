"use client";

import React from 'react';
import NotebookTheory from '../components/NotebookTheory'; // Asigură-te că calea e corectă

export const THEORY_ARTICLES = [
  {
    id: 1,
    slug: "pallet-position-calculation", // <--- Asta va fi în URL: /theory/pallet-position-calculation
    title: "Pallet Position Calculation",
    date: "Core Module 1.1",
    preview: "In industrial robotics, palletizing means computing the exact position of every single object using math.",
    component: <NotebookTheory />, // Aici injectăm componenta importată
    hasSimulationLink: true
  },
  {
    id: 2,
    slug: "coordinate-systems", // <--- Asta va fi în URL: /theory/coordinate-systems
    title: "Understanding Coordinate Systems",
    date: "Core Module 1.0",
    preview: "Before a robot moves, it must know where 'here' and 'there' are. A look into World vs Tool coordinates.",
    // Pentru text simplu, folosim un string lung:
    content: `In industrial robotics, the concept of "position" is meaningless without a reference frame. A point defined as (10, 20, 30) implies a distance from an Origin (0,0,0).

When we program the palletizer, we are essentially dealing with two main coordinate systems:

1. World Coordinates: Fixed to the floor or the base of the robot. This is absolute.

2. Tool Coordinates (TCP): Fixed to the gripper. This moves with the robot.

The math we visualize in the "Simulation" tab effectively translates the linear index of a box (Box #1, Box #2) into a vector in the World Coordinate system.`
  }
];