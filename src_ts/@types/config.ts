interface DurationSeconds {
  seconds: number;
}

interface DurationMinutes {
  minutes: number;
}

export interface Config {
  worker: {
    setup: Function;
    threads: {
      amount: number;
      iterations: number;
    };
  };
  duration?: DurationSeconds | DurationMinutes;
}
