import React from 'react';
import Image from 'next/image';

type Props = {
  xPos: number;  // Position on the X-axis
  type: 'log' | 'mushroom';  // Type of obstacle ('log' or 'mushroom')
};

const ObstacleComponent = ({ xPos, type }: Props) => {
  const width = type === 'log' ? 110 : 90;  // Log width and Mushroom width
  const height = type === 'log' ? 70 : 85;  // Log height and Mushroom height

  // Determine the image source based on the obstacle type
  const imageSrc = type === 'log' 
    ? '/assets/log_obstacle.png' 
    : '/assets/mushroom_obstacle.png'; 

  return (
    <div
      id={`obstacle-${type}-${xPos}`}  // Unique ID for each obstacle for collision detection
      style={{
        position: 'absolute',
        left: `${xPos}px`,
        top: 550,
        height: `${height}px`, // Adjust dimensions for both obstacles
        width: `${width}px`,  // Use fixed width based on obstacle type
        zIndex: 50
      }}
    >
      <Image
        src={imageSrc}
        alt={`${type} obstacle`}
        layout="fill"
        objectFit="cover"
      />
    </div>
  );
};

export default ObstacleComponent;
