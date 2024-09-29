// export default BackgroundComponent
import React from 'react';
import Image from 'next/image';

type Props = {
  xPos: number;  // Position on the X-axis passed from the parent
};

const BackgroundComponent = ({ xPos }: Props) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${xPos}px`,
        top: 450,
        height: '34%',
        width: '110%',
      }}
    >
      <Image
        src="/assets/grass_background_update.png"
        alt="Grassy background"
        layout="fill" // Automatically stretches to fill the container
        objectFit="cover" // Ensures it covers the entire container without distorting
      />
    </div>
  );
};

export default BackgroundComponent;
