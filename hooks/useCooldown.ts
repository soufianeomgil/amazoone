import { useEffect, useState } from "react";

export function useCooldown(seconds: number) {
  const [timeLeft, setTimeLeft] = useState(0);

  const start = () => {
    setTimeLeft(seconds);
  };

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  return {
    timeLeft,
    start,
    isActive: timeLeft > 0,
  };
}
