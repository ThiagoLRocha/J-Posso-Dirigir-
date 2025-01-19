function calculateBAC() {
    // Get user inputs
    const weight = parseFloat(document.getElementById("weight").value);
    const drinks = parseInt(document.getElementById("drinks").value);
    const volume = parseFloat(document.getElementById("volume").value);
    const alcohol = parseFloat(document.getElementById("alcohol").value);

    // Constants
    const alcoholDensity = 0.789; // g/mL
    const bodyWaterConstant = 0.58; // for men (0.49 for women)
    const metabolismRate = 0.015; // BAC decrease per hour

    // Calculate total alcohol consumed (in grams)
    const totalAlcohol = drinks * volume * (alcohol / 100) * alcoholDensity;

    // Calculate the peak BAC
    const bacPeak = (totalAlcohol / (weight * bodyWaterConstant)) * 100;

    // Time intervals (12 hours)
    const timeIntervals = Array.from({ length: 12 }, (_, i) => i); // 0 to 11 hours
    const bacLevels = timeIntervals.map((time) => {
        const currentBAC = bacPeak - metabolismRate * time; // Decrease over time
        return Math.max(currentBAC, 0); // BAC can't go below 0
    });

    // Update the graph
    updateGraph(timeIntervals, bacLevels);

    // Check if the person can drive at the initial BAC level
    const resultText = bacLevels[0] < 0.06
        ? "Você está apto a dirigir."
        : "Você não deve dirigir.";
    document.getElementById("result").innerText = resultText;
}

function updateGraph(time, bacLevels) {
    const ctx = document.getElementById("bacChart").getContext("2d");
    new Chart(ctx, {
        type: "line",
        data: {
            labels: time.map((t) => `${t}h`), // Time labels
            datasets: [{
                label: "Teor Alcoólico no Sangue (BAC)",
                data: bacLevels, // BAC levels
                borderColor: "blue",
                fill: false,
            }],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: "BAC (%)" },
                },
                x: {
                    title: { display: true, text: "Tempo (horas)" },
                },
            },
        },
    });
}
