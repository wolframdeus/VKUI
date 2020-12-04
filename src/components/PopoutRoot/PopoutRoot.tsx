import React, { Component, HTMLAttributes, ReactNode } from 'react';
import classNames from '../../lib/classNames';
import { HasPlatform, HasRootRef } from '../../types';
import withAdaptivity, { ViewWidth, AdaptivityProps } from '../../hoc/withAdaptivity';
import { FrameProps, withFrame } from '../../hoc/withFrame';

export interface PopoutRootProps extends HTMLAttributes<HTMLDivElement>, HasPlatform, AdaptivityProps, HasRootRef<HTMLDivElement> {
  popout?: ReactNode;
  modal?: ReactNode;
}

class PopoutRoot extends Component<PopoutRootProps & FrameProps> {
  static defaultProps: Partial<PopoutRootProps> = {
    popout: null,
  };

  componentDidUpdate(prevProps: PopoutRootProps) {
    if (this.props.popout && !prevProps.popout) {
      this.blurActiveElement();
    }
  }

  blurActiveElement() {
    if (typeof this.props.window !== 'undefined' && this.props.document.activeElement) {
      (this.props.document.activeElement as HTMLElement).blur();
    }
  }

  render() {
    const { popout, modal, viewWidth, children, className, getRootRef, ...restProps } = this.props;
    const isDesktop = viewWidth >= ViewWidth.TABLET;

    return (
      <div
        {...restProps}
        className={classNames('PopoutRoot', className)}
        ref={getRootRef}
      >
        {children}
        {!!popout && <div className={isDesktop ? 'PopoutRoot--absolute' : 'PopoutRoot__popout'}>{popout}</div>}
        {!!modal && <div className="PopoutRoot__modal">{modal}</div>}
      </div>
    );
  }
}

export default withAdaptivity(withFrame(PopoutRoot), {
  viewWidth: true,
});
