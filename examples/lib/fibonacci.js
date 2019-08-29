const seq = [0, 1];
const fibonacci = n => {
  const pos = parseInt(n);
  if(isNaN(pos) || pos.toString() !== n.toString() || pos < 0) {
    return -1;
  }

  if(!seq.hasOwnProperty(n)) {
    for(let i = seq.length; i < n + 1; i++) {
      if(seq[i-1] === Infinity) {
        return Infinity;
      }

      seq[i] = seq[i-1] + seq[i-2];
    }
  }

  return seq[n];
};

module.exports = {
  fibonacci,
};
