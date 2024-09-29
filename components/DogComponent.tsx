// DogComponent.tsx
import React from 'react';
import Image from 'next/image'; // Update to 'Image' from 'next/image' for proper import

type Props = {
  isJumping: boolean; // New prop to track jumping state
};

const DogComponent = ({ isJumping }: Props) => {
  const dogImageSrc = isJumping
    ? '/assets/dog_jumping.png' // Use the jumping image
    : '/assets/dog-character.png'; // Use the default image

    const width = isJumping === true ? 90 : 80;  // Log width and Mushroom width
    const height = isJumping === true ? 110 : 100;  // Log height and Mushroom height

  return (
    <div>
      <Image 
        src={dogImageSrc} 
        width= {width} 
        height= {height}
        alt={isJumping ? "Jumping dog" : "Default stance of a dog character"} 
      />
    </div>
  );
}

export default DogComponent;
