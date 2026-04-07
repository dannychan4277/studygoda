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
  const nyGuide = {
    weekly_food_usd: 120,
    weekly_transport_usd: 35,
    weekly_misc_usd: 50,
    flight_twd_min: 25000,
    flight_twd_max: 40000,
  };

  test("basic calculation with city guide", () => {
    const result = calculateCosts({
      weeklyFee: 220,
      weeks: 4,
      cityGuide: nyGuide,
    });

    expect(result.tuition).toBe(880); // 220 * 4
    expect(result.livingCost).toBe(820); // (120+35+50) * 4
    expect(result.hasLivingCost).toBeTruthy();
    expect(result.flightUsd).toBe(Math.round(32500 / 31)); // avg of 25000-40000 / 31
    expect(result.total).toBe(880 + 820 + result.flightUsd);
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
      cityGuide: nyGuide,
    });
    expect(min.tuition).toBe(250);

    const max = calculateCosts({
      weeklyFee: 250,
      weeks: 24,
      cityGuide: nyGuide,
    });
    expect(max.tuition).toBe(6000);
  });
});
