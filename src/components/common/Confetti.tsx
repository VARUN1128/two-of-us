import confetti from 'canvas-confetti';

/**
 * Triggers brand-colored celebration confetti
 */
export function fireBingoConfetti(isFullBoard = false) {
  const colors = ['#088F87', '#A3C4CB', '#0B3B3D', '#FFFFFF', '#0AB3A9'];

  if (isFullBoard) {
    // Grand celebration for full board completion
    const end = Date.now() + 3.5 * 1000;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  } else {
    // Line completion burst
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors,
      disableForReducedMotion: true,
    });
  }
}
