import React, { Component, ComponentType, forwardRef } from 'react';
import { any } from 'prop-types';

declare global {
  export const __isVkuiStyleguide: boolean;
}

/* eslint-disable no-restricted-globals */

export type FrameProps = {
  window?: typeof window;
  document?: typeof document;
};

/**
 * Прокидывает window и document из react-frame-component в пропы
 */
export function withFrame<Type extends ComponentType<any>>(Cmp: Type): Type {
  let defaultProps = { window, document, ...Cmp.defaultProps };
  Object.defineProperty(Cmp, 'defaultProps', {
    get: () => defaultProps,
    set: (nextDefaultProps) => {
      defaultProps = { window, document, ...nextDefaultProps };
    },
    enumerable: true,
    configurable: true,
  });

  // skip context check in production
  if (typeof __isVkuiStyleguide === 'undefined' || !__isVkuiStyleguide) {
    return Cmp;
  }

  class WithFrame extends Component<any> {
    static contextTypes = {
      window: any,
      document: any,
    };

    render() {
      const { __innerRef, children, ...props } = this.props;
      return <Cmp {...this.context} {...props} ref={__innerRef}>{children}</Cmp>;
    }
  }
  return forwardRef<any, any>(function WithRef(props, ref) {
    return <WithFrame {...props} __innerRef={ref}>{props.children}</WithFrame>;
  }) as unknown as Type;
}
