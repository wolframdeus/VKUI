import React from 'react';
import { Checkbox, CheckboxProps } from './Checkbox';
import { describeScreenshotFuzz } from '../../testing/utils';

describe('Checkbox', () => {
  describeScreenshotFuzz((props: CheckboxProps) => <Checkbox {...props}>label</Checkbox>, [{
    checked: [false, true],
    disabled: [undefined, true],
  }], {});
});
