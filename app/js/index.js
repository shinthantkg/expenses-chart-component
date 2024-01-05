const balanceElement = document.querySelector(".balance__amount");
const monthTotalElement = document.querySelector(".spendings__amount--month");
const lastMonthElement = document.querySelector(".spendings__amount--last-month");

const amountElements = Array.from(document.querySelectorAll(".spendings__amount--daily"));
const barElements = Array.from(document.querySelectorAll(".spendings__bar"));
const maxBarHeight = 9.5;
const highestBarColor = "hsl(186, 34%, 60%)";

function renderSpendings(path) {
    fetch(path)
        .then((response) => response.json())
        .then((data) => {
            const dailyData = data.dailyAmounts;
            const days = Object.keys(dailyData);
            const amounts = Object.values(dailyData);

            balanceElement.textContent = `$${data["balance"]}`;
            monthTotalElement.textContent = `$${data["month"]}`;
            lastMonthElement.textContent = data["difference"];

            amountElements.forEach((element, index) => {
                element.textContent = `$${amounts[index]}`;
            });

            amounts.sort((a, b) => b - a);

            const highestWeekAmount = amounts[0];
            console.log(amounts);

            barElements.forEach((element) => {
                let barDay = element.classList[1].slice(16); // Extract the day from the class name (16 is the starting index)
                let barAmount = dailyData[barDay];

                if (barAmount === highestWeekAmount) {
                    element.style.backgroundColor = highestBarColor;
                    element.style.height = `${maxBarHeight}em`;
                } else {
                    let barPercentage = barAmount / highestWeekAmount;
                    let barHeight = maxBarHeight * barPercentage;
                    element.style.height = `${barHeight}em`;
                }
            })
        })
        .catch((error) => console.error(`Error: ${error}.`));
}

function handleHover(event) {
    const element = event.target;

    if (element.classList.contains("spendings__bar") || element.closest(".spendings__bar")) {
        let dailyAmountElement = element.parentNode.parentNode.querySelector(".spendings__amount--daily");

        if (dailyAmountElement) {
            if (event.type === "mouseover") {
                dailyAmountElement.classList.remove("hidden");
            } else if (event.type === "mouseout") {
                dailyAmountElement.classList.add("hidden");
            }
        }
    }
}

renderSpendings("../app/data.json");

document.addEventListener("mouseover", (event) => handleHover(event));
document.addEventListener("mouseout", (event) => handleHover(event));
