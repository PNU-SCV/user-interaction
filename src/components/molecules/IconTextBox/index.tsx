import checking from '@images/checking.svg';
import { RobotoComment } from '@components/atoms/RobotoComment';
import { Flex } from '@components/atoms/Flex';
import React from 'react';

interface IIconTextBox {
  src: string;
  imgAlt: string;
  text: string;
  imgSize?: number;
}

export const IconTextBox = ({ src, imgAlt, text, imgSize = 50 }: IIconTextBox) => (
  <Flex justifyContent="center">
    <img width={`${imgSize}px`} src={src} alt={imgAlt} />
    <RobotoComment comment={text} />
  </Flex>
);
