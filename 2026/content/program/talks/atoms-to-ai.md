---
title: 'Atoms to AI: Building a Quantum Capacitor Surrogate with Python and GNNs'
page_type: talk
code: 7NYENB
duration: 30
type: 30 Minute Talk
qna: true
qna_channel: Atoms to AI
speakers:
  - name: Terry Howald
    slug: terry-howald
    code: LZEZSB
    avatar: /2026/img/speakers/terry-howald.webp
start: '2026-07-25T15:00:00-04:00'
end: '2026-07-25T15:30:00-04:00'
room: Ballroom B
slot_label: Saturday at 3:00 PM
og_image: https://www.pyohio.org/2026/img/og/talks/atoms-to-ai.png
---

How can an independent researcher explore the future of energy storage without access to an expensive physical lab? We turn to Python. This session explores the development of a Graph Neural Network (GNN) surrogate model designed to predict the **Quantum Capacitance** of 2D material heterostructures—specifically a "sandwich" of Graphene and hexagonal Boron Nitride (h-BN).

By utilizing open-source libraries and public datasets, we walk through a complete end-to-end pipeline to simulate "virtual experiments":

* **Data Ingestion:** Using `pymatgen` to pull high-fidelity atomic structures from the Materials Project database.
* **Geometric Assembly:** Leveraging `ASE` (Atomic Simulation Environment) to programmatically construct 2-2-2 layered stacks and modulate interlayer distances at the angstrom scale.
* **The Model:** Building a PyTorch-based GNN that learns the relationship between 3D atomic coordinates and predicted capacitance.
* **The Result:** Developing a surrogate model that provides immediate feedback on design variations—mapping 3D coordinates to target values—without the need for physical trial and error.

Attendees will leave with a practical look at how Python empowers researchers to build their own "virtual labs," bridging the gap between material science and machine learning for rapid iteration in solid-state device design.
