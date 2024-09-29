"use client"
import SmileRecognizer from "../components/SmileRecognizer";
import DogComponent from "@/components/DogComponent";
import { useState, useEffect, useRef } from "react";
import BackgroundComponent from "@/components/BackgroundComponent";
import ObstacleComponent from "@/components/ObstacleComponent";
import GameInfoOverlay from "@/components/GameInfoOverlay";

export default function Home() {
  const [dogYPos, setDogYPos] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [backgroundPos, setBackgroundPos] = useState([0, window.innerWidth]);
  const [obstacles, setObstacles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  
  // New states for lives and game over
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);

  const backgroundAnimationRef = useRef<number | null>(null);
  const obstacleAnimationRef = useRef<number | null>(null);
  const dogRef = useRef<HTMLDivElement | null>(null);

  const setSmileResults = (result: any) => {
    setIsLoading(result.isLoading);
    if (result.isDetected && !isJumping) {
      if (!gameStarted) {
        setGameStarted(true);
        setIsPaused(false);
      }
      setIsJumping(true);
      setDogYPos(dogYPos + 120);

      setTimeout(() => {
        setDogYPos(0);
        setIsJumping(false);
      }, 1500);
    }
  };

  // Handle collision detection and lives management
  const handleCollision = () => {
    setLives(prevLives => {
      if (prevLives > 1) {
        return prevLives - 1;
      } else {
        setGameOver(true);
        setIsPaused(true);
        return 0; // Set lives to 0 when game is over
      }
    });
  };

  useEffect(() => {
    if (lives === 0) {
      setGameOver(true);
      setIsPaused(true);
    }
  }, [lives]);

  // Move the background infinitely
  useEffect(() => {
    const speed = 2.4;

    const moveBackground = () => {
      if (!isPaused) {
        setBackgroundPos(([bg1, bg2]) => {
          const newBg1 = bg1 - speed;
          const newBg2 = bg2 - speed;

          const resetBg1 = newBg1 < -window.innerWidth ? bg2 + window.innerWidth : newBg1;
          const resetBg2 = newBg2 < -window.innerWidth ? resetBg1 + window.innerWidth : newBg2;

          return [resetBg1, resetBg2];
        });
      }

      backgroundAnimationRef.current = requestAnimationFrame(moveBackground);
    };

    moveBackground();

    return () => {
      if (backgroundAnimationRef.current) {
        cancelAnimationFrame(backgroundAnimationRef.current);
      }
    };
  }, [isPaused]);

  // Generate obstacles at random intervals
  useEffect(() => {
    const generateObstacles = () => {
      if (isPaused || gameOver) return; // Stop generating obstacles if game is paused or over

      const randomInterval = Math.random() * 6000 + 4000;
      const minSpacing = 500;

      setObstacles(prev => {
        const lastObstacle = prev[prev.length - 1];
        const lastXPos = lastObstacle ? lastObstacle.xPos : -minSpacing;

        if (window.innerWidth - lastXPos > minSpacing) {
          return [
            ...prev,
            {
              xPos: window.innerWidth,
              // yPos: Math.random() * 100 + 150,
              type: Math.random() > 0.5 ? 'log' : 'mushroom',
              key: Date.now(),
            },
          ];
        } else {
          return prev;
        }
      });

      setTimeout(generateObstacles, randomInterval);
    };

    generateObstacles();
  }, [isPaused, gameOver]);

  // Move the obstacles and remove them if off-screen
  useEffect(() => {
    const obstacleSpeed = 2.4;

    const moveObstacles = () => {
      if (isPaused || gameOver) return; // Stop moving obstacles if game is paused or over

      const dogRect = dogRef.current?.getBoundingClientRect();

      setObstacles(prev => {
        return prev
          .map(obs => {
            const obsRect = document.getElementById(`obstacle-${obs.type}-${obs.xPos}`)?.getBoundingClientRect();

            if (dogRect && obsRect && checkCollision(dogRect, obsRect)) {
              handleCollision(); // Call handleCollision on collision
            }

            return {
              ...obs,
              xPos: obs.xPos - obstacleSpeed,
            };
          })
          .filter(obs => obs.xPos > -100);
      });

      obstacleAnimationRef.current = requestAnimationFrame(moveObstacles);
    };

    moveObstacles();
    return () => {
      if (obstacleAnimationRef.current) {
        cancelAnimationFrame(obstacleAnimationRef.current);
      }
    };
  }, [isPaused, gameOver]);

  const checkCollision = (dogRect: DOMRect, obsRect: DOMRect) => {
    return (
      dogRect.x < obsRect.x + obsRect.width &&
      dogRect.x + dogRect.width > obsRect.x &&
      dogRect.y < obsRect.y + obsRect.height &&
      dogRect.y + dogRect.height > obsRect.y
    );
  };

  // Restart the game
  const restartGame = () => {
    setLives(3);
    setGameOver(false);
    setObstacles([]); // Reset obstacles
    setGameStarted(false); // Reset game started
    setIsPaused(true); // Pause the game until the first smile
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-40">
      <div className="absolute left-30 top-3 z-30">
        <SmileRecognizer setSmileResults={setSmileResults} />
      </div>

      <div>
        <div
          id="dog-container"
          ref={dogRef}
          style={{
            position: "relative",
            bottom: dogYPos - 200,
            left: "-200px",
            zIndex: 100,
          }}
        >
          <DogComponent isJumping={isJumping} />
        </div>

        {obstacles.map((obstacle, index) => (
          <ObstacleComponent key={obstacle.key} xPos={obstacle.xPos} type={obstacle.type} />
        ))}
        <BackgroundComponent xPos={backgroundPos[0]} />
        <BackgroundComponent xPos={backgroundPos[1]} />
      </div>

      <GameInfoOverlay
        info={{
          isLoading,
          gameStarted,
          lives, // Pass lives to the overlay
          gameOver, // Pass game over state
          onRestart: restartGame, // Pass restart function
        }}
      />
    </main>
  );
}
