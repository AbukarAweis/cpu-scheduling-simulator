// Simulation state
var algorithm;
var running = false;

var wQueue = [];
var fQueue = [];
var cpu = [];

var timerInterval;
var seconds = 0;
var numOfProcesses = 0;

var randomColor;
var burstCopy;
var exitTime;

// Used to calculate throughput
var maxET = Number.MIN_SAFE_INTEGER;
var minAT = Number.MAX_SAFE_INTEGER;

// Used to calculate turnaround time, wait time, and CPU utilization
var totalTAT = 0;
var totalWT = 0;
var totalNIT = 0;

var availableID = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

percentage = 0;

// SJF state
var temp = [];

// Round Robin state
var currentTime = 0;