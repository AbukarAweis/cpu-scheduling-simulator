# CPU Scheduling Simulator

An interactive CPU scheduling simulator built with JavaScript, HTML, and CSS. The application visualizes how processes move through the waiting queue, CPU, and finished queue while simulating First Come First Serve (FCFS), Shortest Job First (SJF), and Round Robin (RR) scheduling algorithms.

The simulator supports custom process creation, randomly generated processes, real-time execution controls, input validation, and performance metrics including waiting time, turnaround time, throughput, and CPU utilization.

> This is an independently developed personal project. All application code, scheduling logic, interface behavior, and visual design were implemented by me.

## Features

- Simulates **First Come First Serve (FCFS)**, **Shortest Job First (SJF)**, and **Round Robin (RR)** scheduling
- Supports manual process entry with process ID, arrival time, and burst time
- Can automatically generate a set of random processes
- Visualizes processes moving through the waiting queue, CPU, and finished queue in real time
- Includes start, pause, resume, and reset controls
- Validates process input and Round Robin time quantum values
- Displays a live event log during simulation
- Calculates and displays:
  - completion time
  - waiting time
  - turnaround time
  - throughput
  - CPU utilization
- Displays simulation progress and a completed-process summary table