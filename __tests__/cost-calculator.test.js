/**
 * Cost calculator logic tests (Task 6.1)
 */

const RATE = 31;

function calculateCosts({ weeklyFee, weeks, cityGuide }) {
  const tuition = weeklyFee * weeks;

  const hasLivingCost =
    cityGuide &&
    (cityGuide.weekly_food_usd ||
      cityGuide.weekly_transport_usd ||
      cityGuide.weekly_misc_usd);

  const livingCostWeekly = hasLivingCost
    ? (cityGuide.weekly_food_usd || 0) +
      (cityGuide.weekly_transport_usd || 0) +
      (cityGuide.weekly_misc_usd || 0)
    : 0;

  const livingCost = livingCostWeekly * weeks;

  const flightTwdMin = cityGuide?.flight_twd_min || 4000;
  const flightTwdMax = cityGuide?.flight_twd_max || 8000;
  const flightTwdAvg = Math.round((flightTwdMin + flightTwdMax) / 2);
  const flightUsd = Math.round(flightTwdAvg / RATE);

  const total = tuition + (hasLivingCost ? livingCost : 0) + flightUsd;

  return { tuition, livingCost, hasLivingCost, flightUsd, total };
}

function usdToTwd(usd) {
  return Math.round(usd * RATE);
}

describe("Cost calculator logic", () => {
  const cebuGuide = {
    weekly_food_usd: 40,
    weekly_transport_usd: 10,
    weekly_misc_usd: 15,
    flight_twd_min: 4000,
    flight_twd_max: 8000,
  };

  test("basic calculation with city guide", () => {
    const result = calculateCosts({
      weeklyFee: 220,
      weeks: 4,
      cityGuide: cebuGuide,
    });

    expect(result.tuition).toBe(880); // 220 * 4
    expect(result.livingCost).toBe(260); // (40+10+15) * 4
    expect(result.hasLivingCost).toBeTruthy();
    expect(result.flightUsd).toBe(Math.round(6000 / 31)); // avg of 4000-8000 / 31
    expect(result.total).toBe(880 + 260 + result.flightUsd);
  });

  test("no city guide — living cost N/A", () => {
    const result = calculateCosts({
      weeklyFee: 300,
      weeks: 8,
      cityGuide: null,
    });

    expect(result.tuition).toBe(2400);
    expect(result.hasLivingCost).toBeFalsy();
    expect(result.livingCost).toBe(0);
    // Total should not include living cost
    expect(result.total).toBe(2400 + result.flightUsd);
  });

  test("USD to TWD conversion", () => {
    expect(usdToTwd(100)).toBe(3100);
    expect(usdToTwd(0)).toBe(0);
    expect(usdToTwd(220)).toBe(6820);
  });

  test("weeks boundary values", () => {
    const min = calculateCosts({
      weeklyFee: 250,
      weeks: 1,
      cityGuide: cebuGuide,
    });
    expect(min.tuition).toBe(250);

    const max = calculateCosts({
      weeklyFee: 250,
      weeks: 24,
      cityGuide: cebuGuide,
    });
    expect(max.tuition).toBe(6000);
  });
});
