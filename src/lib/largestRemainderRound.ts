// Adapted from https://github.com/ManNguyen/LargestRemainderRound

/**
 * @hidden
 */
const getRemainder = a => {
  return (a - Math.floor(a)).toFixed(4);
};

/**
 * @hidden
 */
export const largestRemainderRound = (numArr, totalSeats, decimalNum) => {
  totalSeats = totalSeats || 100;
  decimalNum = decimalNum || 0;
  if (numArr.find(x => typeof x !== "number" || x < 0)) {
    throw new Error("This is not an array of positive numbers");
  }
  if (decimalNum > 0) {
    const multi = Math.pow(10, decimalNum);
    // call the spread no decimal against multi of total seats
    const powSpread = largestRemainderRound(numArr, totalSeats * multi, 0);
    return powSpread.map(e => e / multi);
  }
  const sum = numArr.reduce((s, i) => s + i, 0);
  // 1. distribute default seats and prioritize the party with high remainder
  const seatDistribution = numArr
    .map((num, index) => {
      const seats = (num / sum) * totalSeats;
      return {
        index,
        remainder: getRemainder(seats),
        seats: Math.floor(seats)
      };
    })
    .sort((a, b) => {
      return b.remainder - a.remainder;
    });

  // 2. get the total remain seats
  const takenSeats = seatDistribution.reduce(
    ($sum, current) => $sum + current.seats,
    0
  );
  const totalRemains = totalSeats - takenSeats;

  // the total remains always smaller than total parties
  for (let i = 0; i < totalRemains; i++) {
    seatDistribution[i].seats++;
  }

  return seatDistribution.sort((a, b) => a.index - b.index).map(a => a.seats);
};
