import checking from '@images/checking.svg';
import { RobotoComment } from '@components/atoms/RobotoComment';
import { Flex } from '@components/atoms/Flex';
import React from 'react';

interface IIconTextBox {
  src: string;
  imgAlt: string;
  text: string;
}

export const IconTextBox = ({ src, imgAlt, text }: IIconTextBox) => (
  <Flex justifyContent="center">
    <img width="50px" src={src} alt={imgAlt} />
    <RobotoComment comment={text} />
  </Flex>
);
