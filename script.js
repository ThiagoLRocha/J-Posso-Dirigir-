function calculateBAC() {
    // Obter os dados inseridos
    const weight = parseFloat(document.getElementById("weight").value);
    const drinks = parseInt(document.getElementById("drinks").value);
    const volume = parseFloat(document.getElementById("volume").value);
    const alcohol = parseFloat(document.getElementById("alcohol").value);

    // Constantes
    const alcoholDensity = 0.789; // g/mL
    const bodyWaterConstant = 0.58; // para homens (0.49 para mulheres, se necessário)
    const metabolismRate = 0.015; // Redução de BAC por hora

    // Álcool total consumido em gramas
    const totalAlcohol = drinks * volume * (alcohol / 100) * alcoholDensity;

    // Cálculo do BAC
    const bacPeak = (totalAlcohol / (weight * bodyWaterConstant)) * 100;
    const timeIntervals = Array.from({ length: 12 }, (_, i) => i); // 12 horas
    const bacLevels = timeIntervals.map(
        (time) => Math.max(bacPeak - metabolismRate * time, 0)
    );

    // Atualizar o gráfico
    updateGraph(timeIntervals, bacLevels);

    // Verificar se a pessoa pode dirigir
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
            labels: time.map((t) => `${t}h`),
            datasets: [{
                label: "Teor Alcoólico no Sangue (BAC)",
                data: bacLevels,
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
